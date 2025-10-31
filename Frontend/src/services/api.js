import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // baseURL tells axios where your backend server is running.
});
console.log(import.meta.env.VITE_API_URL);

export default api;
