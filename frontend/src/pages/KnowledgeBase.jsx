import { useEffect, useState } from "react";

import UploadButton from "../components/UploadButton";
import DocumentCard from "../components/DocumentCard";

import "../styles/KnowledgeBase.css";
import { apiFetch } from "../services/api";

function KnowledgeBase() {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    try {
      const response = await fetch("http://127.0.0.1:8000/knowledge/documents");

      if (!response.ok) {
        throw new Error("Failed to load documents");
      }

      const data = await response.json();

      setDocuments(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteDocument(documentId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await apiFetch(`/knowledge/documents/${documentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      // Reload documents after successful deletion
      loadDocuments();

      toast.success("Document deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to delete document.");
    }
  }

  return (
    <>
      <div className="header">📚 Knowledge </div>

      <div className="knowledge-container">
        <div className="knowledge-toolbar">
          <p className="knowledge-description">
            Manage your company's AI knowledge.
          </p>

          <UploadButton onUploadSuccess={loadDocuments} />
        </div>

        <div className="documents-container">
          {documents.length === 0 ? (
            <p className="empty-documents">No documents uploaded yet.</p>
          ) : (
            documents.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                onDelete={deleteDocument}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default KnowledgeBase;
