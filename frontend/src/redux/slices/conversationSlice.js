import { createSlice } from "@reduxjs/toolkit";
import {
  createConversationThunk,
  getUserConversationsThunk,
  getConversationByIdThunk,
  renameConversationThunk,
  deleteConversationThunk,
} from "../thunks/conversationThunks";

import { sendMessageThunk } from "../thunks/chatThunks";

const initialState = {
  conversations: [],
  activeConversation: null,
  loading: false,
  activeLoading: false,
  error: null,
};

const conversationSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    clearConversationError: (state) => {
      state.error = null;
    },

    addLocalUserMessage: (state, action) => {
      if (!state.activeConversation) return;

      state.activeConversation.messages.push({
        _id: action.payload.localId,
        role: "user",
        content: action.payload.content,
        mode: action.payload.mode,
      });
    },

    startLocalAssistantMessage: (state, action) => {
      if (!state.activeConversation) return;

      state.activeConversation.messages.push({
        _id: action.payload.localId,
        role: "assistant",
        content: "",
        mode: action.payload.mode,
        isStreaming: true,
      });
    },

    appendToLocalAssistantMessage: (state, action) => {
      if (!state.activeConversation) return;

      const message = state.activeConversation.messages.find(
        (msg) => msg._id === action.payload.localId,
      );

      if (message) {
        message.content += action.payload.content;
      }
    },

    finishLocalAssistantMessage: (state, action) => {
      if (!state.activeConversation) return;

      const message = state.activeConversation.messages.find(
        (msg) => msg._id === action.payload.localId,
      );

      if (message) {
        message.isStreaming = false;
      }

      if (action.payload.title) {
        state.activeConversation.title = action.payload.title;

        const index = state.conversations.findIndex(
          (conversation) => conversation._id === state.activeConversation._id,
        );

        if (index !== -1) {
          state.conversations[index].title = action.payload.title;
        }
      }
    },

    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },
    removeLocalMessages: (state, action) => {
      if (!state.activeConversation) return;

      const { userLocalId, assistantLocalId } = action.payload;

      state.activeConversation.messages =
        state.activeConversation.messages.filter(
          (message) =>
            message._id !== userLocalId && message._id !== assistantLocalId,
        );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserConversationsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserConversationsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(getUserConversationsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createConversationThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createConversationThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations.unshift(action.payload);
        state.activeConversation = action.payload;
      })
      .addCase(createConversationThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getConversationByIdThunk.pending, (state) => {
        state.activeLoading = true;
        state.error = null;
      })
      .addCase(getConversationByIdThunk.fulfilled, (state, action) => {
        state.activeLoading = false;
        state.activeConversation = action.payload;
      })
      .addCase(getConversationByIdThunk.rejected, (state, action) => {
        state.activeLoading = false;
        state.error = action.payload;
      })
      .addCase(sendMessageThunk.fulfilled, (state, action) => {
        state.activeConversation = action.payload.conversation;

        const updatedConversation = action.payload.conversation;

        const index = state.conversations.findIndex(
          (conversation) => conversation._id === updatedConversation._id,
        );

        if (index !== -1) {
          state.conversations[index] = {
            ...state.conversations[index],
            title: updatedConversation.title,
            mode: updatedConversation.mode,
            updatedAt: updatedConversation.updatedAt,
          };
        }
      })
      .addCase(renameConversationThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(renameConversationThunk.fulfilled, (state, action) => {
        const updatedConversation = action.payload;

        const index = state.conversations.findIndex(
          (conversation) => conversation._id === updatedConversation._id,
        );

        if (index !== -1) {
          state.conversations[index] = {
            ...state.conversations[index],
            title: updatedConversation.title,
            updatedAt: updatedConversation.updatedAt,
          };
        }

        if (state.activeConversation?._id === updatedConversation._id) {
          state.activeConversation = {
            ...state.activeConversation,
            title: updatedConversation.title,
            updatedAt: updatedConversation.updatedAt,
          };
        }
      })
      .addCase(renameConversationThunk.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(deleteConversationThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteConversationThunk.fulfilled, (state, action) => {
        const deletedConversationId = action.payload;

        state.conversations = state.conversations.filter(
          (conversation) => conversation._id !== deletedConversationId,
        );

        if (state.activeConversation?._id === deletedConversationId) {
          state.activeConversation = null;
        }
      })
      .addCase(deleteConversationThunk.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
   clearConversationError,
  setActiveConversation,
  addLocalUserMessage,
  startLocalAssistantMessage,
  appendToLocalAssistantMessage,
  finishLocalAssistantMessage,
  removeLocalMessages,
} = conversationSlice.actions;

export default conversationSlice.reducer;
