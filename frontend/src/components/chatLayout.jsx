import Sidebar from "./sidebar";
import ChatWindow from "./chatWindow";

const ChatLayout = () => {
  return (
    <div className="chat-layout">
      <Sidebar />
      <ChatWindow />
    </div>
  );
};

export default ChatLayout;