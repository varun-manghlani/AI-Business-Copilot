import { useEffect, useState } from "react";

import {
  MessageSquare,
  Mail,
  FileText,
  CalendarDays,
  Plus,
  Sparkles,
  Clock,
  RefreshCw,
} from "lucide-react";

import { apiFetch } from "../services/api";
import "../styles/Dashboard.css";

function Dashboard({
  user,
  onNavigate,
  conversations,
  setCurrentConversationId,
}) {
  const userName = user?.name || "User";

  // =========================
  // DASHBOARD STATS
  // =========================

  const [stats, setStats] = useState({
    ai_chats: 0,
    emails_generated: 0,
    reports_generated: 0,
    meetings_summarized: 0,
    ai_chats_today: 0,
    emails_today: 0,
    reports_today: 0,
    meetings_today: 0,
  });

  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState(false);

  // =========================
  // RECENT ACTIVITY
  // =========================

  const [recentActivity, setRecentActivity] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [activityError, setActivityError] = useState(false);

  // =========================
  // LOAD DASHBOARD DATA
  // =========================

  useEffect(() => {
    loadDashboardStats();
    loadRecentActivity();
  }, []);

  // =========================
  // LOAD STATS
  // =========================

  async function loadDashboardStats() {
    try {
      setLoadingStats(true);
      setStatsError(false);

      const response = await apiFetch("/dashboard/stats");

      if (!response.ok) {
        throw new Error("Failed to load dashboard statistics.");
      }

      const data = await response.json();

      setStats({
        ai_chats: data.ai_chats ?? 0,
        emails_generated: data.emails_generated ?? 0,
        reports_generated: data.reports_generated ?? 0,
        meetings_summarized: data.meetings_summarized ?? 0,

        ai_chats_today: data.ai_chats_today ?? 0,

        emails_today: data.emails_today ?? 0,

        reports_today: data.reports_today ?? 0,

        meetings_today: data.meetings_today ?? 0,
      });
    } catch (error) {
      console.error("Dashboard stats error:", error);

      setStatsError(true);
    } finally {
      setLoadingStats(false);
    }
  }

  // =========================
  // LOAD RECENT ACTIVITY
  // =========================

  async function loadRecentActivity() {
    try {
      setLoadingActivity(true);
      setActivityError(false);

      const response = await apiFetch("/dashboard/activity");

      if (!response.ok) {
        throw new Error("Failed to load recent activity.");
      }

      const data = await response.json();

      const formattedActivity = data.map((activity) => {
        let title;
        let description;
        let icon;

        switch (activity.tool_name) {
          case "email":
            title = "Email Generated";
            description = "AI email generation";
            icon = Mail;
            break;

          case "report":
            title = "Report Generated";
            description = "Business report generated";
            icon = FileText;
            break;

          case "meeting":
            title = "Meeting Summary";
            description = "Meeting notes summarized";
            icon = CalendarDays;
            break;

          default:
            title = "AI Activity";
            description = "AI workspace activity";
            icon = Sparkles;
        }

        return {
          id: activity.id,
          title,
          description,
          time: formatRelativeTime(activity.created_at),
          icon,
        };
      });

      setRecentActivity(formattedActivity);
    } catch (error) {
      console.error("Recent activity error:", error);

      setActivityError(true);
    } finally {
      setLoadingActivity(false);
    }
  }

  // =========================
  // RELATIVE TIME
  // =========================

  function formatRelativeTime(dateString) {
    if (!dateString) {
      return "Recently";
    }

    /*
     * Backend stores created_at using UTC.
     * If the returned string has no timezone,
     * explicitly treat it as UTC.
     */
    const normalizedDate = dateString.endsWith("Z")
      ? dateString
      : `${dateString}Z`;

    const date = new Date(normalizedDate);

    if (Number.isNaN(date.getTime())) {
      return "Recently";
    }

    const now = new Date();

    const difference = now.getTime() - date.getTime();

    const seconds = Math.floor(difference / 1000);

    if (seconds < 60) {
      return "Just now";
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    }

    return date.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
    });
  }

  // =========================
  // REFRESH EVERYTHING
  // =========================

  async function refreshDashboard() {
    await Promise.all([loadDashboardStats(), loadRecentActivity()]);
  }

  // =========================
  // QUICK ACTIONS
  // =========================

  const quickActions = [
    {
      title: "Generate Email",
      description: "Create a professional email",
      icon: Mail,
      page: "email-generator",
    },
    {
      title: "Generate Report",
      description: "Create a business report",
      icon: FileText,
      page: "report-generator",
    },
    {
      title: "Summarize Meeting",
      description: "Turn notes into a summary",
      icon: CalendarDays,
      page: "meeting-summary",
    },
    {
      title: "Ask AI",
      description: "Start a conversation",
      icon: MessageSquare,
      page: "chat",
    },
  ];

  // =========================
  // REAL USER STATISTICS
  // =========================

  const dashboardStats = [
    {
      title: "AI Chats",
      value: stats.ai_chats,
      change: `+${stats.ai_chats_today} today`,
      icon: MessageSquare,
      page: "chat",
    },
    {
      title: "Emails Generated",
      value: stats.emails_generated,
      change: `+${stats.emails_today} today`,
      icon: Mail,
      page: "email-generator",
    },
    {
      title: "Reports Generated",
      value: stats.reports_generated,
      change: `+${stats.reports_today} today`,
      icon: FileText,
      page: "report-generator",
    },
    {
      title: "Meetings Summarized",
      value: stats.meetings_summarized,
      change: `+${stats.meetings_today} today`,
      icon: CalendarDays,
      page: "meeting-summary",
    },
  ];

  return (
    <main className="dashboard-main">
      {/* =========================
          TOP BAR
      ========================= */}

      <header className="dashboard-header">
        <div className="header-title">
          <h1>Dashboard</h1>
        </div>
      </header>

      {/* =========================
          DASHBOARD CONTENT
      ========================= */}

      <div className="dashboard-content">
        {/* =========================
            GREETING
        ========================= */}

        <section className="dashboard-welcome">
          <div>
            <div className="welcome-label">
              <Sparkles size={17} />
              AI Business Copilot
            </div>

            <h2>Good Morning, {userName} 👋</h2>

            <p>How can I help you today?</p>
          </div>
        </section>

        {/* =========================
            QUICK ACTIONS
        ========================= */}

        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <h3>Quick Actions</h3>

              <p>Get things done faster</p>
            </div>
          </div>

          <div className="quick-actions">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.title}
                  className="quick-action-card"
                  onClick={() => onNavigate?.(action.page)}
                >
                  <div className="quick-action-icon">
                    <Icon size={21} />
                  </div>

                  <div className="quick-action-content">
                    <strong>{action.title}</strong>

                    <span>{action.description}</span>
                  </div>

                  <Plus className="quick-action-plus" size={18} />
                </button>
              );
            })}
          </div>
        </section>

        {/* =========================
            OVERVIEW
        ========================= */}

        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <h3>Overview</h3>

              <p>Your personal AI workspace activity</p>
            </div>

            <button
              className="refresh-dashboard-button"
              onClick={refreshDashboard}
              disabled={loadingStats || loadingActivity}
              title="Refresh dashboard"
            >
              <RefreshCw
                size={16}
                className={
                  loadingStats || loadingActivity ? "refresh-spinning" : ""
                }
              />
            </button>
          </div>

          {statsError && (
            <div className="dashboard-error">
              Unable to load your latest statistics.
              <button onClick={loadDashboardStats}>Try Again</button>
            </div>
          )}

          <div className="stats-grid">
            {dashboardStats.map((stat) => {
              const Icon = stat.icon;

              return (
                <button
                  className="stat-card"
                  key={stat.title}
                  onClick={() => stat.page && onNavigate?.(stat.page)}
                >
                  <div className="stat-card-top">
                    <div className="stat-icon">
                      <Icon size={20} />
                    </div>

                    <span className="stat-change">
                      {loadingStats ? "Loading..." : stat.change}
                    </span>
                  </div>

                  <div className="stat-value">
                    {loadingStats ? "—" : stat.value}
                  </div>

                  <div className="stat-title">{stat.title}</div>
                </button>
              );
            })}
          </div>
        </section>

        {/* =========================
            RECENT ACTIVITY
            + CONVERSATIONS
        ========================= */}

        <section className="dashboard-bottom-grid">
          {/* =========================
              RECENT ACTIVITY
          ========================= */}

          <div className="dashboard-panel">
            <div className="panel-header">
              <div>
                <h3>Recent Activity</h3>

                <p>Your latest workspace activity</p>
              </div>

              <Clock size={19} />
            </div>

            <div className="activity-list">
              {activityError && (
                <div className="dashboard-error">
                  Unable to load recent activity.
                  <button onClick={loadRecentActivity}>Try Again</button>
                </div>
              )}

              {!activityError && loadingActivity && (
                <div className="activity-empty-state">Loading activity...</div>
              )}

              {!activityError &&
                !loadingActivity &&
                recentActivity.length === 0 && (
                  <div className="activity-empty-state">
                    <Clock size={20} />

                    <span>No recent activity yet.</span>
                  </div>
                )}

              {!activityError &&
                !loadingActivity &&
                recentActivity.map((activity) => {
                  const Icon = activity.icon;

                  return (
                    <div className="activity-item" key={activity.id}>
                      <div className="activity-icon">
                        <Icon size={18} />
                      </div>

                      <div className="activity-info">
                        <strong>{activity.title}</strong>

                        <span>{activity.description}</span>
                      </div>

                      <time>{activity.time}</time>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* =========================
              RECENT CONVERSATIONS
          ========================= */}

          <div className="dashboard-panel">
            <div className="panel-header">
              <div>
                <h3>Recent Conversations</h3>

                <p>Continue where you left off</p>
              </div>

              <MessageSquare size={19} />
            </div>

            <div className="conversation-list">
              {!conversations || conversations.length === 0 ? (
                <div className="empty-dashboard-conversations">
                  <MessageSquare size={20} />

                  <span>No conversations yet</span>
                </div>
              ) : (
                conversations.slice(0, 4).map((conversation, index) => (
                  <button
                    key={conversation.id}
                    className="conversation-item"
                    onClick={() => {
                      setCurrentConversationId(conversation.id);

                      onNavigate?.("chat");
                    }}
                  >
                    <div className="conversation-number">{index + 1}</div>

                    <div>
                      <strong>{conversation.title}</strong>

                      <span>AI conversation</span>
                    </div>

                    <span className="conversation-arrow">→</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </section>

        {/* =========================
            FREE PLAN
        ========================= */}

        <section className="usage-card">
          <div className="usage-info">
            <div className="usage-icon">
              <Sparkles size={20} />
            </div>

            <div>
              <strong>Free Plan</strong>

              <span>Your AI workspace usage will appear here.</span>
            </div>
          </div>

          <div className="usage-placeholder">
            <span>AI requests</span>

            <strong>—</strong>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Dashboard;
