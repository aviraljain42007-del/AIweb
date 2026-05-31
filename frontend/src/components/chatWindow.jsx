import { useEffect , useRef} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { getConversationByIdThunk } from "../redux/thunks/conversationThunks";
import PromptInput from "./PromptInput";
import MessageBubble from "./messageBubble";


const ChatWindow = () => {
  const dispatch = useDispatch();
  const { conversationId } = useParams();

  const messagesContainerRef = useRef(null);

  const { activeConversation, activeLoading } = useSelector(
    (state) => state.conversations
  );

  useEffect(() => {
    if (conversationId) {
      dispatch(getConversationByIdThunk(conversationId));
    }
  }, [conversationId, dispatch]);

  const isUserNearBottom = () => {
    const container = messagesContainerRef.current;

    if (!container) return true;

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    return distanceFromBottom < 120;
  };

  const scrollToBottom = (behavior = "auto") => {
    const container = messagesContainerRef.current;

    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    });
  };

  useEffect(() => {
    if (!activeConversation?.messages) return;

    if (isUserNearBottom()) {
      scrollToBottom("auto");
    }
  }, [activeConversation?.messages]);

  if (!conversationId) {
    return (
      <main className="chat-window">
        <div className="welcome-box">
          <h1>DevStudy AI</h1>
          <p>Create a new chat to start learning.</p>
          <p className="empty-text">
            Use it for code explanation, summaries, interview prep, and MERN doubts.
          </p>
        </div>
      </main>
    );
  }

  if (activeLoading) {
    return (
      <main className="chat-window">
        <div className="welcome-box">
          <p>Loading conversation...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="chat-window">
      <div className="chat-header">
        <h2>{activeConversation?.title || "New Chat"}</h2>
        <span>{activeConversation?.mode || "normal"}</span>
      </div>

      <div className="messages" ref={messagesContainerRef}>
        {activeConversation?.messages?.length === 0 && (
          <div className="empty-chat-box">
            <h2>Start this conversation</h2>
            <p>Ask a question, paste code, or choose a mode below.</p>
          </div>
        )}

        {activeConversation?.messages?.map((message) => (
          <MessageBubble key={message._id} message={message} />
        ))}
      </div>

      <PromptInput />
    </main>
  );
};

export default ChatWindow;