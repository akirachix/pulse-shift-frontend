import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import { useAuth } from '../AuthContext';

function Signout() {
  const { setIsAuthenticated } = useAuth();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/signin');
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Sign Out</h1>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <p className="text-gray-700 mb-4">
          Are you sure you want to sign out?
        </p>
        {!confirmLogout ? (
          <button
            onClick={() => setConfirmLogout(true)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
          >
            Sign Out
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-gray-700">Confirm sign out?</p>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Confirm
            </button>
            <button
              onClick={() => setConfirmLogout(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Signout;