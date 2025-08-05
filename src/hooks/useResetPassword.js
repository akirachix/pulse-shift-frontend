import { useState } from "react";
import { resetPassword } from "../utils/resetPasswordUtils";

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
