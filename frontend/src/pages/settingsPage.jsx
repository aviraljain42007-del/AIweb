import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getCustomInstructionsThunk,
  updateCustomInstructionsThunk,
} from "../redux/thunks/userThunks";

import { clearSettingsStatus } from "../redux/slices/authSlice";

const SettingsPage = () => {
  const dispatch = useDispatch();

  const {
    customInstructions,
    settingsLoading,
    settingsError,
    settingsSuccess,
  } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    preferredLanguage: "Hinglish",
    learningGoal: "",
    responseStyle: "Step-by-step explanation",
  });

  useEffect(() => {
    dispatch(getCustomInstructionsThunk());
  }, [dispatch]);

  useEffect(() => {
    if (customInstructions) {
      setFormData({
        preferredLanguage: customInstructions.preferredLanguage || "Hinglish",
        learningGoal: customInstructions.learningGoal || "",
        responseStyle:
          customInstructions.responseStyle || "Step-by-step explanation",
      });
    }
  }, [customInstructions]);

  useEffect(() => {
    if (settingsSuccess) {
      const timer = setTimeout(() => {
        dispatch(clearSettingsStatus());
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [settingsSuccess, dispatch]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateCustomInstructionsThunk(formData));
  };

  return (
    <div className="settings-page">
      <div className="settings-card">
        <h1>Custom Instructions</h1>
        <p className="settings-subtitle">
          Tell CodeSaarthi how it should help you.
        </p>

        {settingsError && <p className="error-text">{settingsError}</p>}
        {settingsSuccess && (
          <p className="success-text">Instructions saved successfully.</p>
        )}

        <form onSubmit={handleSubmit} className="settings-form">
          <label>
            Preferred Language
            <select
              name="preferredLanguage"
              value={formData.preferredLanguage}
              onChange={handleChange}
            >
              <option value="Hinglish">Hinglish</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </select>
          </label>

          <label>
            Learning Goal
            <textarea
              name="learningGoal"
              value={formData.learningGoal}
              onChange={handleChange}
              placeholder="Example: I want to become job-ready in MERN + AI projects."
              rows={3}
            />
          </label>

          <label>
            Response Style
            <textarea
              name="responseStyle"
              value={formData.responseStyle}
              onChange={handleChange}
              placeholder="Example: Explain internals step-by-step with interview points."
              rows={3}
            />
          </label>

          <button type="submit" disabled={settingsLoading}>
            {settingsLoading ? "Saving..." : "Save Instructions"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;