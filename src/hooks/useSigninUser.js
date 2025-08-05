import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../utils/fetchUsersSignIn";

export function useSigninUser(onLoginSuccess) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const validatePassword = (password) => password.length >= 6;

  const signin = async (username, password) => {
    setError(null);

    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters.");
      return false;
    }

    setLoading(true);

    try {
      const data = await signIn({ username, password });
      localStorage.setItem("token", data.token);

      if (onLoginSuccess) {
        onLoginSuccess(data);
      }

      navigate("/");
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { signin, error, loading };
}
