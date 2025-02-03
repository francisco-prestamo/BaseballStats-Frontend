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
    }
    if (error.response?.status === 400) {
        const errorData = error.response?.data?.errors;
        if (errorData) {
            // Loop through each error type in the dictionary
            for (const [errorType, errorList] of Object.entries(errorData)) {
                errorList.forEach((errMsg) => {
                    alert(`Error in ${errorType}: ${errMsg}`);
                });
            }
        } else {
            const errorMessage = error.response?.data?.message || "There was an issue with your request. Please check the input or try again.";
            alert(errorMessage);
        }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
