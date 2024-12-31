import React from "react";

const LeftNav = () => {
  return (
    <div className="leftnav">
      <div className=" col-2 bg-light p-3">
        <ul className="nav flex-column">
          <li className="nav-item">
            <a className="nav-link" href="/inventory">
              Inventory
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/label-maker">
              Label Maker
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/add-item">
              Add Item
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LeftNav;
