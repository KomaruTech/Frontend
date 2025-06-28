import axios from 'axios';
import {configDotenv} from "dotenv";
configDotenv()

const api = axios.create({
    baseURL: process.env.LOCAL_HOST,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`; // Исправлен шаблонный литерал
    }
    return config;
});

export default api;