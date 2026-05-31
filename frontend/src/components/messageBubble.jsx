import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

const MessageBubble = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={isUser ? "message message-user" : "message message-assistant"}>
      <strong>{isUser ? "You" : "CodeSaarthi"}</strong>

      {isUser ? (
        <p className="user-message-text">{message.content}</p>
      ) : (
        <div className="markdown-content">
          {message.content ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {message.content}
            </ReactMarkdown>
          ) : (
            <p className="typing-dots">Thinking...</p>
          )}

          {message.isStreaming && message.content && (
            <span className="streaming-cursor">▌</span>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;