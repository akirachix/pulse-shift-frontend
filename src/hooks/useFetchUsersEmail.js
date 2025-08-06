import { useState, useEffect } from 'react';
import { fetchUser } from '../utils/fetchEmail';

export function useFetchUser() {
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const userEmail = await fetchUser();
        setEmail(userEmail);
        setLoading(false);
      } catch (err) {
        if (err.message.includes('No authentication token found')) {
          setError('Please log in to view your account.');
        } else {
          setError(`Failed to load user: ${err.message}`);
        }
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  return { email, loading, error };
}