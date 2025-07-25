import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';


import DashboardLayout from './components/Layout';
import ComingSoon from './404';
import SignIn from './SignIn';
import ProfileViewScreen from './profile';


function App() {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="profile" element={<ProfileViewScreen />} />
    

      
          <Route path="*" element={<ComingSoon />} />
        </Route>

        <Route path="SignIn" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
