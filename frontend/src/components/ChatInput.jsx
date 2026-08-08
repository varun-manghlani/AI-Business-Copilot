import "../styles/ChatInput.css";

function ChatInput({ input, setInput, sendMessage }) {
  function handleSubmit(event) {
    event.preventDefault();

    if (!input.trim()) {
      return;
    }

    sendMessage();
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (input.trim()) {
        sendMessage();
      }
    }
  }

  return (
    <form className="chat-input-container" onSubmit={handleSubmit}>
      <textarea
        className="chat-input"
        placeholder="Ask anything..."
        value={input}
        onChange={(event) => setInput(event.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
      />

      <button type="submit" className="send-btn" disabled={!input.trim()}>
        Send
      </button>
    </form>
  );
}

export default ChatInput;
