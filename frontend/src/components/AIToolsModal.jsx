import "../styles/AIToolsModal.css";

function AIToolsModal({ onClose, setActivePage }) {
  const tools = [
    {
      icon: "✉️",
      title: "Email Generator",
      page: "email-generator",
      description: "Write professional business emails in seconds.",
    },
    {
      icon: "📄",
      title: "Report Generator",
      page: "report-generator",
      description: "Create structured business reports instantly.",
    },
    {
      icon: "📝",
      title: "Meeting Summary",
      page: "meeting-summary",
      description: "Turn meeting notes into clear summaries.",
    },
    {
      icon: "🎧",
      title: "Customer Support",
      page: "customer-support",
      description: "Generate professional customer responses.",
    },
  ];

  function handleToolClick(page) {
    setActivePage(page);
    onClose();
  }

  return (
    <div className="ai-modal-overlay">
      <div className="ai-modal">
        <div className="ai-modal-header">
          <div>
            <h2>✨ AI Workspace</h2>

            <p className="ai-modal-subtitle">
              Choose an AI tool to boost your productivity.
            </p>
          </div>

          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="ai-tools-grid">
          {tools.map((tool) => (
            <div
              key={tool.title}
              className="ai-tool-card"
              onClick={() => handleToolClick(tool.page)}
            >
              <div className="tool-icon">{tool.icon}</div>

              <div className="tool-info">
                <h3>{tool.title}</h3>

                <p>{tool.description}</p>
              </div>

              <div className="tool-arrow">→</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AIToolsModal;
