import { useState } from "react";

import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";
import AIToolsModal from "../components/AIToolsModal";

import logo from "../assets/logo.png";

import "../styles/ChatPage.css";

function ChatPage({ messages, input, setInput, sendMessage, setActivePage }) {
  const [showAITools, setShowAITools] = useState(false);

  function openVoiceAssistant() {
    window.dispatchEvent(new CustomEvent("open-voice-assistant"));
  }

  return (
    <>
      {/* =========================
          CHAT HEADER
      ========================= */}

      <div className="chat-header">
        <div className="chat-header-left">
          <img
            src={logo}
            alt="AI Business Copilot"
            className="chat-header-logo"
          />

          <div className="chat-header-title">
            <h1>AI Business Copilot</h1>

            <span>Intelligent workspace assistant</span>
          </div>
        </div>
      </div>

      {/* =========================
          CHAT WINDOW
      ========================= */}

      <ChatWindow messages={messages} />

      {/* =========================
          CHAT INPUT
      ========================= */}

      <ChatInput input={input} setInput={setInput} sendMessage={sendMessage} />

      {/* =========================
          AI TOOLS MODAL
      ========================= */}

      {showAITools && (
        <AIToolsModal
          onClose={() => setShowAITools(false)}
          setActivePage={setActivePage}
        />
      )}
    </>
  );
}

export default ChatPage;
