import axios from 'axios';

const API_BASE_URL = import.meta.env.BASE_URL;
console.log("base url:", API_BASE_URL)

const API = axios.create({
    // baseURL: 'http://localhost:8000',
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default API;


