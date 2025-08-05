import { useState } from "react";
import { requestPasswordReset, resetPassword } from "../utils/ fetchReset";

export function useRequestPasswordReset() {
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
      setError(err.message || "Failed to send reset request");
      setLoading(false);
      throw err;
    }
  };

  return { sendResetRequest, loading, error };
}

export function useResetPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitResetPassword = async ({ email, otp, password }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await resetPassword(email, otp, password);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message || "Failed to reset password");
      setLoading(false);
      throw err;
    }
  };

  return { submitResetPassword, loading, error };
}
