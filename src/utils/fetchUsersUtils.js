export async function fetchUsers() {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication token is missing.");
  }

  try {
    
    const response = await fetch(`${apiBaseUrl}/users/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: Status ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : data.users || [];
  } catch (error) {
    
    throw Error("Error in fetchUsers:", error.message)
  }
}