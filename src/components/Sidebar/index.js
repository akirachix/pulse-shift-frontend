import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faCartShopping,
  faFileAlt,
  faChartBar,
  faCog,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";
import "./index.css";

const navLinks = [
  {
    label: "Home",
    icon: faHouse,
    to: "/", 
  },
  {
    label: "Products",
    icon: faCartShopping,
    to: "/products",
  },
  {
    label: "Orders",
    icon: faFileAlt,
    to: "/orders",
  },
  {
    label: "Sales",
    icon: faChartBar,
    to: "/sales",
  },
];

const bottomLinks = [
  {
    label: "Settings",
    icon: faCog,
    to: "/settings",
  },
  {
    label: "Log Out",
    icon: faSignOut,
    to: "/logout", 
  },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div>
        <img src="/logo-white.png" alt="greens mtaani logo" width={150} className="sidebar-logo" />
        <ul>
          {navLinks.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => isActive ? "active sidebar-link" : "sidebar-link"}
                end
              >
                {({ isActive }) => (
                  <>
                    {isActive && <div className="sidebar-pill"></div>}
                    <FontAwesomeIcon icon={item.icon} className="sidebar-icon" />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <ul>
          {bottomLinks.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => isActive ? "active sidebar-link" : "sidebar-link"}
                end
              >
                {({ isActive }) => (
                  <>
                    {isActive && <div className="sidebar-pill"></div>}
                    <FontAwesomeIcon icon={item.icon} className="sidebar-icon" />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;