import axios from "axios";
import { API_URL } from "../config/api.js";

const ORDER_API = `${API_URL}/orders`;

// public: customer order lookup (order number + phone)
export const trackOrder = async (orderNumber, phone) => {
  const { data } = await axios.post(`${ORDER_API}/track`, { orderNumber, phone });
  return data;
};

// admin
export const getDashboardStats = async () => {
  const { data } = await axios.get(`${API_URL}/admin/stats`);
  return data;
};

export const getOrders = async (params = {}) => {
  const { data } = await axios.get(ORDER_API, { params });
  return data;
};

export const getOrderById = async (id) => {
  const { data } = await axios.get(`${ORDER_API}/${id}`);
  return data;
};

export const updateOrderStatus = async (id, orderStatus) => {
  const { data } = await axios.put(`${ORDER_API}/${id}/status`, { orderStatus });
  return data;
};
