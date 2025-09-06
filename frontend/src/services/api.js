import axios from 'axios';

// 設置一個函式來取得儲存在 localStorage 的 token
const getToken = () => localStorage.getItem('token');

// 創建一個 axios 實例，以便我們可以統一設置 header
const api = axios.create({
    baseURL: '/api' // 因為設定了 proxy，所以直接用 /api
});

// 使用攔截器 (interceptor) 在每個請求中自動附加 token
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            console.log("Unauthorized request. Redirecting to login.");
            
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            if (window.location.pathname !== '/login') {
                window.location.href = '/login'; 
            }
        }
        
        return Promise.reject(error);
    }
);

// Auth
export const login = (userData) => api.post('/users/login', userData);
export const register = (userData) => api.post('/users/register', userData);
export const getUserProfile = () => api.get('/users/me');
export const updateUserProfile = (userData) => api.put('/users/me/update', userData);
export const uploadAvatar = (formData) => api.post('/users/me/avatar', formData, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});

// Flights
export const searchFlights = (params) => api.get('/flights/search-flights', { params });
// export const getAirports = () => api.get('/flights/airports');
// Bookings
export const createBooking = (bookingData) => api.post('/bookings', bookingData);
export const getMyBookings = () => api.get('/bookings');
export const cancelBooking = (bookingId) => api.patch(`/bookings/${bookingId}/cancel`);

export const getBookingDetails = () => api.get(`/bookings/details`);
export const getBookingSummary = () => api.get(`/bookings/summary`);
export default api;