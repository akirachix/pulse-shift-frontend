import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './index.css';
import { useRequestPasswordReset } from "../hooks/useResetPassword";



const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { sendResetRequest, loading, error } = useRequestPasswordReset();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await sendResetRequest(email.trim().toLowerCase());
      setMessage("OTP sent! Check your email.");
      setTimeout(() => {
        navigate("/verify", { state: { email } });
      }, 1000);
    } catch (err) {
      setMessage(error || "Failed to send OTP.");
    }
  };

  return (
    <div className="forgot-root">
      <div className="forgot-image-side" style={{ position: "relative" }}>
        <div className="forgot-advert-text">
          <span className="forgot-advert-green">Fresh picks, mtaani quick</span>
          <br />
          <span className="forgot-advert-orange">Everyday’s a market day!</span>
        </div>
        <img src="images/send-otp.png" alt="Fresh basket" className="forgot-image" />
      </div>
      <div className="forgot-form-side">
        <form className="forgot-form" onSubmit={handleSubmit} noValidate>
          <h1 className="forgot-title">Forgot Password</h1>
          <div className="forgot-input-group">
            <label htmlFor="email" className="forgot-label">
              Enter Your Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="forgot-input"
              placeholder="e.g. danait@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={loading}
            />
          </div>
          <button type="submit" className="forgot-submit" disabled={loading || !email}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
          {message && (
            <div className="forgot-success" style={{ marginTop: "10px" }}>
              {message}
            </div>
          )}
          {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
