import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./components/Sidebar";

import AppRoutes from "./routes/AppRoutes";
import { fetchInventory } from "./services/api";

function App() {
  const [inventory, setInventory] = useState([]);
  const [labels, setLabels] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
 
  const handleSidebarToggle = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  const refreshData = () => {
    fetchInventory()
      .then((data) => setInventory(data || []))
      .catch((error) => {
        console.error("Error fetching inventory:", error);
        setInventory([]);
      });
  };

  const fetchLabels = () => {
    axios
      .get("http://localhost:5000/api/labels")
      .then((response) => setLabels(response.data))
      .catch((error) => console.error("Error fetching labels:", error));
  };

  useEffect(() => {
    refreshData();
    fetchLabels();
  }, []);

  const handleEdit = (id, model) => {
    console.log("Edit item with ID:", id);
  };

  const handleDelete = (id, model) => {
    axios
      .delete(`http://localhost:5000/api/${model}/${id}`)
      .then(() => refreshData())
      .catch((error) => console.error("Error deleting inventory:", error));
  };

  return (

    <Router>
      <div className="d-flex">
        {/* Sidebar */}
        <Sidebar onToggle={handleSidebarToggle} />
       
        {/* Main Content */}
        <div
          className="content"
          style={{
            marginLeft: isSidebarCollapsed ? "80px" : "250px",
            transition: "margin 0.3s ease-in-out",
            width: isSidebarCollapsed ? "calc(100% - 80px)" : "calc(100% - 250px)",
          }}
        >
          <AppRoutes
            inventory={inventory}
            labels={labels}
            refreshData={refreshData}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
  
    </Router>
  );
}

export default App;
