import axios from "axios";

import { API_URL } from "../config/api.js";

const UPLOAD_API = `${API_URL}/upload`;

// files = FileList or array of File
export const uploadImages = async (files, onProgress) => {
  const formData = new FormData();

  Array.from(files).forEach((file) => {
    formData.append("images", file);
  });

  const response = await axios.post(UPLOAD_API, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (event) => {
      if (onProgress && event.total) {
        onProgress(Math.round((event.loaded * 100) / event.total));
      }
    },
  });

  // { urls: [...] }
  return response.data.urls || [];
};

export const deleteImage = async (publicId) => {
  const response = await axios.delete(`${UPLOAD_API}/${encodeURIComponent(publicId)}`);
  return response.data;
};