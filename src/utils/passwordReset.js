const API_BASE =
  process.env.REACT_APP_API_BASE_URL || "https://greensmtaani-d6ee50db917a.herokuapp.com";

export const requestPasswordReset = async (email) => {
  const response = await fetch(`${API_BASE}/reset-request/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) {
    let errorMessage = "Error sending reset email";
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }
  return response.json();
};

export const resetPassword = async (email, otp, password) => {
  const response = await fetch(`${API_BASE}/reset-password/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp, password }),
  });
  if (!response.ok) {
    let errorMessage = "Password reset failed";
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }
  return response.json();
};
