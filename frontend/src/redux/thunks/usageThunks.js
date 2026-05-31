import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

const getErrorMessage = (error) => {
  return error.response?.data?.message || error.message || "Something went wrong";
};

export const getUsageThunk = createAsyncThunk(
  "usage/getUsage",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/usage/me");
      return response.data.data.usage;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);