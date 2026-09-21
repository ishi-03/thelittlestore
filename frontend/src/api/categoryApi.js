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