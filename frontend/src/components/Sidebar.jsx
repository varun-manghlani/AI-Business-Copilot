import "../styles/Sidebar.css";
import { usePage } from "../context/PageContext";
import {
  LayoutDashboard,
  MessageSquare,
  Mail,
  FileText,
  CalendarDays,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

function Sidebar({ user, setUser }) {
  const { activePage, setActivePage } = usePage();

  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("activePage");

    setActivePage("dashboard");
    setUser(null);
  };

  return (
    <aside className="business-sidebar">
      {/* BRAND */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">AI</div>

        <div className="sidebar-brand-text">
          <strong>AI Business</strong>
          <span>Copilot</span>
        </div>
      </div>

      {/* MAIN NAVIGATION */}
      <div className="sidebar-content">
        <div className="sidebar-section-title">WORKSPACE</div>

        <button
          className={`sidebar-menu ${
            activePage === "dashboard" ? "active-menu" : ""
          }`}
          onClick={() => setActivePage("dashboard")}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </button>

        <button
          className={`sidebar-menu ${
            activePage === "chat" ? "active-menu" : ""
          }`}
          onClick={() => setActivePage("chat")}
        >
          <MessageSquare size={18} />
          <span>AI Chat</span>
        </button>

        <button
          className={`sidebar-menu ${
            activePage === "email-generator" ? "active-menu" : ""
          }`}
          onClick={() => setActivePage("email-generator")}
        >
          <Mail size={18} />
          <span>Email</span>
        </button>

        <button
          className={`sidebar-menu ${
            activePage === "report-generator" ? "active-menu" : ""
          }`}
          onClick={() => setActivePage("report-generator")}
        >
          <FileText size={18} />
          <span>Reports</span>
        </button>

        <button
          className={`sidebar-menu ${
            activePage === "meeting-summary" ? "active-menu" : ""
          }`}
          onClick={() => setActivePage("meeting-summary")}
        >
          <CalendarDays size={18} />
          <span>Meetings</span>
        </button>

        {/* ADMIN ONLY */}
        {isAdmin && (
          <>
            <div className="sidebar-section-title sidebar-management-title">
              MANAGEMENT
            </div>

            <button
              className={`sidebar-menu ${
                activePage === "knowledge" ? "active-menu" : ""
              }`}
              onClick={() => setActivePage("knowledge")}
            >
              <BookOpen size={18} />
              <span>Knowledge Base</span>
            </button>

            <button
              className={`sidebar-menu ${
                activePage === "analytics" ? "active-menu" : ""
              }`}
              onClick={() => setActivePage("analytics")}
            >
              <BarChart3 size={18} />
              <span>Analytics</span>
            </button>
          </>
        )}
      </div>

      {/* BOTTOM */}
      <div className="sidebar-bottom">
        <button
          className={`sidebar-menu ${
            activePage === "settings" ? "active-menu" : ""
          }`}
          onClick={() => setActivePage("settings")}
        >
          <Settings size={18} />
          <span>Settings</span>
        </button>

        <div className="sidebar-divider" />

        {/* USER */}
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <div className="sidebar-user-info">
            <strong>{user?.name || "User"}</strong>

            <span>{isAdmin ? "Administrator" : "Employee"}</span>
          </div>
        </div>

        <button className="sidebar-menu logout-menu" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
