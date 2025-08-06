import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import DashboardLayout from './shared-components/Layout';
import SignIn from './SignIn';
import ProfileViewScreen from './UserProfile';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import ResetNotification from './ResetNotification';
import Verify from './Verify';
import SalesDashboard from './Sales';
import ComingSoon from './404';
import Orders from './Orders';
import ProductPage from './Products';
import AdminDashboard from './Dashboard';
import Signout from './Signout';
import { AuthContext, useAuth } from './AuthContext';


function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    function handleStorage() {
      setIsAuthenticated(!!localStorage.getItem("token"));
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);
  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/signin" replace />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_relativeSplatPath: true }}>
        <Routes>
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/users" element={<ProfileViewScreen />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/" element={<AdminDashboard />} />
            <Route path="products" element={<ProductPage />} />
            <Route path="/sales" element={<SalesDashboard />} />
            <Route path="*" element={<ComingSoon />} />
            <Route path="/logout" element={<Signout />} />
          </Route>
          {}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset-notification" element={<ResetNotification />} />
          <Route path="/verify" element={<Verify />} />
        
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;