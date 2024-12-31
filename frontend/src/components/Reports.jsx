import React, { useEffect, useState } from "react";
import axios from "axios";

const Reports = () => {
  const [reportData, setReportData] = useState({
    itemsAdded: 0,
    labelsCreated: 0,
  });

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const formattedDate = oneWeekAgo.toISOString().split("T")[0]; // Format date as YYYY-MM-DD

        // Fetch items added in the past week
        const { data: inventoryData } = await axios.get("http://localhost:5000/api/inventory");
        const itemsAdded = inventoryData.filter(
          (item) => new Date(item.import_date) >= new Date(formattedDate)
        ).length;

        // Fetch labels created in the past week
        const { data: labelsData } = await axios.get("http://localhost:5000/api/labels");
        const labelsCreated = labelsData.filter(
          (label) => new Date(label.import_date) >= new Date(formattedDate)
        ).length;

        setReportData({ itemsAdded, labelsCreated });
      } catch (error) {
        console.error("Error fetching report data:", error);
      }
    };

    fetchReportData();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="text-center">Weekly Reports</h1>

      <div className="row mt-5">
        <div className="col-md-6">
          <div className="card text-white bg-primary mb-3">
            <div className="card-header">Items Added</div>
            <div className="card-body">
              <h5 className="card-title">{reportData.itemsAdded}</h5>
              <p className="card-text">Items were added to inventory in the past week.</p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card text-white bg-success mb-3">
            <div className="card-header">Labels Created</div>
            <div className="card-body">
              <h5 className="card-title">{reportData.labelsCreated}</h5>
              <p className="card-text">Labels were created in the past week.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
