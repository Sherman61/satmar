import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// const Navigate = use navigate();
const API_BASE = "http://localhost:5000/api"; // Base API URL

function LabelMaker({ refreshData }) {
  const [items, setItems] = useState([]); // List of all available items
  const [selectedItems, setSelectedItems] = useState([]); // Items selected for the label
  const [importDate, setImportDate] = useState(""); // Import date input
  const [newItem, setNewItem] = useState({ id: "", weight: "" }); // Current item being added
  const [error, setError] = useState(""); // Error messages for user feedback
 
  const navigate = useNavigate(); // Create a navigate function


  useEffect(() => {
    // Fetch available items
    axios
      .get(`${API_BASE}/items`)
      .then((response) => setItems(response.data))
      .catch((error) => console.error("Error fetching items:", error.message));
  }, []);

  const addItem = () => {
    if (!newItem.id) {
      setError("Please select an item.");
      return;
    }
    if (!newItem.weight || isNaN(newItem.weight) || parseFloat(newItem.weight) <= 0) {
      setError("Please enter a valid weight greater than 0.");
      return;
    }

    setError("");
    setSelectedItems([...selectedItems, { ...newItem }]);
    setNewItem({ id: "", weight: "" }); // Reset input fields
  };

  const removeSelectedItem = (index) => {
    const updatedItems = [...selectedItems];
    updatedItems.splice(index, 1);
    setSelectedItems(updatedItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!importDate || isNaN(new Date(importDate).getTime())) {
      setError("Please provide a valid import date.");
      return;
    }
    if (selectedItems.length === 0) {
      setError("Please select at least one item.");
      return;
    }
  
    const payload = {
      items: selectedItems.map((item) => ({
        item_id: parseInt(item.id, 10),
        weight: parseFloat(item.weight),
      })),
      import_date: importDate,
    };
  
    console.log("Payload being sent:", payload);
  
    try {
      const response = await axios.post(`${API_BASE}/label-maker`, payload);
      console.log("Response:", response.data);
      alert("Label created successfully!");
      setSelectedItems([]);
      setImportDate("");
      refreshData();
      navigate("/labels"); // Redirect to labels page after successful submission
    } catch (error) {
      console.error("Error creating label:", error.message);
      setError(
        error.response?.data?.message || "Failed to create label. Please try again."
      );
    }
  };
  
  

  return (
    <fieldset className="fs-lg">
      <div className="p-0 container">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <div className="mb-3">
            <label htmlFor="importDate" className="form-label">Import Date</label>
            <input
              type="date"
              className="form-control"
              id="importDate"
              value={importDate}
              onChange={(e) => setImportDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Add Items</label>
            <select
              className="form-select"
              value={newItem.id}
              onChange={(e) => setNewItem({ ...newItem, id: e.target.value })}
            >
              <option value="">Select Item</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} - ${item.price} ({item.category})
                </option>
              ))}
            </select>
            <input
              type="number"
              step="0.01"
              min="0"
              className="form-control mt-2"
              placeholder="Enter weight (lbs)"
              value={newItem.weight}
              onChange={(e) => setNewItem({ ...newItem, weight: parseFloat(e.target.value) })}
            />
            <button
              type="button"
              className="btn btn-secondary mt-2 fr w100"
              onClick={addItem}
            >
              Add Item
            </button>
          </div>
          <div>
            <h4>Selected Items:</h4>
            <ul className="list-group">
              {selectedItems.map((item, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  {items.find((i) => i.id === parseInt(item.id, 10))?.name || "Unknown"}
                  - {item.weight && !isNaN(item.weight) ? parseFloat(item.weight).toFixed(2) : "N/A"} lbs
                  <button
                    type="button"
                    className="btn btn-danger btn-sm fr"
                    onClick={() => removeSelectedItem(index)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <button type="submit" className="w100 btn btn-primary mt-3 fr">Create Label</button>
        </form>
      </div>
    </fieldset>
  ); 
}

export default LabelMaker;
