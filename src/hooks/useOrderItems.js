import { useState, useEffect, useCallback } from 'react';
import { fetchOrderItems } from '../utils/fetchOrderItems';

export const useOrderItems = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadOrderItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchOrderItems();
      setOrderItems(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrderItems();
  }, [loadOrderItems]);

  return { orderItems, loading, error, refetch: loadOrderItems };
};
