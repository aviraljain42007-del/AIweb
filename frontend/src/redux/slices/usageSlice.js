import { createSlice } from "@reduxjs/toolkit";
import { getUsageThunk } from "../thunks/usageThunks";

const initialState = {
  usage: null,
  loading: false,
  error: null,
};

const usageSlice = createSlice({
  name: "usage",
  initialState,
  reducers: {
    clearUsageError: (state) => {
      state.error = null;
    },

    resetUsageState: (state) => {
      state.usage = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsageThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsageThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.usage = action.payload;
      })
      .addCase(getUsageThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUsageError, resetUsageState } = usageSlice.actions;
export default usageSlice.reducer;