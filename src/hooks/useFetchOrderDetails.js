import { useEffect, useState } from "react";
import apiEndpoints from "../utils/fetchData";

export function useOrdersDetails() {
    const [orders_items, setOrdersItems] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const data = await apiEndpoints.orderDetails();
                
                setOrdersItems(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    return { orders_items, loading, error };
}