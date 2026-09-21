import axios from "axios";
import { API_URL } from "../config/api.js";

const AGE_GROUP_API = `${API_URL}/age-groups`;

export const getAgeGroups = async () => {
  const response = await axios.get(AGE_GROUP_API);
  return response.data;
};

export const createAgeGroup = async (label) => {
  const response = await axios.post(AGE_GROUP_API, { label });
  return response.data;
};

export const updateAgeGroup = async (id, data) => {
  const response = await axios.put(`${AGE_GROUP_API}/${id}`, data);
  return response.data;
};

export const deleteAgeGroup = async (id) => {
  const response = await axios.delete(`${AGE_GROUP_API}/${id}`);
  return response.data;
};