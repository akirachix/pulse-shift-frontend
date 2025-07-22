import React from 'react';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DashboardLayout from './shared-components/Layout';
import ComingSoon from './404';
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import ResetNotification from "./ResetNotification";
import Verify from "./Verify";

import Sales from './Sales/';



function App() {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <Routes>
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
