import { useEffect, useState } from "react";
import apiEndpoints from "../utils/fetchData";

export function useCustomers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadCustomers() {
            try {
                setLoading(true);
                const users = await apiEndpoints.users();
                const filteredCustomers = users.filter(user => user.user_type === "customer");
                setCustomers(filteredCustomers);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        loadCustomers();
    }, []);

    return { customers, loading, error };
}