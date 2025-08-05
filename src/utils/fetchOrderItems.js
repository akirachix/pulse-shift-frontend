
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
export const fetchOrderItems = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/order-items`);
    if (!response.ok) {
      throw new Error(`Failed to fetch /order-items: Status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw error;  
  }
};
