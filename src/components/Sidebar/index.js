import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faCartShopping,
  faFileAlt,
  faChartBar,
  faCog,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";
import "./index.css";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";

const navLinks = [
  { label: "Home", icon: faHouse, to: "/" },
  { label: "Products", icon: faCartShopping, to: "/products" },
  { label: "Orders", icon: faFileAlt, to: "/orders" },
  { label: "Sales", icon: faChartBar, to: "/sales" },
  { label: "Users", icon: faUser, to: "/profile" },
];

const bottomLinks = [
  { label: "Settings", icon: faCog, to: "/settings" },
  { label: "Log Out", icon: faSignOut, to: "/logout" },
];

export function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Sidebar navigation">
      <div className="side-nav">
        <img
          src="/images/logo-white.png"
          alt="greens mtaani logo"
          width={150}
          className="sidebar-logo"
        />
        <ul>
          {navLinks.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                aria-label={item.label}
                className={({ isActive }) =>
                  isActive ? "active sidebar-link" : "sidebar-link"
                }
                end
              >
                {({ isActive }) => (
                  <>
                    {isActive && <div className="sidebar-pill"></div>}
                    <FontAwesomeIcon
                      icon={item.icon}
                      className="sidebar-icon"
                      data-testid="sidebar-icon"  
                    />
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
                aria-label={item.label}
                className={({ isActive }) =>
                  isActive ? "active sidebar-link" : "sidebar-link"
                }
                end
              >
                {({ isActive }) => (
                  <>
                    {isActive && <div className="sidebar-pill"></div>}
                    <FontAwesomeIcon
                      icon={item.icon}
                      className="sidebar-icon"
                      data-testid="sidebar-icon"  
                    />
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
