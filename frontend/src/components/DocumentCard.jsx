import "../styles/DocumentCard.css";

function DocumentCard({ document, onDelete }) {
  const uploadedDate = new Date(document.uploaded_at).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );

  return (
    <div className="document-card">
      <div className="document-left">
        <h3 className="document-title">📄 {document.original_filename}</h3>

        <div className="document-meta">
          <span>✅ {document.status}</span>

          <span>📄 {document.page_count} Pages</span>

          <span>🧩 {document.chunk_count} Chunks</span>

          <span>💾 {document.file_size || document.size}</span>

          <span>📅 {uploadedDate}</span>
        </div>
      </div>

      <button
        className="delete-document-btn"
        onClick={() => onDelete(document.id)}
      >
        🗑 Delete
      </button>
    </div>
  );
}

export default DocumentCard;
