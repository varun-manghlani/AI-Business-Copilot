import "../styles/ChatInput.css";

function ChatInput({ input, setInput, sendMessage }) {
  return (
    <div className="chat-input-container">
      <input
        className="chat-input"
        placeholder="Ask anything..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
      />

      <button className="send-btn" onClick={sendMessage}>
        Send
      </button>
    </div>
  );
}

export default ChatInput;
