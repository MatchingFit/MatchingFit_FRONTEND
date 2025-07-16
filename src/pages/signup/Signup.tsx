import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useModal from '@/hooks/useModal';
import axiosInstance from '@/lib/axiosInstance';
import {
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
} from '@/utils/validators';
import formatTime from '@/utils/formatTime';
import Icon from '@/components/icon/Icon';
import AuthInput from '../../components/authInput/AuthInput';
import Button from '../../components/button/Button';
import MyModal from '@/components/modal/Modal';
import styles from './Signup.module.css';

const AUTH_TIMEOUT = 180;

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [nameErrors, setNameErrors] = useState<string[]>([]);
  const [emailErrors, setEmailErrors] = useState<string[]>([]);
  const [authCodeErrors, setAuthCodeErrors] = useState<string[]>([]);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [confirmPasswordErrors, setConfirmPasswordErrors] = useState<string[]>(
    [],
  );

  const isEmailValid = email.length > 0 && emailErrors.length === 0;
  const [isRequested, setIsRequested] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const isFormValid = useMemo(() => {
    return (
      name.length > 0 &&
      email.length > 0 &&
      password.length > 0 &&
      confirmPassword.length > 0 &&
      isEmailVerified &&
      nameErrors.length === 0 &&
      emailErrors.length === 0 &&
      passwordErrors.length === 0 &&
      confirmPasswordErrors.length === 0
    );
  }, [
    name,
    email,
    password,
    confirmPassword,
    nameErrors,
    emailErrors,
    passwordErrors,
    confirmPasswordErrors,
    isEmailVerified,
  ]);

  const navigate = useNavigate();
  const { isModalOpen, openModal } = useModal();

  useEffect(() => {
    setNameErrors(validateName(name));
  }, [name]);

  useEffect(() => {
    const errors = validateEmail(email);
    setEmailErrors(errors);

    if (errors.length === 0) {
      const delayDebounce = setTimeout(() => {
        checkEmailDuplicate(email);
      }, 200); // 200ms 디바운스
      return () => clearTimeout(delayDebounce);
    }
  }, [email]);

  useEffect(() => {
    setPasswordErrors(validatePassword(password));
  }, [password]);

  useEffect(() => {
    setConfirmPasswordErrors(
      validateConfirmPassword(confirmPassword, password),
    );
  }, [password, confirmPassword]);

  // 인증코드 타이머 설정
  useEffect(() => {
    if (isRequested && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isRequested, timeLeft]);

  const checkEmailDuplicate = async (email: string) => {
    try {
      const response = await axiosInstance.get('/api/v1/users/check-email', {
        params: { email },
      });

      const { success, duplicated, message } = response.data;

      if (success) {
        if (duplicated) {
          setEmailErrors(['이미 가입된 이메일입니다.']);
        } else {
          setEmailErrors([]);
        }
      } else {
        throw new Error(message || '이메일 중복 확인 실패');
      }
    } catch (error) {
      if (error instanceof Error) console.log(error);
    }
  };

  const requestAuthCode = async () => {
    setIsSendingEmail(true);

    try {
      const response = await axiosInstance.post('/api/v1/email/join/send', {
        email,
      });

      const { message, success } = response.data;

      if (success) {
        setIsRequested(true);
        setTimeLeft(AUTH_TIMEOUT);
        setAuthCode('');
        setAuthCodeErrors([]);
      } else {
        throw new Error(message || '인증요청 실패');
      }
    } catch (error) {
      if (error instanceof Error) console.log(error);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const verifyAuthCode = async () => {
    try {
      const response = await axiosInstance.post('/api/v1/email/verify', {
        email,
        code: authCode,
      });

      const { message, success } = response.data;

      if (success) {
        setIsEmailVerified(true);
        setAuthCodeErrors([]);
      } else {
        throw new Error(message || '인증코드 불일치');
      }
    } catch (error) {
      setAuthCodeErrors(['인증코드를 다시 확인해주세요.']);
      if (error instanceof Error) console.log(error);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post(
        '/api/v1/users/join',
        { name, email, password, passwordConfirm: confirmPassword },
        { withCredentials: true },
      );

      const { message, success } = response.data;

      if (success) {
        openModal();
      } else {
        throw new Error(message || '회원가입 실패');
      }
    } catch (error) {
      if (error instanceof Error) console.log(error);
    }
  };

  return (
    <>
      <Link to="/login" className={styles.loginBtn}>
        <Icon id="arrow-back" width={20} height={20} color="#000" />
        로그인하러 가기
      </Link>
      <div className={styles.signupContainer}>
        <h2 className={styles.signupTitle}>회원가입</h2>
        <form className={styles.signupForm} onSubmit={handleSignup} noValidate>
          <AuthInput
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력해주세요"
            label="이름"
            errors={nameErrors}
          />
          <div className={styles.emailContainer}>
            <div className={styles.email}>
              <AuthInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력해주세요"
                label="이메일"
                errors={emailErrors}
              />
              <button
                type="button"
                className={styles.requestBtn}
                onClick={requestAuthCode}
                disabled={!isEmailValid || timeLeft !== 0 || isSendingEmail}
              >
                {isRequested ? '재전송' : '인증요청'}
              </button>
            </div>
            {isSendingEmail && (
              <p className={styles.sending}>이메일 전송 중...</p>
            )}
            {isRequested && !isSendingEmail && (
              <div className={styles.authcode}>
                <AuthInput
                  type="text"
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  placeholder="인증코드 6자리를 입력해주세요"
                  errors={authCodeErrors}
                  maxLength={6}
                />
                <div className={styles.authcodeActions}>
                  {!isEmailVerified && <time>{formatTime(timeLeft)}</time>}
                  <button
                    type="button"
                    onClick={verifyAuthCode}
                    disabled={timeLeft <= 0 || isEmailVerified}
                  >
                    확인
                  </button>
                </div>
              </div>
            )}
            {isEmailVerified && (
              <p className={styles.sending}>
                이메일 인증이 성공적으로 완료됐어요.
              </p>
            )}
          </div>
          <div className={styles.passwordContainer}>
            <AuthInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력해주세요"
              label="비밀번호"
              description="영문/숫자/특수문자 중 2가지 이상의 종류를 조합하여 10자 이상의 비밀번호를 입력해주세요."
              errors={passwordErrors}
            />
            <AuthInput
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호를 한 번 더 입력해주세요"
              errors={confirmPasswordErrors}
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!isFormValid}
          >
            가입하기
          </Button>
        </form>
      </div>
      <MyModal
        isOpen={isModalOpen}
        contentLabel="회원가입 완료 모달"
        onConfirm={() => navigate('/login')}
      >
        회원가입이 완료되었습니다.
        <br />
        로그인 후 서비스를 시작해보세요.
      </MyModal>
    </>
  );
};

export default Signup;
