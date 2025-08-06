const token = localStorage.getItem("token");

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export async function fetchData(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}


export const fetchOrders = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch /orders: Status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error fetching orders: ${error.message}`);
  }
};



