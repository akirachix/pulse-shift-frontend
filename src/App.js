import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DashboardLayout from './shared-components/Layout';
import ComingSoon from './404';
import AdminDashboard from './Dashboard';


function App() {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <Routes>
          <Route element={<DashboardLayout />}>
          <Route path="/" element={<AdminDashboard />} />
            <Route path="*" element={<ComingSoon />} />
          </Route>
      </Routes>
      </BrowserRouter>
  );
}

export default App;
