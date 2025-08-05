const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://greensmtaani-d6ee50db917a.herokuapp.com";

async function fetchData(endpoint, method = "GET", body = null) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  if (!response.ok) {
    let errorMessage = `Error: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }
  return response.json();
}

export const requestPasswordReset = (email) =>
  fetchData("/reset-request/", "POST", { email });
