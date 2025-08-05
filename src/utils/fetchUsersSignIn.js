
export async function signIn({ username, password }) {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const response = await fetch(`${apiBaseUrl}/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch /users: Status ${response.status}`)

 }

  const data = await response.json();

  if (!data.token) {
    throw new Error("No token received from server");
  }

  return data;
}
