import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000/api', // Backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken'); // Use specific token key for admin if needed, or just 'token'
    // Let's use 'token' to align with AuthContext logic if I copy it. 
    // But better to use 'adminToken' to avoid conflict if testing both on same browser (localhost).
    // Actually, I'll use 'token' but I must ensure I don't mix them up if I run both.
    // For safety in this environment, I'll use 'token' as standard.
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
});
 
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            message: error.message,
            data: error.response?.data
        });
        return Promise.reject(error);
    }
);

export default api;
