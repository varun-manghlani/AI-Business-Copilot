import { useState } from "react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import "../styles/CodeBlock.css";

function CodeBlock({ language, code }) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const languageNames = {
    js: "JavaScript",
    javascript: "JavaScript",
    jsx: "React JSX",
    ts: "TypeScript",
    tsx: "React TSX",
    python: "Python",
    py: "Python",
    java: "Java",
    cpp: "C++",
    c: "C",
    csharp: "C#",
    css: "CSS",
    html: "HTML",
    json: "JSON",
    sql: "SQL",
    bash: "Bash",
    markdown: "Markdown",
  };

  return (
    <div className="code-block">
      <div className="code-header">
        <span className="language-name">
          {languageNames[language] || language || "Text"}
        </span>

        <button className="copy-btn" onClick={copyCode}>
          {copied ? "✅ Copied" : "📋 Copy"}
        </button>
      </div>

      <SyntaxHighlighter language={language} style={oneDark} PreTag="div">
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default CodeBlock;
