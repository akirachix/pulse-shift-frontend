import React from "react";
import { Sidebar } from "../Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
    return (
        <div className="dashboard-layout">
            <Sidebar />
    
            <div className="main-content">
                <Outlet />
            </div>
        </div>
    );
}