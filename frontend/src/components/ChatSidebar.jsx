import "../styles/ChatSidebar.css";
import { ArrowLeft, Plus, Search, MessageSquare, Trash2 } from "lucide-react";

import { usePage } from "../context/PageContext";

function ChatSidebar({
  conversations,
  currentConversationId,
  createNewChat,
  deleteChat,
  setCurrentConversationId,
  user,
}) {
  const { setActivePage } = usePage();

  return (
    <aside className="chat-sidebar">
      {/* BACK TO DASHBOARD */}
      <button
        className="chat-back-button"
        onClick={() => setActivePage("dashboard")}
      >
        <ArrowLeft size={17} />
        <span>Dashboard</span>
      </button>

      {/* NEW CHAT */}
      <button className="chat-new-button" onClick={createNewChat}>
        <Plus size={18} />
        <span>New Chat</span>
      </button>

      {/* SEARCH */}
      <div className="chat-search">
        <Search size={16} />

        <input type="text" placeholder="Search conversations..." />
      </div>

      {/* CONVERSATIONS */}
      <div className="chat-conversations">
        {conversations.length === 0 ? (
          <div className="empty-conversations">
            <MessageSquare size={20} />

            <span>No conversations yet</span>
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`chat-conversation ${
                conversation.id === currentConversationId ? "active" : ""
              }`}
            >
              <button
                className="chat-conversation-main"
                onClick={() => {
                  setCurrentConversationId(conversation.id);

                  setActivePage("chat");
                }}
              >
                <MessageSquare size={16} />

                <span>{conversation.title}</span>
              </button>

              <button
                className="chat-delete-button"
                onClick={(event) => {
                  event.stopPropagation();
                  deleteChat(conversation.id);
                }}
                title="Delete conversation"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* BOTTOM */}
      <div className="chat-sidebar-bottom">
        <div className="chat-user">
          <div className="chat-user-avatar">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <div>
            <strong>{user?.name || "User"}</strong>

            <span>{user?.role === "admin" ? "Administrator" : "Employee"}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default ChatSidebar;
