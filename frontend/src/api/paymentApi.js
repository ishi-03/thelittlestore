import axios from "axios";
import { API_URL } from "../config/api.js";

const PAYMENT_API = `${API_URL}/payment`;

export const getShippingQuote = async (items, address) => {
  const { data } = await axios.post(`${PAYMENT_API}/shipping-quote`, { items, address });
  return data;
};

export const createPaymentOrder = async (payload) => {
  const { data } = await axios.post(`${PAYMENT_API}/create-order`, payload);
  return data;
};

export const verifyPayment = async (payload) => {
  const { data } = await axios.post(`${PAYMENT_API}/verify`, payload);
  return data;
};

export const reportPaymentFailure = async (razorpayOrderId, reason) => {
  try {
    await axios.post(`${PAYMENT_API}/failed`, { razorpayOrderId, reason });
  } catch {
    /* best effort */
  }
};
