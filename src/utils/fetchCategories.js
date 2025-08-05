export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export async function fetchCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/product-category`);
    if (!response.ok) {
      throw new Error(`Failed to fetch product-category: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('[fetchCategories] Error:', error);
    throw error;
  }
}
