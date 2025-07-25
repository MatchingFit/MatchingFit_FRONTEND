import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Button from '@/components/button/Button';
import styles from './Report.module.css';

const downloadPDF = async () => {
  const element = document.getElementById('pdf-section'); // 캡처할 영역
  if (!element) return;

  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgWidth = 210; // A4 기준 mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  pdf.save('download.pdf');
};

const Report = () => {
  const location = useLocation();
  const { job_field, score_result } = location.state || {};

  return (
    <main className={styles.reportContainer}>
      <div id="pdf-section" className={styles.report}>
        <h2>이력서 분석 결과</h2>
        <div>
          <h3>직무</h3>
          <p>{job_field}</p>
        </div>
        <div>
          <h3>역량</h3>
          <p>{score_result}</p>
        </div>
      </div>
      <Button type="button" variant="primary" size="lg" onClick={downloadPDF}>
        결과 보고서 다운로드
      </Button>
    </main>
  );
};

export default Report;
