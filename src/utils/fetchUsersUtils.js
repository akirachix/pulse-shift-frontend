// utils/fetchUsersUtils.js

export async function fetchUsers() {
  const apiBaseUrl = process.env.REACT_APP_USERS_API_BASE_URL || "https://greensmtaani-d6ee50db917a.herokuapp.com";
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${apiBaseUrl}/users/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Token ${token}`,
    },
  });

  if (!response.ok) {
    let errorMsg = "Failed to fetch users";
    try {
      const data = await response.json();
      errorMsg = data.error || data.detail || errorMsg;
    } catch {
    }
    throw new Error(errorMsg);
  }

  const data = await response.json();
  console.log("Processed Users Response:", JSON.stringify(data, null, 2));
  return Array.isArray(data) ? data : data.users || [];
}
