import { useState } from "react";

import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";
import AIToolsModal from "../components/AIToolsModal";

import logo from "../assets/logo.png";

import "../styles/ChatPage.css";

function ChatPage({ messages, input, setInput, sendMessage, setActivePage }) {
  const [showAITools, setShowAITools] = useState(false);

  return (
    <>
      <div className="header">
        <div className="header-left">
          <img src={logo} alt="AI Business Copilot" className="header-logo" />

          <span>AI Business Copilot</span>
        </div>

        <div className="header-right">
          <button className="ai-tools-btn" onClick={() => setShowAITools(true)}>
            ✨ AI Workspace
          </button>
        </div>
      </div>

      <ChatWindow messages={messages} />

      <ChatInput input={input} setInput={setInput} sendMessage={sendMessage} />

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
