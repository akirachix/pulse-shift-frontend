
import React from 'react';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Orders from "./Orders"; 
import Sales from './Sales/';
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import ResetNotification from "./ResetNotification";
import Verify from "./Verify";
import AdminDashboard from './Dashboard';
import DashboardLayout from './shared-components/Layout';
import SignIn from './SignIn';
import ProfileViewScreen from './Profile';
// import SalesDashboard from './Sales';





function App() {


  const handleSelectMamaMboga = (mamaMbogaId) => {


    console.log("Selected Mama Mboga ID:", mamaMbogaId);
  };


  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/profile" element={<ProfileViewScreen />} />
           <Route path="/orders" element={<Orders onSelectMamaMboga={handleSelectMamaMboga} />} />
          <Route path="orders" element={<Orders />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/" element={<AdminDashboard />} />
          <Route path="*" element={<ComingSoon />} />
          {/* <Route path="/sales" element={<SalesDashboard/>} /> */}
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