import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loadCurrentUserThunk } from "./redux/thunks/authThunks";

import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import ChatPage from "./pages/chatPage";
import ProtectedRoute from "./routes/ProtectedRoutes";
import SettingsPage from "./pages/SettingsPage";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadCurrentUserThunk());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/chat" replace />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
          <ChatPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat/:conversationId"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
