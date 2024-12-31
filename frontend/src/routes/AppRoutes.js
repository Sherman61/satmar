import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import InventoryTable from "../components/InventoryTable";
import LabelsTable from "../components/LabelsTable";
import LabelMaker from "../components/LabelMaker";
import AddItem from "../components/AddItem";
import Home from "../components/Home";
import Sidebar from "../components/Sidebar";
import Notes from "../components/Notes";
import ScanBarCode from "../components/ScanBarCode";
import Reports from "../components/Reports";

const AppRoutes = ({
  inventory,
  labels,
  refreshData,
  onEdit,
  onDelete,

  onLabelCreationSuccess,
}) => {
  const [labelCode, setLabelCode] = useState("");
useEffect(() => {
  console.log("Parent labelCode updated:", labelCode);
}, [labelCode]);

  return (
    <Routes>
      {/* Home Route */}
      <Route path="/" element={<Home />} />

      {/* Add Inventory Route */}
      <Route path="/add-inventory" element={<AddItem />} />

      {/* Scan Label Route */}
      <Route
        path="/scan-label"
        element={
          <div>
            <nav className="mb-3">
              <Link to="/labels" className="btn btn-link">
                Back to Labels
              </Link>
              <Link to="/inventory" className="btn btn-link">
                Back to Inventory
              </Link>
              <Link to="/label-maker" className="btn btn-link">
                Add Label
              </Link>
            </nav>
            <ScanBarCode labelCode={labelCode} setLabelCode={setLabelCode} />
          </div>
        }
      />

      {/* Inventory Route */}
      <Route
        path="/inventory"
        element={
          <InventoryTable
            inventory={inventory}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        }
      />

      {/* Label Maker Route */}
      <Route
        path="/label-maker"
        element={
          <LabelMaker
            refreshData={refreshData}
            onSuccess={onLabelCreationSuccess}
          />
        }
      />

      {/* Labels Route */}
      <Route
        path="/labels"
        element={<LabelsTable labels={labels} setLabelCode={setLabelCode} />}
      />

      {/* Reports Route */}
      <Route path="/reports" element={<Reports />} />

      {/* Notes Route */}
      <Route path="/notes" element={<Notes />} />

      {/* Sidebar Route */}
      <Route path="/sidebar" element={<Sidebar />} />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
