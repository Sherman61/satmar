import React, { useState, useEffect } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner"; // library for barcode scanning
import axios from "axios";

const ScanBarCode = ({ labelCode: propLabelCode, setLabelCode }) => {
  // Local state for the label code and items
  const [localLabelCode, setLocalLabelCode] = useState(propLabelCode || "");
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [cameraEnabled, setCameraEnabled] = useState(false);

  // Sync propLabelCode with local state
  useEffect(() => {
    if (propLabelCode && propLabelCode !== localLabelCode) {
      setLocalLabelCode(propLabelCode);
      fetchLabelItems(propLabelCode);
    }
  }, [propLabelCode]);

  // Handle barcode scan
  const handleScan = async (code) => {
    if (!code) {
      console.log("No code scanned.");
      return;
    }
    setLocalLabelCode(code);
    console.log("Scanned Code:", code);
    if (setLabelCode) {
      setLabelCode(code);
    }
    fetchLabelItems(code);
  };

  // Fetch label items from the server
  const fetchLabelItems = async (code) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/labels/${code}`);
      const itemsWithNames = response.data.items || [];
      setItems(itemsWithNames);
      setError("");
    } catch (err) {
      console.error("Error fetching label items:", err);
      setError("Failed to fetch label items. Please try again.");
    }
  };

  // Remove an item from the label
  const removeFromLabel = async (itemId) => {
    try {
      await axios.patch(`http://localhost:5000/api/labels/${localLabelCode}/remove-item`, { item_id: itemId });
      setItems(items.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error("Error removing item from label:", err);
      setError("Failed to remove item from label. Please try again.");
    }
  };

  // Delete an item from inventory
  const deleteItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5000/api/inventory/${itemId}`);
      setItems(items.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error("Error deleting item:", err);
      setError("Failed to delete item. Please try again.");
    }
  };

  // Fetch items when the localLabelCode changes
  useEffect(() => {
    if (localLabelCode) {
      fetchLabelItems(localLabelCode);
    } else {
      console.log("No label code provided.");
    }
  }, [localLabelCode]);

  return (
    <div className="container mt-4">
      <h1 className="text-center">Scan Barcode</h1>

      <div className="scanner mt-4">
        {cameraEnabled && (
          <BarcodeScannerComponent
            width={500}
            height={500}
            onUpdate={(err, result) => {
              if (result) handleScan(result.text);
            }}
          />
        )}

        <div className="mt-3">
          <button
            className="btn btn-secondary mb-3"
            onClick={() => setCameraEnabled(!cameraEnabled)}
          >
            {cameraEnabled ? "Disable Camera" : "Enable Camera"}
          </button>

          <input
            type="text"
            className="form-control"
            placeholder="Enter Label Code Manually"
            value={localLabelCode}
            onChange={(e) => {
              const newCode = e.target.value;
              setLocalLabelCode(newCode);
              if (setLabelCode) {
                setLabelCode(newCode);
              }
            }}
          />
          <button
            className="btn btn-primary mt-2"
            onClick={() => fetchLabelItems(localLabelCode)}
          >
            Fetch Items
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {items.length > 0 ? (
        <div className="items-list mt-4">
          <h2>Items in Label</h2>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Item ID</th>
                <th>Name</th>
                <th>Weight</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.weight}</td>
                  <td>${item.price}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => removeFromLabel(item.id)}
                    >
                      Remove from Label
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteItem(item.id)}
                    >
                      Delete Item
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center mt-4">No items to display.</div>
      )}
    </div>
  );
};

export default ScanBarCode;
