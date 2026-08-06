import { useState } from "react";

import { apiFetch } from "../../services/api";

import "../../styles/ToolPages.css";
import toast from "react-hot-toast";

function CustomerSupport({ setActivePage }) {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function generateResponse() {
    if (!question.trim()) {
      toast.error("Please enter a customer question.");
      return;
    }

    const loadingToast = toast.loading("Generating response...");

    try {
      setLoading(true);

      const apiResponse = await apiFetch("/customer-support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_question: question,
        }),
      });

      if (!apiResponse.ok) {
        throw new Error("Failed to generate response.");
      }

      const data = await apiResponse.json();

      setResponse(data.response);

      toast.success("Response generated!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      toast.dismiss(loadingToast);
      setLoading(false);
    }
  }

  function copyResponse() {
    navigator.clipboard.writeText(response);
    toast.success("Response copied!");
  }

  return (
    <div className="tool-page">
      <button className="back-btn" onClick={() => setActivePage("chat")}>
        ← Back to Chat
      </button>

      <h1>🎧 Customer Support</h1>

      <p>Generate professional customer support replies using AI.</p>

      <div className="tool-card">
        <label>Customer Question</label>

        <textarea
          rows={10}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter the customer's question..."
        />

        <button
          className="generate-btn"
          onClick={generateResponse}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Response"}
        </button>

        {response && (
          <>
            <h2 style={{ marginTop: 30 }}>AI Response</h2>

            <textarea rows={14} value={response} readOnly />

            <button className="generate-btn" onClick={copyResponse}>
              📋 Copy Response
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default CustomerSupport;
