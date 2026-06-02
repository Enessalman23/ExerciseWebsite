import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT token
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Keep it simple by using localStorage directly for now
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const res = await axios.post(`${API_URL}/api/auth/refresh`, {
            token: refreshToken
          });
          
          if (res.data && res.data.token) {
            localStorage.setItem('token', res.data.token);
            if (res.data.refreshToken) {
              localStorage.setItem('refreshToken', res.data.refreshToken);
            }
            
            // Retry the original request with new token
            error.config.headers.Authorization = `Bearer ${res.data.token}`;
            return axiosClient(error.config);
          }
        }
      } catch (refreshError) {
        console.error("Refresh token failed", refreshError);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('username');
        window.location.href = '/login';
      }
      
      // If no refresh token or refresh failed
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('username');
      window.location.href = '/login';
    } else if (error.response && error.response.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('username');
      window.location.href = '/login';
    }
    // Yalnızca 400 hatası ise ve backend bize spesifik bir hata mesajı gönderdiyse custom alert verelim:
    if (error.response && error.response.status === 400 && error.response.data && error.response.data.message) {
      window.dispatchEvent(new CustomEvent('app-alert', { 
        detail: { 
          title: 'İşlem Başarısız', 
          message: error.response.data.message, 
          type: 'error' 
        } 
      }));
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;
