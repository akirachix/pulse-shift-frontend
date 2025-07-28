import { useEffect, useState } from "react";
import apiEndpoints from "../utils/fetchData";


export function useMamambogas() {
    const [mamambogas, setMamambogas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadMamambogas() {
            try {
                setLoading(true);
                const users = await apiEndpoints.users();
                const filteredMamambogas = users.filter(user => user.user_type === "mama_mboga");
                setMamambogas(filteredMamambogas);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        loadMamambogas();
    }, []);

    return { mamambogas, loading, error };
}
