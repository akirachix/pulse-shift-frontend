const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export async function fetchUser() {
  const token = localStorage.getItem("token");
  
  if (!token) {
    throw new Error('No authentication token found. Please log in.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${token}`
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.email; 
  } catch (error) {
    console.error('[fetchUser] Error:', error);
    throw error;
  }
}