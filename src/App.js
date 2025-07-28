
import React from 'react';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import DashboardLayout from './sharedcomponent/Layout';
import SignIn from './SignIn';
import ProfileViewScreen from './UserProfile';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import ResetNotification from './ResetNotification';
import Verify from './Verify';
import SalesDashboard from './Sales';
import ComingSoon from './404';
import Orders from './Orders';
import AdminDashboard from './Dashboard';






function App() {


  const handleSelectMamaMboga = (mamaMbogaId) => {
    console.log("Selected Mama Mboga ID:", mamaMbogaId);
  };


  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/users" element={<ProfileViewScreen />} />
          <Route path="/orders" element={<Orders onSelectMamaMboga={handleSelectMamaMboga} />} />
          <Route path="/" element={<AdminDashboard />} />
          <Route path="*" element={<ComingSoon />} />
          <Route path="/sales" element={<SalesDashboard/>} />
        </Route>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-notification" element={<ResetNotification />} />
        <Route path="/verify" element={<Verify />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;


