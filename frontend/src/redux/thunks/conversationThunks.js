import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

const getErrorMessage = (error) => {
  return error.response?.data?.message || error.message || "Something went wrong";
};

export const createConversationThunk = createAsyncThunk(
  "conversations/create",
  async (mode = "normal", { rejectWithValue }) => {
    try {
      const response = await api.post("/conversations", { mode });
      return response.data.data.conversation;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getUserConversationsThunk = createAsyncThunk(
  "conversations/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/conversations");
      return response.data.data.conversations;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getConversationByIdThunk = createAsyncThunk(
  "conversations/getById",
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/conversations/${conversationId}`);
      return response.data.data.conversation;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);
export const renameConversationThunk = createAsyncThunk(
  "conversations/rename",
  async ({ conversationId, title }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/conversations/${conversationId}`, {
        title,
      });

      return response.data.data.conversation;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteConversationThunk = createAsyncThunk(
  "conversations/delete",
  async (conversationId, { rejectWithValue }) => {
    try {
      await api.delete(`/conversations/${conversationId}`);
      return conversationId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);