
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export async function fetchData(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

