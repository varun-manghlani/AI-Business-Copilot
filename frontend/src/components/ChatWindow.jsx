import { useEffect, useRef, useState } from "react";

import ChatMessage from "./ChatMessage";

import "../styles/ChatWindow.css";

function ChatWindow({ messages }) {
  const chatRef = useRef(null);
  const bottomRef = useRef(null);

  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (autoScroll) {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages, autoScroll]);

  const handleScroll = () => {
    const element = chatRef.current;

    if (!element) return;

    const distanceFromBottom =
      element.scrollHeight - element.scrollTop - element.clientHeight;

    setAutoScroll(distanceFromBottom < 100);
  };

  return (
    <>
      <div className="chat-window" ref={chatRef} onScroll={handleScroll}>
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}

        <div ref={bottomRef} />
      </div>

      {!autoScroll && (
        <button
          className="scroll-bottom-btn"
          onClick={() => {
            bottomRef.current?.scrollIntoView({
              behavior: "smooth",
            });

            setAutoScroll(true);
          }}
        >
          ↓ Latest
        </button>
      )}
    </>
  );
}

export default ChatWindow;
