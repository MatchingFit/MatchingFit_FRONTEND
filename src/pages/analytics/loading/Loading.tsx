import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosFormInstance from '@/lib/axiosFormInstance';
import useUserStore from '@/store/user';
import useModal from '@/hooks/useModal';
import MyModal from '@/components/modal/Modal';
import styles from './Loading.module.css';

const Loading = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  const user = useUserStore((state) => state.user);
  const userId = user?.id;
  const userName = user?.name;

  const { isModalOpen, openModal, closeModal } = useModal();

  const location = useLocation();
  const { file, selectedJob } = location.state || {};

  const hasRunRef = useRef(false);

  useEffect(() => {
    if (!file || !selectedJob || !userId || hasRunRef.current) return;

    hasRunRef.current = true;

    const processResume = async () => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('job_field', selectedJob);
        formData.append('user_id', String(userId));

        const response = await axiosFormInstance.post(
          '/resume/process',
          formData,
        );

        const result = response.data;

        navigate('/analytics/report', {
          state: {
            job_field: result.job_field,
            score_result: result.score_result,
          },
        });
      } catch (err) {
        console.error(err);
        openModal();
      }
    };

    processResume();
  }, [file, selectedJob, userId, navigate, openModal]);

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
        <p
          className={styles.text}
        >{`${userName} 님의 이력서를 분석하고 있어요`}</p>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <MyModal
        isOpen={isModalOpen}
        contentLabel="이력서 분석 오류 모달"
        onConfirm={() => navigate('/analytics/start')}
        onClose={closeModal}
      >
        이력서 분석 중 오류가 발생했습니다.
      </MyModal>
    </>
  );
};

export default Loading;
