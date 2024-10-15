import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  },
  params: {
    api_key: import.meta.env.VITE_API_KEY,
  },
});

export default apiClient;