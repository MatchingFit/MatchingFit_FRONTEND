import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '@/lib/axiosInstance';
import useModal from '@/hooks/useModal';
import AuthInput from '../../components/authInput/AuthInput';
import Button from '../../components/button/Button';
import Icon from '../../components/icon/Icon';
import MyModal from '@/components/modal/Modal';
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const { isModalOpen, openModal, closeModal } = useModal();

  const kakaoAuthRequestUrl = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/kakao`;
  const socialLoginRedirectUri = `${import.meta.env.VITE_FRONTEND_BASE_URL}/anaytics/start`;

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post(
        '/api/v1/users/login',
        {
          email,
          password,
        },
        { withCredentials: true },
      );

      const { message, success } = response.data;

      if (success) {
        navigate('/anaytics/start');
      } else {
        throw new Error(message || '로그인 실패');
      }
    } catch (error) {
      if (error instanceof Error) {
        openModal();
        console.log(error);
      }
    }
  };

  return (
    <>
      <div className={styles.loginContainer}>
        <h2 className={styles.loginTitle}>로그인</h2>
        <a
          href={`${kakaoAuthRequestUrl}?redirectUrl=${socialLoginRedirectUri}`}
          className={styles.kakaoBtn}
        >
          <Icon id="kakao-icon" color="#000" />
          카카오톡으로 1초만에 시작하기
        </a>
        <span className={styles.or}>또는</span>
        <form className={styles.loginForm} onSubmit={handleLogin} noValidate>
          <AuthInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일"
          />
          <AuthInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
          />
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!email || !password}
          >
            로그인
          </Button>
        </form>
        <Link to="/signup" className={styles.signupBtn}>
          회원가입
        </Link>
      </div>
      <MyModal
        isOpen={isModalOpen}
        contentLabel="로그인 실패 모달"
        onClose={closeModal}
      >
        이메일, 비밀번호를 다시 확인해주세요.
      </MyModal>
    </>
  );
};

export default Login;
