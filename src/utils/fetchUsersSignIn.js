

export async function loginUser({ username, password }) {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";
  const response = await fetch(`${apiBaseUrl}/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    let errorMsg = "Invalid username or password";
    try {
      const errorData = await response.json();
      errorMsg = errorData.detail || errorMsg;
    } catch {
    }
    throw new Error(errorMsg);
  }

  const data = await response.json();

  if (!data.token) {
    throw new Error("No token received from server");
  }

  return data;
}
