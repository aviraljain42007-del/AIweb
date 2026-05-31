import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

const getErrorMessage = (error) => {
  return error.response?.data?.message || error.message || "Something went wrong";
};

export const sendMessageThunk = createAsyncThunk(
  "chat/sendMessage",
  async ({ conversationId, prompt, mode }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/chat/${conversationId}/message`, {
        prompt,
        mode,
      });

      return response.data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);