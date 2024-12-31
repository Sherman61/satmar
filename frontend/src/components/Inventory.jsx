import React from 'react';

function Inventory({ inventory = [], labels = [] }) {
  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Satmar Inventory</h1>

      <h2>Inventory</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Weight (lbs)</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>${item.price?.toFixed(2)}</td>
              <td>{item.weight}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Labels</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Label ID</th>
            <th>Label Code</th>
            <th>Item IDs</th>
          </tr>
        </thead>
        <tbody>
          {labels.map((label) => (
            <tr key={label.label_id}>
              <td>{label.label_id}</td>
              <td>{label.label_code}</td>
              <td>{label.item_ids?.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Inventory;
