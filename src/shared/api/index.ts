// src/shared/api/index.ts
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_LOCAL_HOST
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
export default api;