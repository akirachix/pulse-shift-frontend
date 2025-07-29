export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) {
      throw new Error(`Failed to fetch /users: Status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('[fetchUsers] Error fetching /users:', error);
    throw error;  
  }
};
