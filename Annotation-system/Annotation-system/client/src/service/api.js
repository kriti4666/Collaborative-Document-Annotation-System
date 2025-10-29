import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

console.log("Backend API URL →", API_BASE_URL);

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
