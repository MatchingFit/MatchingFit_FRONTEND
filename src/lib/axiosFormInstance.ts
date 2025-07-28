import axios from 'axios';
import useAuthStore from '@/store/auth';
import useUserStore from '@/store/user';

const axiosFormInstance = axios.create({
  baseURL: import.meta.env.VITE_PYTHON_BASE_URL,
  withCredentials: true,
});

axiosFormInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosFormInstance.interceptors.response.use(
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
          role: user.role,
        });

        return axiosFormInstance(originalRequest);
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

export default axiosFormInstance;
