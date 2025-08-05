const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://greensmtaani-d6ee50db917a.herokuapp.com";

async function fetchData(endpoint, method = "GET", body = null) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = errorData.detail || `Error: ${response.status}`;
    throw new Error(errorMessage);
  }

  return response.json();
}

export const requestPasswordReset = (email) =>
  fetchData("/reset-request/", "POST", { email });

export const resetPassword = (email, otp, password) =>
  fetchData("/reset-password/", "PUT", { email, otp, password });

