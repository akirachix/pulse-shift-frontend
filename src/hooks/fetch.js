import { useState, useEffect } from "react";
import { fetchUsers } from "../utils/fetchUsers";

export default function useFetchUserData() {
 const [users, setUsers] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [verifying, setVerifying] = useState(false);
 const [verificationError, setVerificationError] = useState(null);
 const [verificationResult, setVerificationResult] = useState(null);
 const [verifiedUserId, setVerifiedUserId] = useState(null);

 useEffect(() => {
 async function loadUsers() {
 setLoading(true);
 setError(null);

 try {
 const fetchedUsers = await fetchUsers();
 console.log("Fetched Users (Raw):", JSON.stringify(fetchedUsers, null, 2));
 setUsers(fetchedUsers);
 } catch (err) {
 console.log("Fetch Error:", err.message); 
 setError(err.message || "Failed to load users");
 } finally {
 setLoading(false);
 }
 }

 loadUsers();
 }, []);

 const verify = async (userId) => {
 setVerificationError(null);
 setVerificationResult(null);
 setVerifiedUserId(userId);
 setVerifying(true);

 try {
 await new Promise((resolve) => setTimeout(resolve, 1500));
 setVerificationResult(true);
 } catch (err) {
 setVerificationError(err.message || `Failed to verify user ${userId}`);
 setVerificationResult(false);
 } finally {
 setVerifying(false);
 }
 };

 return {
 users,
 loading,
 error,
 verifying,
 verificationError,
 verificationResult,
 verifiedUserId,
 verify,
 };
}