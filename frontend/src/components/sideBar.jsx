import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  createConversationThunk,
  getUserConversationsThunk,
  renameConversationThunk,
  deleteConversationThunk,
} from "../redux/thunks/conversationThunks";

import {logoutUserThunk} from "../redux/thunks/authThunks";

import ConversationItem from "./ConversationItem";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { conversationId } = useParams();

  const { conversations, loading, error } = useSelector(
    (state) => state.conversations,
  );

  useEffect(() => {
    dispatch(getUserConversationsThunk());
  }, [dispatch]);

  const handleNewChat = async () => {
    const result = await dispatch(createConversationThunk("normal"));

    if (createConversationThunk.fulfilled.match(result)) {
      navigate(`/chat/${result.payload._id}`);
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUserThunk());
    navigate("/login");
  };

  const handleRename = async (id, title) => {
    await dispatch(
      renameConversationThunk({
        conversationId: id,
        title,
      }),
    );
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this conversation?",
    );

    if (!confirmed) return;

    const result = await dispatch(deleteConversationThunk(id));

    if (deleteConversationThunk.fulfilled.match(result)) {
      if (conversationId === id) {
        navigate("/chat");
      }
    }
  };

  return (
    <aside className="sidebar">
      <button className="new-chat-btn" onClick={handleNewChat}>
        + New Chat
      </button>
      <button className="settings-btn" onClick={() => navigate("/settings")}>
        ⚙ Custom Instructions
      </button>
      
      

      {error && <p className="error-text">{error}</p>}

      <div className="conversation-list">
        {loading && <p>Loading chats...</p>}

        {!loading && conversations.length === 0 && (
          <p className="empty-text">No chats yet</p>
        )}

        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation._id}
            conversation={conversation}
            isActive={conversationId === conversation._id}
            onOpen={() => navigate(`/chat/${conversation._id}`)}
            onRename={handleRename}
            onDelete={() => handleDelete(conversation._id)}
          />
        ))}
      </div>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
