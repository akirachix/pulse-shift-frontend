import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./index.css";

const OTP_LENGTH = 4;

function Verify() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [activeInput, setActiveInput] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (inputRefs.current[activeInput]) {
      inputRefs.current[activeInput].focus();
    }
  }, [activeInput]);

  const handleChange = (e, idx) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value) {
      const newOtp = [...otp];
      newOtp[idx] = value[0];
      setOtp(newOtp);
      if (idx < OTP_LENGTH - 1) {
        setActiveInput(idx + 1);
      }
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      if (newOtp[idx]) {
        newOtp[idx] = "";
        setOtp(newOtp);
      } else if (idx > 0) {
        setActiveInput(idx - 1);
        newOtp[idx - 1] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      e.preventDefault();
      setActiveInput(idx - 1);
    } else if (e.key === "ArrowRight" && idx < OTP_LENGTH - 1) {
      e.preventDefault();
      setActiveInput(idx + 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (pasteData) {
      const newOtp = [...otp];
      for (let i = 0; i < pasteData.length; i++) {
        newOtp[i] = pasteData[i];
      }
      setOtp(newOtp);
      setActiveInput(Math.min(pasteData.length, OTP_LENGTH - 1));
    }
  };

  const handleResend = () => {
    alert("OTP resent!"); 
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    navigate("/reset-password", { state: { email, otp: otpCode } });
  };

  return (
    <div className="verify-container">
      <div className="verify-left">
        <img src="images/verify.jpg" alt="Fresh produce" className="verify-img" />
        <div className="signin-advert-text">
          <span className="advert-green">Fresh picks, mtaani quick</span>
          <br />
          <span className="advert-orange">Everyday’s a market day!</span>
        </div>
      </div>
      <div className="verify-right">
        <form className="otp-form" onSubmit={handleVerify}>
          <h1>Enter OTP</h1>
          <p>
            Enter the code sent to your email{email && <> <b>({email})</b></>}
          </p>
          <div className="otp-inputs">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                type="tel"
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
                value={digit}
                ref={(el) => (inputRefs.current[idx] = el)}
                onChange={(e) => handleChange(e, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                onPaste={handlePaste}
                className="otp-input"
                aria-label={`OTP digit ${idx + 1}`}
                autoComplete="one-time-code"
              />
            ))}
          </div>
          <div className="otp-resend">
            <span>Didn't receive an OTP?</span>
            <button type="button" className="resend-btn" onClick={handleResend}>
              Resend OTP
            </button>
          </div>
          <button type="submit" className="verify-btn" disabled={otp.includes("")}>
            Verify
          </button>
        </form>
      </div>
    </div>
  );
}

export default Verify;
