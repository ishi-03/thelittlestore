import axios from "axios";
import { API_URL } from "../config/api.js";
// Get all categories
export const getCategories = async () => {
  const response = await axios.get(`${API_URL}/categories`);
  return response.data;
};
// Create category
export const createCategory = async (name) => {
  const response = await axios.post(`${API_URL}/categories`, {
    name,
  });
  return response.data;
};
// Delete category
export const deleteCategory = async (id) => {
  const response = await axios.delete(
    `${API_URL}/categories/${id}`
  );

  return response.data;
};

// Admin: all categories including inactive
export const getAllCategories = async () => {
  const response = await axios.get(`${API_URL}/categories/admin/all`);
  return response.data;
};

// Update category (rename and/or isActive)
export const updateCategory = async (id, data) => {
  const response = await axios.put(`${API_URL}/categories/${id}`, data);
  return response.data;
};
