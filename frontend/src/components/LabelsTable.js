import React, { useState, useEffect } from "react";
import Barcode from "react-barcode";
import axios from "axios";
import ScanBarCode from "./ScanBarCode";

function LabelsTable({ labels = [], setLabelCode, labelCode }){
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [items, setItems] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [newItem, setNewItem] = useState({ source: "items", id: "", weight: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  // Handle double-click on label
  const handleDoubleClick = (labelCode) => {
    console.log("Double-clicked Label Code:", labelCode);
    if (setLabelCode) {
      setLabelCode(labelCode); // Update labelCode in parent
    } else {
      console.error("setLabelCode is not defined.");
    }
  };
  

  // Fetch items and inventory
  useEffect(() => {
    const fetchItemsAndInventory = async () => {
      setLoading(true);
      try {
        const [itemsResponse, inventoryResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/items"),
          axios.get("http://localhost:5000/api/inventory"),
        ]);

        // Filter inventory linked to a label
        const linkedInventoryIds = labels
          .map((label) => label.item_ids?.split(",") || [])
          .flat()
          .map(Number);

        const filteredInventory = inventoryResponse.data.filter(
          (item) => !linkedInventoryIds.includes(item.id)
        );

        setItems(itemsResponse.data);
        setInventoryItems(filteredInventory);
      } catch (err) {
        console.error("Error fetching items/inventory:", err);
        setError("Failed to load items or inventory.");
      } finally {
        setLoading(false);
      }
    };

    fetchItemsAndInventory();
  }, [labels]);

  // Print barcode
  const handlePrint = (label) => setSelectedLabel(label);

  // Close modal
  const handleCloseModal = () => setSelectedLabel(null);

  // Add item to label
  const handleAddItemToLabel = async (label) => {
    if (!newItem.id) {
      alert("Please select an item to add.");
      return;
    }
    if (newItem.source === "items" && (!newItem.weight || parseFloat(newItem.weight) <= 0)) {
      alert("Please provide a valid weight.");
      return;
    }

    try {
      const payload = {
        item_id: newItem.id,
        source: newItem.source, ...(newItem.source === "items" && { weight: parseFloat(newItem.weight) }),
      };

      await axios.patch(`http://localhost:5000/api/labels/${label.label_code}/add-item`, payload);
      alert("Item added successfully!");
      setNewItem({ source: "items", id: "", weight: "" });
      handleCloseModal();
    } catch (err) {
      console.error("Error adding item to label:", err);
      alert("Failed to add item to label.");
    }
  };
  
  return (
    <div>
      <ScanBarCode labelCode={labelCode} setLabelCode={setLabelCode} />
      <h2>Labels</h2>

      {loading && <p>Loading...</p>}

      {error && <div className="alert alert-danger">{error}</div>}

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Label ID</th>
            <th>Label Code</th>
            <th>Item IDs</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {labels.length > 0 ? (
            labels.map((label) => (
              <tr key={label.label_id} onDoubleClick={() => handleDoubleClick(label.label_code)}>
                <td>{label.label_id}</td>
                <td style={{ textDecoration: "underline", color: "blue", cursor: "pointer" }}>
                  {label.label_code}
                </td>
                <td>{label.item_ids || "No items in label"}</td>
                <td>
                  <button className="btn btn-primary btn-sm" onClick={() => handlePrint(label)}>
                    Print
                  </button>
                  <button
                    className="btn btn-secondary btn-sm ml-2"
                    onClick={() => setSelectedLabel(label)}
                  >
                    Add Items
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No labels available.
              </td>
            </tr>
          )}
        </tbody>
                </table>

  {/* Modal for managing a label */}
  {selectedLabel && (
    <div
      className="modal show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Manage Label: {selectedLabel.label_code}</h5>
            <button
              type="button"
              className="close"
              onClick={handleCloseModal}
            >
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <h6>Barcode</h6>
            <div className="text-center mb-3">
              <Barcode value={selectedLabel.label_code} />
            </div>
            <h6>Add Items</h6>
            <div className="mb-3">
              <select
                className="form-select mb-2"
                value={newItem.source}
                onChange={(e) =>
                  setNewItem({ ...newItem, source: e.target.value, id: "", weight: "" })
                }
              >
                <option value="items">Items</option>
                <option value="inventory">Inventory</option>
              </select>
              <select
                className="form-select mb-2"
                value={newItem.id}
                onChange={(e) => setNewItem({ ...newItem, id: e.target.value })}
              >
                <option value="">Select an Item</option>
                {newItem.source === "items"
                  ? items.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} - ${item.price}
                      </option>
                    ))
                  : inventoryItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} - ${item.price} (Weight: {item.weight} lbs)
                      </option>
                    ))}
              </select>
              {newItem.source === "items" && (
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-control mt-2"
                  placeholder="Enter weight (lbs)"
                  value={newItem.weight}
                  onChange={(e) => setNewItem({ ...newItem, weight: e.target.value })}
                />
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleAddItemToLabel(selectedLabel)}
            >
              Add to Label
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCloseModal}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )}
</div>
); }
 


export default LabelsTable;
