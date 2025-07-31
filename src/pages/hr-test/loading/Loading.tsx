import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import axiosInstance from '@/lib/axiosInstance';
import useModal from '@/hooks/useModal';
import MyModal from '@/components/modal/Modal';
import styles from './Loading.module.css';

const HRTestLoading = () => {
  const [progress, setProgress] = useState(0);

  const location = useLocation();
  const { scoreResult } = location.state || {};

  const hasRunRef = useRef(false);

  const navigate = useNavigate();
  const { isModalOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    if (!scoreResult || hasRunRef.current) return;

    hasRunRef.current = true;

    const processHRTest = async () => {
      try {
        // const response = await axiosInstance.post('/api/v1/managers/match', {
        //   scores: scoreResult,
        // });
        // const result = response.data;

        navigate('/hr-test/result', {
          state: { scoreResult },
        });
      } catch (err) {
        console.error(err);
        openModal();
      }
    };

    processHRTest();
  }, [scoreResult, navigate, openModal]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1.5;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className={styles.loadingContainer}>
        <p className={styles.text}>
          결과 분석 중...
          <br /> 잠시만 기다려주세요
        </p>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <MyModal
        isOpen={isModalOpen}
        contentLabel="HR 담당자 성향 테스트 결과 분석 오류 모달"
        onConfirm={() => navigate('/hr-test/start')}
        onClose={closeModal}
      >
        결과 분석 중 오류가 발생했습니다.
      </MyModal>
    </>
  );
};

export default HRTestLoading;
