import React from "react";

function InventoryRow({ item, onEdit, onDelete }) {
  // console.log("Item data:", item); // Debugging item data
  // console.log("Type of weight:", typeof item.weight); // Check type

  return (
    <tr>
      <td>{item.id}</td>
      <td>{item.name}</td>
      <td>{item.category}</td>
      <td>{item.weight ? Number(item.weight).toFixed(2) : "N/A"}</td>
      <td>{item.price ? `$${Number(item.price).toFixed(2)}` : "N/A"}</td>
      <td>{item.import_date}</td>
      <td>
        <button onClick={() => onEdit(item.id)}>Edit</button>
        <button onClick={() => onDelete(item.id)}>Delete</button>
      </td>
    </tr>
  );
}

export default InventoryRow;
