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
    console.debug("Fetched Users Response:", JSON.stringify(data, null, 2));
    return Array.isArray(data) ? data : data.users || [];
  } catch (error) {
    console.error("Error in fetchUsers:", error.message);
    throw error;
  }
}