
import { useState, useEffect } from 'react';
import { fetchOrders } from '../utils/fetchOrders'; 
export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (err) {
      console.error("Error loading orders:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []); 
  return { orders, loading, error, refetch: loadOrders };
};
