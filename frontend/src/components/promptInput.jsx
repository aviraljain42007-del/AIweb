import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import ModeSelector from "./ModeSelector";
import { streamMessage } from "../utils/streamMessage";
import { getUsageThunk } from "../redux/thunks/usageThunks";

import {
  addLocalUserMessage,
  startLocalAssistantMessage,
  appendToLocalAssistantMessage,
  finishLocalAssistantMessage,
  removeLocalMessages,
} from "../redux/slices/conversationSlice";

const PromptInput = () => {
  const dispatch = useDispatch();
  const { conversationId } = useParams();

  const inputRef = useRef(null);

  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("normal");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [conversationId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt || !conversationId || sending) {
      return;
    }

    setPrompt("");
    setError(null);
    setSending(true);

    const timestamp = Date.now();
    const userLocalId = `local-user-${timestamp}`;
    const assistantLocalId = `local-assistant-${timestamp + 1}`;

    dispatch(
      addLocalUserMessage({
        localId: userLocalId,
        content: trimmedPrompt,
        mode,
      })
    );

    dispatch(
      startLocalAssistantMessage({
        localId: assistantLocalId,
        mode,
      })
    );

    try {
      await streamMessage({
        conversationId,
        prompt: trimmedPrompt,
        mode,

        onChunk: (content) => {
          dispatch(
            appendToLocalAssistantMessage({
              localId: assistantLocalId,
              content,
            })
          );
        },

        onDone: (data) => {
          dispatch(
            finishLocalAssistantMessage({
              localId: assistantLocalId,
              title: data.title,
            })
          );

          dispatch(getUsageThunk());
        },

        onError: (message) => {
          setError(message || "AI streaming failed. Please try again.");
        },
      });
    } catch (error) {
      dispatch(
        removeLocalMessages({
          userLocalId,
          assistantLocalId,
        })
      );

      setError(error.message || "Something went wrong");
      setPrompt(trimmedPrompt);

      dispatch(getUsageThunk());
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="prompt-area">
      {error && <p className="error-text">{error}</p>}

      <form className="prompt-form" onSubmit={handleSubmit}>
        <ModeSelector mode={mode} setMode={setMode} />

        <textarea
          ref={inputRef}
          className="prompt-input"
          placeholder="Ask DevStudy AI..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          disabled={sending}
        />

        <button type="submit" disabled={sending || !prompt.trim()}>
          {sending ? "Thinking..." : "Send"}
        </button>
      </form>

      <p className="prompt-hint">Enter to send • Shift + Enter for new line</p>
    </div>
  );
};

export default PromptInput;
