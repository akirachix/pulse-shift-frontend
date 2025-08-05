import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useResetPassword } from "../hooks/useResetPassword";
import "./index.css";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [success, setSuccess] = useState("");
  const { submitResetPassword, loading, error } = useResetPassword();

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const otp = location.state?.otp || "";

  useEffect(() => {
    if (!email || !otp) {
      navigate("/forgot-password");
    }
  }, [email, otp, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setSuccess("");
      alert("Passwords do not match!");
      return;
    }
    try {
      await submitResetPassword({ email, otp, password: newPassword });
      setSuccess("Password successfully changed!");
      setNewPassword("");
      setConfirmPassword("");
      navigate("/reset-notification");
    } catch (err) {
      setSuccess("");
      alert(error || "Failed to reset password.");
    }
  };


  const toggleShowNewPassword = () => setShowNewPassword((prev) => !prev);
  const toggleShowConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  return (
    <div className="reset-root">
      <div className="reset-image-side">
        <div className="reset-advert-text">
          <span className="advert-green">Fresh picks, mtaani quick</span>
          <br />
          <span className="advert-orange">Everyday’s a market day!</span>
        </div>
        <img src="images/reset.png" alt="Reset Password" className="reset-image" />
      </div>
      <div className="reset-form-side">
        <form className="reset-form" onSubmit={handleSubmit} noValidate>
          <h1 className="reset-title">Reset Password</h1>

          <div className="reset-input-group">
            <label htmlFor="newPassword" className="reset-label">
              New Password
            </label>
            <div className="reset-password-wrapper" style={{ position: "relative" }}>
              <input
                id="newPassword"
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                className="reset-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                maxLength={32}
                autoComplete="new-password"
                disabled={loading}
              />
              <button
                type="button"
                className="signin-password-toggle" 
                tabIndex={-1}
                aria-label={showNewPassword ? "Hide password" : "Show password"}
                onClick={toggleShowNewPassword}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#222"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <ellipse
                    cx="12"
                    cy="12"
                    rx="8"
                    ry="5"
                    stroke={showNewPassword ? "#00D02E" : "#222"}
                  />
                  <circle cx="12" cy="12" r="2" />
                  <line
                    x1="4"
                    y1="4"
                    x2="20"
                    y2="20"
                    style={{ display: showNewPassword ? "none" : "block" }}
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="reset-input-group">
            <label htmlFor="confirmPassword" className="reset-label">
              Confirm Password
            </label>
            <div className="reset-password-wrapper" style={{ position: "relative" }}>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className="reset-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                maxLength={32}
                autoComplete="new-password"
                disabled={loading}
              />
              <button
                type="button"
                className="signin-password-toggle" 
                tabIndex={-1}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                onClick={toggleShowConfirmPassword}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#222"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <ellipse
                    cx="12"
                    cy="12"
                    rx="8"
                    ry="5"
                    stroke={showConfirmPassword ? "#00D02E" : "#222"}
                  />
                  <circle cx="12" cy="12" r="2" />
                  <line
                    x1="4"
                    y1="4"
                    x2="20"
                    y2="20"
                    style={{ display: showConfirmPassword ? "none" : "block" }}
                  />
                </svg>
              </button>
            </div>
          </div>

          <button type="submit" className="reset-submit" disabled={loading}>
            {loading ? "Changing..." : "Change Password"}
          </button>
          {success && <div className="reset-success">{success}</div>}
          {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
