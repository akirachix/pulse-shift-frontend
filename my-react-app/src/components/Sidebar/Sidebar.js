import React from "react";
import "./Sidebar.css";

const Sidebar = () => (
  <div className="sidebar">
    <div className="sidebar-link">
      <span className="sidebar-icon home-icon" />
      Home
    </div>
    <div className="sidebar-product">
      <span className="sidebar-icon products-icon" />
      Products
    </div>
    <div className="sidebar-link">
      <span className="sidebar-icon orders-icon" />
      Orders
    </div>
    <div className="sidebar-link">
      <span className="sidebar-icon sales-icon" />
      Sales
    </div>
  </div>
);

export default Sidebar;




 