import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useModal from '@/hooks/useModal';
import useAuthStore from '@/store/auth';
import Button from '@/components/button/Button';
import MyModal from '@/components/modal/Modal';
import styles from './Start.module.css';
// import useUserStore from '@/store/user';

const MODAL_MESSAGES = {
  NOT_LOGGED_IN: '기업 로그인 후 이용 가능합니다.',
} as const;

const HRTestStart = () => {
  const navigate = useNavigate();
  const [modalMessage, setModalMessage] = useState('');

  const { isModalOpen, openModal, closeModal } = useModal();

  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoggedIn = !!accessToken;
  // const user = useUserStore((state) => state.user);
  // const isBusiness = user?.role === 'COMPANY';

  const showModal = (message: string) => {
    setModalMessage(message);
    openModal();
  };

  const isFormValid = () => {
    // if (!isLoggedIn || !isBusiness) {
    if (!isLoggedIn) {
      showModal(MODAL_MESSAGES.NOT_LOGGED_IN);
      return false;
    }
    return true;
  };

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) return;

    navigate('/hr-test/quiz');
  };

  return (
    <>
      <main className={styles.startContainer}>
        <h2 className={styles.title}>HR 담당자 성향 테스트</h2>
        <p className={styles.text}>
          조직에 필요한 핵심 역량, 나의 채용 기준은 무엇일까요?
          <br /> 나의 HR 업무 성향을 진단하고, 우리 조직에 꼭 맞는 인재를
          찾아보세요!
        </p>
        <Button type="button" variant="primary" size="lg" onClick={handleStart}>
          테스트 시작하기
        </Button>
      </main>

      <MyModal
        isOpen={isModalOpen}
        contentLabel="HR 담당자 성향 테스트 안내 모달"
        onClose={closeModal}
      >
        {modalMessage}
      </MyModal>
    </>
  );
};

export default HRTestStart;
