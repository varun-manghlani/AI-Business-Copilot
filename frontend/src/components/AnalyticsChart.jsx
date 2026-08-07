import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import "../styles/Analytics.css";

function AnalyticsChart({ stats }) {
  if (!stats) {
    return null;
  }

  const data = [
    {
      name: "Email",
      value: stats.emails,
    },
    {
      name: "Report",
      value: stats.reports,
    },
    {
      name: "Meeting",
      value: stats.meetings,
    },
    {
      name: "Support",
      value: stats.support,
    },
  ];

  return (
    <div className="charts-grid">
      <div className="chart-card">
        <h2>📊 AI Tool Usage</h2>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />

            <XAxis dataKey="name" stroke="#ccc" />

            <YAxis stroke="#ccc" allowDecimals={false} />

            <Tooltip />

            <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AnalyticsChart;
