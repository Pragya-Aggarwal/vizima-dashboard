import axios from 'axios';

const api = axios.create({
    //   baseURL: process.env.NEXT_PUBLIC_APP_BASE_URL,
    // baseURL: "https://vizima-backend.onrender.com",
    baseURL: "https://api.vizima.in",
    headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
    },

});// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            sessionStorage.removeItem('accessToken');
            window.location.href = '/';}
        return Promise.reject(error);
    }
);

export default api;