
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
export const fetchOrders = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`);
    if (!response.ok) {
      throw new Error(`Failed to fetch /orders: Status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error fetching orders: ${error.message}`);
  }
};

export async function fetchData(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

