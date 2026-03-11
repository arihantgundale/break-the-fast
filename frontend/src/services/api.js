import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('btf_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 — auto refresh or redirect to login
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('btf_refresh_token');
      if (refreshToken && !error.config._retry) {
        error.config._retry = true;
        try {
          const res = await axios.post('/api/v1/auth/token/refresh', { refreshToken });
          const { accessToken, refreshToken: newRefresh } = res.data;
          localStorage.setItem('btf_token', accessToken);
          localStorage.setItem('btf_refresh_token', newRefresh);
          error.config.headers.Authorization = `Bearer ${accessToken}`;
          return api(error.config);
        } catch {
          localStorage.removeItem('btf_token');
          localStorage.removeItem('btf_refresh_token');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
