import "../styles/UserCard.css";

function UserCard({ user, onDelete }) {
  return (
    <div className="user-card">
      <div className="user-details">
        <div className="user-card-name">👤 {user.name}</div>

        <div className="user-card-email">{user.email}</div>

        <div className="user-card-role">
          {user.role === "admin" ? "Administrator" : "Employee"}
        </div>
      </div>

      <button
        className="delete-user-btn"
        onClick={() => {
          const confirmDelete = window.confirm(
            `Are you sure you want to delete "${user.name}"?`,
          );

          if (confirmDelete) {
            onDelete(user.id);
          }
        }}
      >
        🗑 Delete
      </button>
    </div>
  );
}

export default UserCard;
