import axios from "axios";

import { API_URL } from "../config/api.js";

export const subscribeNewsletter = async (email) => {
  const response = await axios.post(`${API_URL}/newsletter`, { email });
  return response.data;
};
