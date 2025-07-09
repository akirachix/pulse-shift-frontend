import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DashboardLayout from './components/Layout';
import ComingSoon from './pages/404';


function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="*" element={<ComingSoon />} />
          </Route>
      </Routes>
      </BrowserRouter>
  );
}

export default App;
