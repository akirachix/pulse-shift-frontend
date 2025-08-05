import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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



function App() {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <Routes>
        {}
        <Route element={<DashboardLayout />}>
          <Route path="/users" element={<ProfileViewScreen />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/" element={<AdminDashboard />} />
          <Route path="products" element={<ProductPage />} />
          <Route path="*" element={<ComingSoon />} />
          <Route path="/sales" element={<SalesDashboard/>} />
        </Route>
        <Route path="/signin" element={<SignIn />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-notification" element={<ResetNotification />} />
        <Route path="/verify" element={<Verify />} />

        <Route path="*" element={<ComingSoon />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
