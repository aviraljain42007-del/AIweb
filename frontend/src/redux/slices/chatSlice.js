import { createSlice } from "@reduxjs/toolkit";
import { sendMessageThunk } from "../thunks/chatThunks";

const initialState = {
  sending: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    clearChatError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessageThunk.pending, (state) => {
        state.sending = true;
        state.error = null;
      })
      .addCase(sendMessageThunk.fulfilled, (state) => {
        state.sending = false;
      })
      .addCase(sendMessageThunk.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload;
      });
  },
});

export const { clearChatError } = chatSlice.actions;
export default chatSlice.reducer;