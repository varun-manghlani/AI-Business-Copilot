import { useState } from "react";

import { apiFetch } from "../../services/api";

import "../../styles/ToolPages.css";
import toast from "react-hot-toast";

function ReportGenerator({ setActivePage }) {
  const [reportType, setReportType] = useState("Weekly Report");
  const [projectName, setProjectName] = useState("");
  const [details, setDetails] = useState("");
  const [audience, setAudience] = useState("Management");

  const [generatedReport, setGeneratedReport] = useState("");

  const [loading, setLoading] = useState(false);

  async function generateReport() {
    if (!projectName || !details) {
      toast.error("Please fill all fields.");
      return;
    }

    const loadingToast = toast.loading("Generating report...");

    try {
      setLoading(true);

      const response = await apiFetch("/report/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          report_type: reportType,
          project_name: projectName,
          details,
          audience,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate report.");
      }

      const data = await response.json();

      setGeneratedReport(data.report);

      toast.success("Report generated successfully!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      toast.dismiss(loadingToast);
      setLoading(false);
    }
  }

  function copyReport() {
    navigator.clipboard.writeText(generatedReport);
    toast.success("Report copied!");
  }

  return (
    <div className="tool-page">
      <button className="back-btn" onClick={() => setActivePage("chat")}>
        ← Back to Chat
      </button>

      <h1>📄 Report Generator</h1>

      <p>Create professional AI-generated business reports.</p>

      <div className="tool-card">
        <label>Report Type</label>

        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
        >
          <option>Weekly Report</option>
          <option>Monthly Report</option>
          <option>Project Status Report</option>
          <option>Executive Report</option>
        </select>

        <label>Project Name</label>

        <input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter project name"
        />

        <label>Report Details</label>

        <textarea
          rows={8}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Describe the work completed..."
        />

        <label>Audience</label>

        <select value={audience} onChange={(e) => setAudience(e.target.value)}>
          <option>Management</option>
          <option>Client</option>
          <option>Team</option>
          <option>Executive Board</option>
        </select>

        <button
          className="generate-btn"
          onClick={generateReport}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Report"}
        </button>

        {generatedReport && (
          <>
            <h2 style={{ marginTop: 35 }}>Generated Report</h2>

            <textarea rows={16} value={generatedReport} readOnly />

            <button className="generate-btn" onClick={copyReport}>
              📋 Copy Report
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ReportGenerator;
