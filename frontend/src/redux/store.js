import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import conversationReducer from "./slices/conversationSlice";
import chatReducer from "./slices/chatSlice";
import usageReducer from "./slices/usageSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    conversations: conversationReducer,
    chat: chatReducer,
    usage:usageReducer,
  },
});

export default store;