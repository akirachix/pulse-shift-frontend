import { useState } from "react";
import { requestPasswordReset, resetPassword } from "../utils/passwordReset";

export function usePasswordReset() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendResetRequest = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const data = await requestPasswordReset(email);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message || "Failed to send OTP.");
      setLoading(false);
      throw err;
    }
  };

  const submitResetPassword = async ({ email, otp, password }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await resetPassword(email, otp, password);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message || "Failed to reset password.");
      setLoading(false);
      throw err;
    }
  };

  return { sendResetRequest, submitResetPassword, loading, error };
}
