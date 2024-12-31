import React, { useState } from 'react';
import axios from 'axios';

function AddItem({ refreshData }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [weight, setWeight] = useState('');

  const validateInput = () => {
    if (!name || !category || isNaN(price) || isNaN(weight)) {
      alert('Please provide valid inputs for all fields.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInput()) return;

    try {
      await axios.post('http://localhost:5000/api/inventory', {
        name,
        category,
        price: parseFloat(price),
        weight_lbs: parseFloat(weight),
      });
      alert('Item added successfully!');
      setName('');
      setCategory('');
      setPrice('');
      setWeight('');
      refreshData();
    } catch (err) {
      console.error('Error adding item:', err);
      alert('Failed to add item.');
    }
  };

  return (
    <div className="container my-4">
      <h2>Add Inventory Item</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">Category</label>
          <input
            type="text"
            className="form-control"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="weight" className="form-label">Weight (lbs)</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Item</button>
      </form>
    </div>
  );
}

export default AddItem;
