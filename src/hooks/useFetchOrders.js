
import { useState, useEffect } from "react";
import { fetchData } from "../utils/fetchOrders";

export function useFetchOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getOrders() {
      setLoading(true);
      setError(null);
      try {

        const data = await fetchData("/orders/");
        setOrders(data);
      } catch (err) {
        setError(err.message || "Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    }
    getOrders();
  }, []);

  return { orders, loading, error };
}
