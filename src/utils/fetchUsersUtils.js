export async function fetchUsers() {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "https://greensmtaani-d6ee50db917a.herokuapp.com";
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
      let errorMsg = `Failed to fetch users: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMsg = errorData.error || errorData.detail || errorMsg;
      } catch (parseError) {
        console.error("Error parsing error response:", parseError);
      }
      throw new Error(errorMsg);
    }
    const data = await response.json();
    console.debug("Fetched Users Response:", JSON.stringify(data, null, 2));
    return Array.isArray(data) ? data : data.users || [];
  } catch (error) {
    console.error("Error in fetchUsers:", error.message);
    throw error;
  }
}