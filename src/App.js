import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DashboardLayout from './sharedcomponent/Layout';
import Sales from './Sales/';
import ProductPage from './Products';
import ComingSoon from './404';


function App() {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/products" element={<ProductPage/>}/>
            <Route path="/sales" element={<Sales/>} />
            <Route path="*" element={<ComingSoon />} />
           
          </Route>
      </Routes>
      </BrowserRouter>
  );
}

export default App;
