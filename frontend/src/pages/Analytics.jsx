import { useEffect, useState } from "react";
import {
  FaUsers,
  FaComments,
  FaRobot,
  FaFileAlt,
  FaEnvelope,
  FaChartBar,
  FaClipboardList,
  FaHeadset,
} from "react-icons/fa";

import { apiFetch } from "../services/api";
import AnalyticsChart from "../components/AnalyticsChart";

import "../styles/Analytics.css";

function Analytics() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      const response = await apiFetch("/analytics/dashboard");

      const data = await response.json();

      setStats(data);
    } catch (error) {
      console.error(error);
    }
  }

  if (!stats) {
    return (
      <div className="analytics-page">
        <h1>Loading Analytics...</h1>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      <h1>📊 Analytics Dashboard</h1>

      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="card-header">
            <FaUsers className="card-icon users" />
            <span>Total Users</span>
          </div>

          <h2>{stats.users}</h2>

          <p>Total registered users</p>
        </div>

        <div className="analytics-card">
          <div className="card-header">
            <FaComments className="card-icon chat" />
            <span>Conversations</span>
          </div>

          <h2>{stats.conversations}</h2>

          <p>Chats created</p>
        </div>

        <div className="analytics-card">
          <div className="card-header">
            <FaRobot className="card-icon ai" />
            <span>AI Requests</span>
          </div>

          <h2>{stats.ai_requests}</h2>

          <p>Total AI generations</p>
        </div>

        <div className="analytics-card">
          <div className="card-header">
            <FaFileAlt className="card-icon docs" />
            <span>Documents</span>
          </div>

          <h2>{stats.documents}</h2>

          <p>Indexed PDFs</p>
        </div>

        <div className="analytics-card">
          <div className="card-header">
            <FaEnvelope className="card-icon email" />
            <span>Email Generator</span>
          </div>

          <h2>{stats.emails}</h2>

          <p>Emails created</p>
        </div>

        <div className="analytics-card">
          <div className="card-header">
            <FaChartBar className="card-icon report" />
            <span>Report Generator</span>
          </div>

          <h2>{stats.reports}</h2>

          <p>Reports created</p>
        </div>

        <div className="analytics-card">
          <div className="card-header">
            <FaClipboardList className="card-icon meeting" />
            <span>Meeting Summary</span>
          </div>

          <h2>{stats.meetings}</h2>

          <p>Summaries generated</p>
        </div>

        <div className="analytics-card">
          <div className="card-header">
            <FaHeadset className="card-icon support" />
            <span>Customer Support</span>
          </div>

          <h2>{stats.support}</h2>

          <p>Responses generated</p>
        </div>
      </div>

      {/* AI Tool Usage Chart */}

      <div className="analytics-section">
        <AnalyticsChart stats={stats} />
      </div>
    </div>
  );
}

export default Analytics;
