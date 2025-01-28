import axios from "axios";
import { API_URL } from "./config.ts";

const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("Expired or Invalid Token");

      window.location.href = "/session-expired";
    if (error.response?.status === 400) {
        alert("There was an issue with your request. Please check the input or try again.");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
