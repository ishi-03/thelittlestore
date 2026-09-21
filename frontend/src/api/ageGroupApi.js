import axios from "axios";

const API_URL = "http://localhost:5000/api/age-groups";

export const getAgeGroups = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createAgeGroup = async (label) => {
  const response = await axios.post(API_URL, { label });
  return response.data;
};

export const updateAgeGroup = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

export const deleteAgeGroup = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};