import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useModal from '@/hooks/useModal';
import useAuthStore from '@/store/auth';
import useUserStore from '@/store/user';
import JobSelectBox from './components/jobSelectBox/JobSelectBox';
import FileUploadBox from './components/fileUploadBox/FileUploadBox';
import Button from '@/components/button/Button';
import MyModal from '@/components/modal/Modal';
import styles from './Start.module.css';

const MODAL_MESSAGES = {
  NOT_LOGGED_IN: '로그인 후 이용 가능합니다.',
  NO_JOB: '직무를 선택해주세요.',
  NO_FILE: '파일을 첨부해주세요.',
} as const;

const Start = () => {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [modalMessage, setModalMessage] = useState('');

  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoggedIn = !!accessToken;
  const user = useUserStore((state) => state.user);

  const navigate = useNavigate();
  const { isModalOpen, openModal, closeModal } = useModal();

  const showModal = (message: string) => {
    setModalMessage(message);
    openModal();
  };

  const isFormValid = () => {
    if (!isLoggedIn) {
      showModal(MODAL_MESSAGES.NOT_LOGGED_IN);
      return false;
    }
    if (!selectedJob) {
      showModal(MODAL_MESSAGES.NO_JOB);
      return false;
    }
    if (!file) {
      showModal(MODAL_MESSAGES.NO_FILE);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) return;

    navigate('/analytics/loading', {
      state: {
        file,
        selectedJob,
        userId: user?.id,
        userName: user?.name,
      },
    });
  };

  return (
    <>
      <main className={styles.startContainer}>
        <form onSubmit={handleSubmit}>
          <fieldset className={styles.jobSelectContainer}>
            <legend className={styles.startTitle}>
              분석을 원하는 직무를 선택하세요.
            </legend>
            <p className={styles.attentionNote}>
              * 직무명은 실제 기업의 부서명과는 다를 수 있습니다.
            </p>
            <JobSelectBox onJobChange={setSelectedJob} />
          </fieldset>
          <fieldset className={styles.fileUploadContainer}>
            <legend className={styles.startTitle}>
              주의사항에 유의하여 이력서를 첨부하세요.
            </legend>
            <ul className={styles.attentionNoteList}>
              <li>
                <p className={styles.attentionNote}>
                  ⓘ 이력서 파일은 PDF, DOCX 형식으로 업로드해 주세요.
                </p>
              </li>
              <li>
                <p className={styles.attentionNote}>
                  ⓘ 오류가 있을 때는 파일 용량이 50MB가 넘었는지 확인해주세요.
                </p>
              </li>
            </ul>
            <FileUploadBox onFileChange={setFile} />
          </fieldset>
          <Button type="submit" variant="primary" size="lg">
            분석하기
          </Button>
        </form>
      </main>

      <MyModal
        isOpen={isModalOpen}
        contentLabel="이력서 분석 안내 모달"
        onClose={closeModal}
      >
        {modalMessage}
      </MyModal>
    </>
  );
};

export default Start;
