import { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '@/lib/axiosInstance';
import useAuthStore from '@/store/auth';
import useUserStore from '@/store/user';

const useAuthInit = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const clearAccessToken = useAuthStore((state) => state.clearAccessToken);
  const setUser = useUserStore.getState().setUser;
  const clearUser = useUserStore.getState().clearUser;
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      // 이미 accessToken 있으면 재요청 안 함
      if (accessToken) {
        setIsAuthChecked(true);
        return;
      }

      try {
        // accessToken이 없을 경우 refresh 시도
        const refreshRes = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/token/refresh`,
          null,
          { withCredentials: true },
        );

        const accessToken = refreshRes.data.data;
        setAccessToken(accessToken);

        // 유저 정보 요청
        const meRes = await axiosInstance.get('/api/v1/users/me');
        const user = meRes.data.data;
        setUser({ id: user.id, name: user.name, role: user.role });
        console.log('로그인 유지 성공, 유저 정보:', user);
      } catch (err) {
        console.warn('로그인 유지 실패, 로그아웃 처리됨', err);
        clearAccessToken();
        clearUser();
      } finally {
        setIsAuthChecked(true);
      }
    };

    initializeAuth();
  }, [accessToken, setAccessToken, clearAccessToken, setUser, clearUser]);

  return { isAuthChecked };
};

export default useAuthInit;
