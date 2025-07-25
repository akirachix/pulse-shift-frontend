import { useState, useEffect } from 'react';
import apiEndpoints from '../utils/fetchData';

export  function useOrders() {
    const [orders, setOrders] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const data = await apiEndpoints.orders();

                setOrders(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    return { orders, loading, error };
}


