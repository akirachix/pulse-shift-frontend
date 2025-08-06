
import { useState, useEffect } from "react";
import { fetchData } from "../utils/fetchOrders";
import apiEndpoints from '../utils/fetchData';

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


export function useOrders() {
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


