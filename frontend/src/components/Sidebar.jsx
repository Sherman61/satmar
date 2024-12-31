import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
   
const Sidebar = ({ onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    onToggle(newCollapsedState);
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* Toggle Button */}
      <button
        className="btn toggle-btn"
        onClick={toggleSidebar}
        aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? "☰" : "✕"}
      </button>

      {/* Menu */}
      {!isCollapsed && (
        <ul className="nav flex-column mt-4">
          <NavLink to="/" className="nav-link" >
              Home 
            </NavLink>

          <li className="nav-item">
            <NavLink to="label-maker" className="nav-link" >
              Add Label
            </NavLink>
          </li>
          <li className="nav-item">
            
          </li>
          <li className="nav-item">
            <NavLink to="/reports" className="nav-link" >
              Reports
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/inventory"
              className="nav-link"
              
            >
              Inventory
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/add-inventory"
              className="nav-link"
              
            >
              Add inventory
            </NavLink>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
