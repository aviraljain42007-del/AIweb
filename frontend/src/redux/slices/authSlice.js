import { createSlice } from "@reduxjs/toolkit";
import {
  registerUserThunk,
  loginUserThunk,
  logoutUserThunk,
  loadCurrentUserThunk,
} from "../thunks/authThunks";

import {
  getCustomInstructionsThunk,
  updateCustomInstructionsThunk,
} from "../thunks/userThunks";

const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  authChecked: false,

  customInstructions: null,
  settingsLoading: false,
  settingsError: null,
  settingsSuccess: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    clearSettingsStatus: (state) => {
      state.settingsError = null;
      state.settingsSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.authChecked = true;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.authChecked = true;
      })

      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.authChecked = true;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.authChecked = true;
      })

      .addCase(loadCurrentUserThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadCurrentUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.authChecked = true;
      })
      .addCase(loadCurrentUserThunk.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.authChecked = true;
      })
      .addCase(getCustomInstructionsThunk.pending, (state) => {
        state.settingsLoading = true;
        state.settingsError = null;
      })
      .addCase(getCustomInstructionsThunk.fulfilled, (state, action) => {
        state.settingsLoading = false;
        state.customInstructions = action.payload;
      })
      .addCase(getCustomInstructionsThunk.rejected, (state, action) => {
        state.settingsLoading = false;
        state.settingsError = action.payload;
      })

      .addCase(updateCustomInstructionsThunk.pending, (state) => {
        state.settingsLoading = true;
        state.settingsError = null;
        state.settingsSuccess = false;
      })
      .addCase(updateCustomInstructionsThunk.fulfilled, (state, action) => {
        state.settingsLoading = false;
        state.settingsSuccess = true;
        state.customInstructions = action.payload;

        if (state.user) {
          state.user.customInstructions = action.payload;
        }
      })
      .addCase(updateCustomInstructionsThunk.rejected, (state, action) => {
        state.settingsLoading = false;
        state.settingsError = action.payload;
        state.settingsSuccess = false;
      })

      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        state.authChecked = true;
      });
  },
});

export const { clearAuthError, clearSettingsStatus } = authSlice.actions;
export default authSlice.reducer;
