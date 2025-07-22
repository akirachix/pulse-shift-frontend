import React from "react";
import { useNavigate } from "react-router-dom"; 
import "./index.css";


const ResetNotification = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/sign-in"); 
  };

  return (
    <div className="reset-notification-container">
      <div className="reset-notification-checkmark">
        <img
          src="images/Ellipse.png"
          alt="Success background"
          className="reset-notification-ellipse"
        />
      </div>
      <h1 className="reset-notification-title">Congratulations</h1>
      <p className="reset-notification-message">
        Your account has been<br />successfully recovered.
      </p>
      <button
        className="reset-notification-button"
        onClick={handleSignIn} 
      >
        Sign In
      </button>
    </div>
  );
};

export default ResetNotification;
