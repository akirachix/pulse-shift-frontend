import React from "react";
import { Sidebar } from "../Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout({ children }) {
    return (
        <div className="dashboard-layout">
            <Sidebar />
    
            <div className="main-content">
                <Outlet />
            </div>
        </div>
    );
}