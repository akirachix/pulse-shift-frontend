import { useState } from "react";
import { requestPasswordReset } from "../utils/requestPasswordResetUtils";

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
