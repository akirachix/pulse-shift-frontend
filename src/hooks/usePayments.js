import { useEffect, useState } from "react";
import apiEndpoints from "../utils/fetchData";

export  function usePayments() {
    const [payments, setPayments] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const data = await apiEndpoints.payments();
                setPayments(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    return { payments, loading, error };
}