import axios from "axios";

const API_URL = 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, 
});

// Interceptor để tự động refresh token nếu hết hạn
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post(`${API_URL}/auth/renew-access-token`, {}, { withCredentials: true });
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
