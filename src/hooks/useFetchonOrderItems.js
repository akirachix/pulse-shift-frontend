
import { useState, useEffect } from "react";
import { fetchData } from "../utils/fetchonOrders";

export function useFetchOrderItems() {
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getOrderItems() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchData("/order-items/");
        setOrderItems(data);
      } catch (err) {
        setError(err.message || "Failed to fetch order items.");
      } finally {
        setLoading(false);
      }
    }
    getOrderItems();
  }, []);

  return { orderItems, loading, error };
}
