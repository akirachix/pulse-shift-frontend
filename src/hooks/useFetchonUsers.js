
import { useState, useEffect } from "react";
import { fetchData } from "../utils/fetchOrders";

export function useFetchUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getUsers() {
      setLoading(true);
      setError(null);
      try {

        const data = await fetchData("/users/");
        setUsers(data);
      } catch (err) {
        setError(err.message || "Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    }
    getUsers();
  }, []);

  return { users, loading, error };
}
