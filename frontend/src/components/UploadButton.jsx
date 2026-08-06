import { useRef, useState } from "react";

import "../styles/UploadButton.css";
import { apiFetch } from "../services/api";

function UploadButton({ onUploadSuccess }) {
  const fileInputRef = useRef(null);

  const [uploading, setUploading] = useState(false);

  async function handleFileChange(event) {
    const file = event.target.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    try {
      setUploading(true);

      const response = await apiFetch("/knowledge/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed.");
      }

      alert("✅ Document uploaded successfully.");

      if (onUploadSuccess) {
        onUploadSuccess();
      }

      event.target.value = "";
    } catch (error) {
      console.error(error);
      alert("❌ Failed to upload document.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <input
        type="file"
        accept=".pdf"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <button
        className="upload-btn"
        disabled={uploading}
        onClick={() => fileInputRef.current.click()}
      >
        {uploading ? "Uploading..." : "📄 Upload Document"}
      </button>
    </>
  );
}

export default UploadButton;
