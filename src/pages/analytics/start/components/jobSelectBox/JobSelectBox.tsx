import styles from './JobSelectBox.module.css';

const JOB_LIST = [
  '프론트엔드',
  '백엔드',
  '모바일 개발',
  '디자인',
  '클라우드',
  '데이터 분석',
  '블록체인',
  '게임 개발',
  '마케팅',
] as const;

type JobSelectBoxProps = {
  onJobChange: (job: string) => void;
};

const JobSelectBox = ({ onJobChange }: JobSelectBoxProps) => {
  return (
    <ul className={styles.jobList}>
      {JOB_LIST.map((job) => (
        <li key={job}>
          <label className={styles.jobLabel}>
            <input
              className={styles.radioBtn}
              type="radio"
              name="jobList"
              value={job}
              onChange={(e) => onJobChange(e.target.value)}
            />
            {job}
          </label>
        </li>
      ))}
    </ul>
  );
};

export default JobSelectBox;
