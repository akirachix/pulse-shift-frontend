import { useState } from "react";
import './index.css'

export default function UserProfile() {
  const [open, setOpen] = useState(false);
  const toggleMenu = () => setOpen(!open);

  return (
    <div className="user-profile" style={{ position: "relative" }}>
      <div
        onClick={toggleMenu}
        data-testid="profile-toggle"
        style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
      >
        <img
          src="/images/profile.png"
          alt="Admin Avatar"
          style={{ width: 40, height: 40, borderRadius: "50%" }}
        />
        <span style={{ marginLeft: 8 }}>Admin</span>
      </div>
      {open && (
        <div
          className="profile-dropdown"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            background: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            borderRadius: 4,
            marginTop: 8,
            minWidth: 150,
            zIndex: 100,
          }}
        >
          <a href="/profile" style={{ display: "block", padding: "8px 16px" }}>
            Profile
          </a>
          <a href="/settings" style={{ display: "block", padding: "8px 16px" }}>
            Settings
          </a>
          <a href="/logout" style={{ display: "block", padding: "8px 16px" }}>
            Logout
          </a>
        </div>
      )}
    </div>
  );
}