
// src/App.js
import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ComingSoon from "./404";
import Orders from "./Orders"; 
import DashboardLayout from './sharedcomponent/Layout';



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

      </Routes>
    </BrowserRouter>
  );
}

export default App;


