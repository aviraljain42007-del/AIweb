import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

const getErrorMessage = (error) => {
  return error.response?.data?.message || error.message || "Something went wrong";
};

export const getCustomInstructionsThunk = createAsyncThunk(
  "user/getCustomInstructions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/users/me/instructions");
      return response.data.data.customInstructions;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateCustomInstructionsThunk = createAsyncThunk(
  "user/updateCustomInstructions",
  async (instructions, { rejectWithValue }) => {
    try {
      const response = await api.patch("/users/me/instructions", instructions);
      return response.data.data.customInstructions;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);