import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');

    if (token && config.headers) {
      // console.log("Token found:", token ? "yes" : "no");
      // console.log("Adding Authorization header for:", config.url);
      if (config.url?.includes('/secure/')) {
        // console.log("SECURE ENDPOINT REQUEST - Token length:", token.length);
      }
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // console.warn("No token found for request:", config.url);
      if (config.url?.includes('/secure/')) {
        // console.error("SECURE ENDPOINT REQUEST MISSING TOKEN!");
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (refreshToken) {
        try {
          const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
            refreshToken: refreshToken
          });
          
          const newToken = response.data.accessToken;
          localStorage.setItem('jwt_token', newToken);
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('jwt_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        localStorage.removeItem('jwt_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
