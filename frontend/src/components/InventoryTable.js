import React from "react";
import InventoryRow from "./InventoryRow";

function InventoryTable({ inventory = [], onEdit, onDelete }) {
    return (
        <div>
             <h1>Inventory Management</h1>
              
             <br />

<br />
            <h2>Inventory</h2>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th className="w10p">Inventory ID</th>
                        <th>Item Name</th>
                        <th>Category</th>
                        <th>Weight (lbs)</th>
                        <th>Price ($)</th>
                        <th>Import Date</th>
                        <th className="w10p">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {inventory.length > 0 ? (
                        inventory.map((item) => (
                            <InventoryRow
                                key={item.id} // Ensure each row has a unique key
                                item={item}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center">
                                No inventory items available.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
} 

export default InventoryTable;
