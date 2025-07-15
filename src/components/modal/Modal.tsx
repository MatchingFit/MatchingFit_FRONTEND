import Modal from 'react-modal';
import Button from '../button/Button';
import styles from './Modal.module.css';

type MyModalProps = {
  isOpen: boolean;
  children: React.ReactNode;
  contentLabel: string;
  onClose?: () => void;
  onConfirm?: () => void;
};

const MyModal = ({
  isOpen,
  children,
  contentLabel,
  onClose,
  onConfirm,
}: MyModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose} // ESC, 바깥 클릭 시 닫기
      contentLabel={contentLabel}
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <p>{children}</p>
      <Button
        type="button"
        variant="primary"
        size="sm"
        onClick={() => {
          if (onConfirm) {
            onConfirm();
          }
          if (onClose) {
            onClose();
          }
        }}
      >
        확인
      </Button>
    </Modal>
  );
};

export default MyModal;
