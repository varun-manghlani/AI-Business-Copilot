import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { apiFetch } from "../../services/api";

import "../../styles/ToolPages.css";
import { usePage } from "../../context/PageContext";

function EmailGenerator({ setActivePage }) {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState("Professional");

  const [generatedEmail, setGeneratedEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const { voiceResult, setVoiceResult } = usePage();

  useEffect(() => {
    if (!voiceResult) return;

    if (voiceResult.action !== "email") return;

    setRecipient(voiceResult.recipient || "");
    setSubject(voiceResult.subject || "");
    setPurpose(voiceResult.purpose || "");
    setTone(voiceResult.tone || "Professional");

    setGeneratedEmail(voiceResult.email || "");

    // Clear after loading so refreshes don't reuse old data
    setVoiceResult(null);
  }, [voiceResult]);

  async function generateEmail() {
    if (!recipient || !subject || !purpose) {
      toast.error("Please fill all fields.");
      return;
    }

    const loadingToast = toast.loading("Generating email...");

    try {
      setLoading(true);

      const response = await apiFetch("/email/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipient,
          subject,
          purpose,
          tone,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate email.");
      }

      const data = await response.json();

      setGeneratedEmail(data.email);

      toast.success("Email generated successfully!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      toast.dismiss(loadingToast);
      setLoading(false);
    }
  }

  function copyEmail() {
    navigator.clipboard.writeText(generatedEmail);

    toast.success("Email copied!");
  }

  return (
    <div className="tool-page">
      <button className="back-btn" onClick={() => setActivePage("dashboard")}>
        ← Back to Dashboard
      </button>

      <h1>✉️ Email Generator</h1>

      <p>Generate professional business emails using AI.</p>

      <div className="tool-card">
        <label>Recipient</label>

        <input
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Enter recipient name"
        />

        <label>Subject</label>

        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter email subject"
        />

        <label>Purpose</label>

        <textarea
          rows={8}
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="Describe what this email should be about..."
        />

        <label>Tone</label>

        <select value={tone} onChange={(e) => setTone(e.target.value)}>
          <option>Professional</option>
          <option>Friendly</option>
          <option>Formal</option>
          <option>Apologetic</option>
        </select>

        <button
          className="generate-btn"
          onClick={generateEmail}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Email"}
        </button>

        {generatedEmail && (
          <>
            <h2
              style={{
                marginTop: 35,
              }}
            >
              Generated Email
            </h2>

            <textarea rows={14} value={generatedEmail} readOnly />

            <button className="generate-btn" onClick={copyEmail}>
              📋 Copy Email
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default EmailGenerator;
