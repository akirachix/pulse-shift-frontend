export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const token = localStorage.getItem("token");


export async function fetchCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/product-category/`,{
      method: 'GET',
      headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Token ${token}`,
    },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch product-category: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('[fetchCategories] Error:', error);
    throw error;
  }
}
