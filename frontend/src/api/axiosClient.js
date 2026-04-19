import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080', // Spring Boot default port
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
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Token is invalid or expired
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.href = '/login'; 
    }
    
    // Yalnızca 400 hatası ise ve backend bize spesifik bir hata mesajı gönderdiyse alert verelim:
    if (error.response && error.response.status === 400 && error.response.data && error.response.data.message) {
      // Alert ile backend'deki net hatayı kullanıcıya gösteriyoruz ("Metrics not found" gibi)
      alert("Hata: " + error.response.data.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;
