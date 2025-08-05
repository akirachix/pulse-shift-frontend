export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const token = localStorage.getItem("token");

export async function fetchStockRecords() {
  try {
    const response = await fetch(`${API_BASE_URL}/stock_record`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${token},`
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch stock_record: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('[fetchStockRecords] Error:', error);
    throw error;
  }
}
