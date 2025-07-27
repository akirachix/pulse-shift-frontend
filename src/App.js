
import React from 'react';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import DashboardLayout from "./components/Layout";7
// import ComingSoon from "./pages/404";
import Orders from "./Orders"; 
import DashboardLayout from './sharedcomponent/Layout';
import Sales from './Sales/';
import ProductPage from './Products';
import ComingSoon from './404';
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import ResetNotification from "./ResetNotification";
import Verify from "./Verify";

// import Sales from './Sales/';


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
            <Route path="/products" element={<ProductPage/>}/>
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


