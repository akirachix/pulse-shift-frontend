export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export async function fetchStockRecords() {
  try {
    const response = await fetch(`${API_BASE_URL}/stock_record`);
    if (!response.ok) {
      throw new Error(`Failed to fetch stock_record: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('[fetchStockRecords] Error:', error);
    throw error;
  }
}
