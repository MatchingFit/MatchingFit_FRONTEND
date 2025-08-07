import axios from 'axios';
import useAuthStore from '@/store/auth';
import useUserStore from '@/store/user';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 요청 인터셉터: accessToken 자동 첨부
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터: accessToken 만료 시 refreshToken으로 재발급 시도
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshRes = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/token/refresh`,
          null,
          { withCredentials: true },
        );

        const newAccessToken = refreshRes.data.data;

        useAuthStore.getState().setAccessToken(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        const meRes = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/me`,
          {
            headers: { Authorization: `Bearer ${newAccessToken}` },
            withCredentials: true,
          },
        );
        const user = meRes.data.data;
        useUserStore.getState().setUser({
          id: user.id,
          name: user.name,
        });

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().clearAccessToken();
        useUserStore.getState().clearUser();
        window.location.href = '/login';

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
