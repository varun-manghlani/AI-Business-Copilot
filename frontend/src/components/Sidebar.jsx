import "../styles/Sidebar.css";

function Sidebar({
  conversations,
  currentConversationId,
  createNewChat,
  deleteChat,
  setCurrentConversationId,
  activePage,
  setActivePage,
  user,
  setUser,
}) {
  return (
    <div className="sidebar">
      <button
        className="new-chat-btn"
        onClick={() => {
          createNewChat();
        }}
      >
        + New Chat
      </button>

      <div className="conversation-list">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`conversation-item ${
              conversation.id === currentConversationId ? "active" : ""
            }`}
          >
            <span
              className="conversation-title"
              onClick={() => {
                setCurrentConversationId(conversation.id);
                setActivePage("chat");
              }}
            >
              📝 {conversation.title}
            </span>

            <button
              className="delete-btn"
              onClick={() => deleteChat(conversation.id)}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      <div className="sidebar-bottom">
        {user?.role === "admin" && (
          <>
            <hr className="sidebar-divider" />

            <div
              className={`sidebar-menu ${
                activePage === "knowledge" ? "active-menu" : ""
              }`}
              onClick={() => setActivePage("knowledge")}
            >
              📚 Knowledge Base
            </div>

            <div
              className={`sidebar-menu ${
                activePage === "settings" ? "active-menu" : ""
              }`}
              onClick={() => setActivePage("settings")}
            >
              ⚙️ Settings
            </div>
          </>
        )}

        <hr className="sidebar-divider" />

        <div className="user-profile">
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div className="user-info">
            <div className="user-name">{user?.name}</div>

            <div className="user-role">
              {user?.role === "admin" ? "Administrator" : "Employee"}
            </div>
          </div>
        </div>

        <div
          className="sidebar-menu logout-menu"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("activePage");

            setActivePage("chat");
            setUser(null);
          }}
        >
          🚪 Logout
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
