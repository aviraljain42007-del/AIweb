import { useState } from "react";

const ConversationItem = ({
  conversation,
  isActive,
  onOpen,
  onRename,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(conversation.title);

  const handleRenameSubmit = (e) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setTitle(conversation.title);
      setIsEditing(false);
      return;
    }

    if (trimmedTitle !== conversation.title) {
      onRename(conversation._id, trimmedTitle);
    }

    setIsEditing(false);
  };

  return (
    <div className={isActive ? "conversation-row active" : "conversation-row"}>
      {isEditing ? (
        <form className="rename-form" onSubmit={handleRenameSubmit}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            onBlur={handleRenameSubmit}
          />
        </form>
      ) : (
        <>
          <button className="conversation-title" onClick={onOpen}>
            {conversation.title}
          </button>

          <div className="conversation-actions">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              title="Rename"
            >
              ✎
            </button>

            <button type="button" onClick={onDelete} title="Delete">
              ×
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ConversationItem;