import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { apiFetch } from "../../services/api";
import { usePage } from "../../context/PageContext";

import "../../styles/ToolPages.css";

function MeetingSummary({ setActivePage }) {
  const [meetingNotes, setMeetingNotes] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const { voiceResult, setVoiceResult } = usePage();

  useEffect(() => {
    if (!voiceResult) return;

    if (voiceResult.action !== "meeting") return;

    setMeetingNotes(voiceResult.meeting_notes || "");
    setSummary(voiceResult.summary || "");

    // Clear after loading
    setVoiceResult(null);
  }, [voiceResult]);

  async function generateSummary() {
    if (!meetingNotes.trim()) {
      toast.error("Please enter meeting notes.");
      return;
    }

    const loadingToast = toast.loading("Generating meeting summary...");

    try {
      setLoading(true);

      const response = await apiFetch("/meeting/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meeting_notes: meetingNotes,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate summary.");
      }

      const data = await response.json();

      setSummary(data.summary);

      toast.success("Summary generated!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      toast.dismiss(loadingToast);
      setLoading(false);
    }
  }

  function copySummary() {
    navigator.clipboard.writeText(summary);
    toast.success("Summary copied!");
  }

  return (
    <div className="tool-page">
      <button className="back-btn" onClick={() => setActivePage("chat")}>
        ← Back to Chat
      </button>

      <h1>📝 Meeting Summary</h1>

      <p>Summarize meeting notes using AI.</p>

      <div className="tool-card">
        <label>Meeting Notes</label>

        <textarea
          rows={12}
          value={meetingNotes}
          onChange={(e) => setMeetingNotes(e.target.value)}
          placeholder="Paste meeting notes here..."
        />

        <button
          className="generate-btn"
          onClick={generateSummary}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Summary"}
        </button>

        {summary && (
          <>
            <h2 style={{ marginTop: 30 }}>Meeting Summary</h2>

            <textarea rows={16} value={summary} readOnly />

            <button className="generate-btn" onClick={copySummary}>
              📋 Copy Summary
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default MeetingSummary;
