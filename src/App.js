import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ComingSoon from "./404";
import Orders from "./Orders";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import ResetNotification from "./ResetNotification";
import Verify from "./Verify";
import AdminDashboard from './Dashboard';
import DashboardLayout from './shared-components/Layout';

function App() {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="*" element={<ComingSoon />} />
        </Route>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-notification" element={<ResetNotification />} />
        <Route path="/verify" element={<Verify />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;