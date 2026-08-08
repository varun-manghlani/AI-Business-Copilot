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
  const [showTranscript, setShowTranscript] = useState(false);

  /*
   * Show the transcript when speech recognition
   * gives us a new voice command.
   */
  useEffect(() => {
    if (!transcript) {
      return;
    }

    setShowTranscript(true);

    detectIntent();
  }, [transcript]);

  /*
   * Start a fresh voice interaction.
   *
   * We clear the previous transcript before
   * starting the new voice command.
   */
  function handleStartListening() {
    setShowTranscript(false);

    startListening();
  }

  async function detectIntent() {
    setProcessing(true);
    setShowTranscript(true);

    try {
      // =========================================
      // STEP 1: DETECT INTENT
      // =========================================

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
        toast.error(intent.message || "Unable to understand your command.");

        return;
      }

      // =========================================
      // STEP 2: NAVIGATION COMMANDS
      // =========================================

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

      // =========================================
      // STEP 3: EXECUTE AI TOOL
      // =========================================

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
        toast.error(result.message || "Unable to complete the task.");

        return;
      }

      // =========================================
      // STEP 4: SAVE GENERATED RESULT
      // =========================================

      setVoiceResult(result);

      // =========================================
      // STEP 5: OPEN CORRESPONDING PAGE
      // =========================================

      if (result.page) {
        setActivePage(result.page);
      }
    } catch (error) {
      console.error("VOICE ASSISTANT ERROR:", error);

      toast.error("Something went wrong.");
    } finally {
      /*
       * Task is now complete.
       *
       * Remove the transcript so the old command
       * doesn't stay visible on the screen.
       */
      setProcessing(false);
      setShowTranscript(false);
    }
  }

  return (
    <div className="voice-assistant">
      {/* =====================================
          AI VOICE BUTTON
      ===================================== */}

      <button
        type="button"
        className={`voice-button ${listening ? "listening" : ""}`}
        onClick={handleStartListening}
        disabled={processing}
        title="Talk to AI Business Copilot"
      >
        <span className="voice-button-icon">🎙</span>

        <span className="voice-button-label">
          {listening ? "Listening..." : "AI Voice"}
        </span>
      </button>

      {/* =====================================
          LISTENING STATUS
      ===================================== */}

      {listening && <div className="voice-status">Listening...</div>}

      {/* =====================================
          TRANSCRIPT
      ===================================== */}

      {showTranscript && transcript && (
        <div className="voice-transcript">{transcript}</div>
      )}

      {/* =====================================
          PROCESSING
      ===================================== */}

      {processing && (
        <div className="voice-processing">
          <TypingLoader />
        </div>
      )}
    </div>
  );
}

export default VoiceAssistant;
