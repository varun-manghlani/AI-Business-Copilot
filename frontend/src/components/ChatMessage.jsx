import "../styles/ChatMessage.css";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock";

function ChatMessage({ message }) {
  return (
    <div
      className={`message-container ${
        message.role === "user" ? "user-container" : "assistant-container"
      }`}
    >
      <div
        className={`message-bubble ${
          message.role === "user" ? "user-bubble" : "assistant-bubble"
        }`}
      >
        {message.role === "assistant" ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ className, children }) {
                const match = /language-(\w+)/.exec(className || "");

                if (match) {
                  return (
                    <CodeBlock
                      language={match[1]}
                      code={String(children).replace(/\n$/, "")}
                    />
                  );
                }

                return <code>{children}</code>;
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        ) : (
          message.content
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
