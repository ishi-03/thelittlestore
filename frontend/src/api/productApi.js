import axios from "axios";

import { API_URL } from "../config/api.js";

const PRODUCT_API = `${API_URL}/products`;

// placement (optional): "global" | "women-wear" | "twinning"
export const getProducts = async (placement) => {
  const response = await axios.get(PRODUCT_API, {
    params: placement ? { placement } : undefined,
  });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await axios.get(`${PRODUCT_API}/${id}`);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await axios.post(PRODUCT_API, productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await axios.put(`${PRODUCT_API}/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axios.delete(`${PRODUCT_API}/${id}`);
  return response.data;
};