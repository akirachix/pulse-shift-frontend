
// src/App.js
import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ComingSoon from "./404";
import Orders from "./Orders"; 
import DashboardLayout from './sharedcomponent/Layout';
import '@fortawesome/fontawesome-free/css/all.min.css';
import DashboardLayout from "./components/Layout";
import Sales from './Sales/';
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import ResetNotification from "./ResetNotification";
import Verify from "./Verify";





function App() {

  const handleSelectMamaMboga = (mamaMbogaId) => {

    console.log("Selected Mama Mboga ID:", mamaMbogaId);
  };

  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="orders" element={<Orders onSelectMamaMboga={handleSelectMamaMboga} />} />
          <Route path="*" element={<ComingSoon />} />
        </Route>

          <Route element={<DashboardLayout />}>
            <Route path="/sales" element={<Sales/>} />
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


