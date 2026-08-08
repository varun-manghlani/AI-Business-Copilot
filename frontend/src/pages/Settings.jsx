import { useEffect, useState } from "react";

import { apiFetch } from "../services/api";

import "../styles/Settings.css";
import UserCard from "../components/UserCard";
import AddUserModal from "../components/AddUserModal";
import ChangePassword from "../components/ChangePassword";
import { Toaster } from "react-hot-toast";

function Settings({ user }) {
  const [profile, setProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  useEffect(() => {
    loadProfile();
    loadUsers();
  }, []);

  async function loadProfile() {
    try {
      const response = await apiFetch("/settings/profile");

      if (!response.ok) {
        throw new Error("Failed to load profile.");
      }

      const data = await response.json();

      setProfile(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadUsers() {
    try {
      const response = await apiFetch("/users");

      if (!response.ok) {
        throw new Error("Failed to load users.");
      }

      const data = await response.json();

      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteUser(userId) {
    try {
      const response = await apiFetch(`/users/${userId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        toast.detail(data.detail);
        return;
      }

      loadUsers();
    } catch (error) {
      console.error(error);
    }
  }

  if (!profile) {
    return (
      <>
        <div className="header">⚙️ Settings</div>

        <div className="settings-loading">Loading profile...</div>
      </>
    );
  }

  return (
    <>
      <div className="header">⚙️ Settings</div>

      <div className="settings-container">
        <div className="settings-card">
          <h2>👤 Profile</h2>

          <div className="settings-item">
            <strong>Name:</strong> {profile.name}
          </div>

          <div className="settings-item">
            <strong>Email:</strong> {profile.email}
          </div>

          <div className="settings-item">
            <strong>Role:</strong>{" "}
            {profile.role === "admin" ? "Administrator" : "Employee"}
          </div>
        </div>

        <div className="settings-card">
          <h2>🏢 Company</h2>

          <div className="settings-item">
            <strong>Company:</strong> AI Business Copilot
          </div>

          <div className="settings-item">
            <strong>AI Model:</strong> llama3.2:3b
          </div>

          <div className="settings-item">
            <strong>Temperature:</strong> 0.7
          </div>
        </div>

        {user?.role === "admin" && (
          <div className="settings-card">
            <div className="settings-users-header">
              <h2>👥 User Management</h2>

              <button
                className="settings-button"
                onClick={() => setShowAddUserModal(true)}
              >
                + Add User
              </button>
            </div>

            {users.length === 0 ? (
              <p>No users found.</p>
            ) : (
              users.map((user) => (
                <UserCard key={user.id} user={user} onDelete={deleteUser} />
              ))
            )}
          </div>
        )}

        <div className="settings-card">
          <h2>🔐 Security</h2>

          <ChangePassword />
        </div>
      </div>
      {showAddUserModal && (
        <AddUserModal
          onClose={() => setShowAddUserModal(false)}
          onUserAdded={loadUsers}
        />
      )}
    </>
  );
}

export default Settings;
