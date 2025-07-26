import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUserSignin } from "../hooks/useSigninUser";
import "./index.css";

const SignIn = ({ onLoginSuccess }) => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { signin, error, loading, success } = useUserSignin(onLoginSuccess);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSubmitted(false);
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const isFormValid = () => {
    return form.password.length >= 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!isFormValid()) {
      return;
    }

    await signin(form.username, form.password);
  };

  return (
    <div className="signin-root">
      <div className="signin-image-side">
        <div className="signin-advert-text">
          <span className="advert-green">Fresh picks, mtaani quick</span>
          <br />
          <span className="advert-orange">Everyday’s a market day!</span>
        </div>
        <img src="images/signup.jpg" alt="Vegetables" className="signin-image" />
      </div>

      <div className="signin-form-side">
        <form className="signin-form" autoComplete="off" onSubmit={handleSubmit} noValidate>
          <h1 className="signin-title">Sign In</h1>

          {error && <div className="signin-error">{error}</div>}

          <div className="signin-input-group">
            <label htmlFor="username" className="signin-label">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className="signin-input"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter Your Username"
              maxLength={254}
              required
            />
          </div>

          <div className="signin-input-group">
            <label htmlFor="password" className="signin-label">
              Password
            </label>
            <div className="signin-password-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className="signin-input"
                value={form.password}
                onChange={handleChange}
                maxLength={32}
                autoComplete="off"
                placeholder="Enter Your Password"
                required
                aria-invalid={submitted && form.password.length < 6}
              />
              <button
                type="button"
                className="signin-password-toggle"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={toggleShowPassword}
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
                  <ellipse cx="12" cy="12" rx="8" ry="5" stroke={showPassword ? "#00d02e" : "#222"} />
                  <circle cx="12" cy="12" r="2" />
                  <line
                    x1="4"
                    y1="4"
                    x2="20"
                    y2="20"
                    style={{ display: showPassword ? "none" : "block" }}
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="signin-options-row">
            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>
            <label className="signin-checkbox-label">
              <input type="checkbox" className="signin-checkbox" />
              Remember me
            </label>
          </div>

          <button type="submit" className="signin-submit" disabled={loading || !isFormValid()}>
            {loading ? "Signing In..." : "Sign In"}
          </button>

          {submitted && success && !error && !loading && (
            <div className="signin-success">Sign in successful!</div>
          )}

          <div className="signin-footer">
            <span>Do not have an account? </span>
            <Link to="/registration" className="signin-signup-link">
              SIGN UP
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;

