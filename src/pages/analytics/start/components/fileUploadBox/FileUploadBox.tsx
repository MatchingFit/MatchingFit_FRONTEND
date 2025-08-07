import { useRef, useState } from 'react';
import styles from './FileUploadBox.module.css';

type FileUploadBoxProps = {
  onFileChange: (file: File | null) => void;
};

const FileUploadBox = ({ onFileChange }: FileUploadBoxProps) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileExtension, setFileExtension] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const extractNameAndExtension = (file: File) => {
    const match = file.name.match(/^(.*)\.(pdf|docx)$/i);
    if (match) {
      setFileName(match[1]);
      setFileExtension(`.${match[2].toLowerCase()}`);
    } else {
      setFileName(file.name);
      setFileExtension(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    // 사용자가 업로드 취소한 경우 - 기존 파일 유지
    if (!file) return;

    if (file) {
      extractNameAndExtension(file);
      onFileChange(file);
    } else {
      setFileName(null);
      setFileExtension(null);
      onFileChange(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();

    const file = e.dataTransfer.files?.[0];

    if (file) {
      extractNameAndExtension(file);

      if (inputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        inputRef.current.files = dataTransfer.files;
      }

      onFileChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  return (
    <div>
      <input
        type="file"
        className={styles.hiddenInput}
        id="file-upload"
        ref={inputRef}
        accept=".pdf, .docx"
        onChange={handleFileChange}
      />
      <label
        htmlFor="file-upload"
        className={styles.fileUploadBox}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        role="button"
      >
        📎
        {fileName ? (
          <div className={styles.fileNameContainer}>
            <span className={styles.fileName}>{fileName}</span>
            <span>{fileExtension}</span>
          </div>
        ) : (
          <span>파일 첨부 (최대 50MB)</span>
        )}
      </label>
    </div>
  );
};

export default FileUploadBox;
