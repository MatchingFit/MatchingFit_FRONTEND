import { useLocation } from 'react-router-dom';
import Button from '@/components/button/Button';

const Report = () => {
  const location = useLocation();
  const { job_field, score_result } = location.state || {};

  return (
    <div>
      <h2>이력서 분석 결과</h2>
      <p>{job_field}</p>
      <p>{score_result}</p>
      <Button type="button" variant="primary" size="lg" onClick={() => {}}>
        결과 보고서 다운로드
      </Button>
    </div>
  );
};

export default Report;
