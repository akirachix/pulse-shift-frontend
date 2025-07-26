const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

async function fetchData(endpoint) {

    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: defaultHeaders,
    });


    if (response.status === 401) throw new Error('Unauthorized');
    if (!response.ok) {
        const err = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error(err.detail || 'API error');
    }

    return response.json();
}

const apiEndpoints = {
    orders: () => fetchData('/orders/'),
    orderDetails: () => fetchData('/order-items/'),
    payments: () => fetchData('/payments/'),
    users: () => fetchData('/users/'),
};

export default apiEndpoints; 
