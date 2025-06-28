import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5124/api/v1/',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`; // Исправлен шаблонный литерал
    }
    return config;
});

export default api;