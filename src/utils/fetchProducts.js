export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export async function fetchProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('[fetchProducts] Error:', error);
    throw error;
  }
}
