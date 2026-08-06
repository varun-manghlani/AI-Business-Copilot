import { useState } from "react";

import { apiFetch } from "../services/api";

import "../styles/AddUserModal.css";
import { Toaster } from "react-hot-toast";

function AddUserModal({ onClose, onUserAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");

  async function handleCreateUser() {
    try {
      const response = await apiFetch("/users", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.detail(data.detail);
        return;
      }

      onUserAdded();

      onClose();
    } catch (error) {
      console.error(error);

      toast.error("Failed to create user.");
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add New User</h2>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="employee">Employee</option>

          <option value="admin">Administrator</option>
        </select>

        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>

          <button className="create-btn" onClick={handleCreateUser}>
            Create User
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddUserModal;
