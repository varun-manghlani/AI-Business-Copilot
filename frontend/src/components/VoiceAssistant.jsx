import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { apiFetch } from "../services/api";
import { usePage } from "../context/PageContext";
import useSpeechRecognition from "../hooks/useSpeechRecognition";

import TypingLoader from "./TypingLoader";

import "../styles/VoiceAssistant.css";

function VoiceAssistant({ user }) {
  const { transcript, listening, startListening } = useSpeechRecognition();

  const { setActivePage, setVoiceResult } = usePage();

  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!transcript) return;

    detectIntent();
  }, [transcript]);

  async function detectIntent() {
    setProcessing(true);

    try {
      // STEP 1: Detect intent
      const intentResponse = await apiFetch("/voice/intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transcript,
        }),
      });

      const intent = await intentResponse.json();

      console.log("VOICE INTENT:", intent);

      if (!intent.success) {
        toast.error(intent.message);
        return;
      }

      // STEP 2: Navigation commands
      if (intent.action === "navigate") {
        // Admin-only pages
        const adminPages = ["analytics", "settings"];

        if (adminPages.includes(intent.page) && user?.role !== "admin") {
          toast.error("You don't have permission to access this page.");
          return;
        }

        setActivePage(intent.page);
        return;
      }

      // STEP 3: Execute AI tools
      const executeResponse = await apiFetch("/voice/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transcript,
        }),
      });

      const result = await executeResponse.json();

      console.log("VOICE RESULT:", result);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      // Save generated result
      setVoiceResult(result);

      // Open corresponding page
      if (result.page) {
        setActivePage(result.page);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="voice-assistant">
      <button
        className={`voice-button ${listening ? "listening" : ""}`}
        onClick={startListening}
      >
        🎤
      </button>

      {listening && <div className="voice-status">Listening...</div>}

      {processing && (
        <div className="voice-processing">
          <TypingLoader />
        </div>
      )}

      {transcript && <div className="voice-transcript">{transcript}</div>}
    </div>
  );
}

export default VoiceAssistant;
