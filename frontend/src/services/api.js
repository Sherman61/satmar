import axios from "axios";

// Backend API Base URL
const API_BASE = "http://localhost:5000/api";

// Fetch inventory
export const fetchInventory = async () => {
  try {
    const response = await axios.get(`${API_BASE}/inventory`);
    return response.data;
  } catch (error) {
    console.error("Error fetching inventory:", error.message);
    console.error("Error details:", error.response?.data || error.config);
    throw error;
  }
};

// Create a label
export const createLabel = async (labelPayload) => {
  try {
    const response = await axios.post(`${API_BASE}/label-maker`, labelPayload);
    return response.data;
  } catch (error) {
    console.error("Error creating label:", error.message);
    console.error("Error details:", error.response?.data || error.config);
    throw error;
  }
};

// Fetch labels
export const fetchLabels = async () => {
  try {
    const response = await axios.get(`${API_BASE}/labels`);
    return response.data;
  } catch (error) {
    console.error("Error fetching labels:", error.message);
    console.error("Error details:", error.response?.data || error.config);
    throw error;
  }
};

// Fetch all items
export const fetchItems = async () => {
  try {
    const response = await axios.get(`${API_BASE}/items`);
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error.message);
    throw error;
  }
};
