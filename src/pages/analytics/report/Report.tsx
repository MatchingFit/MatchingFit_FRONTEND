import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Button from '@/components/button/Button';
import styles from './Report.module.css';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  ResponsiveContainer,
} from 'recharts';

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

  const average = 80;
  const data = [
    { subject: '의사소통', score: 120, average },
    { subject: '기술 전문성', score: 98, average },
    { subject: '책임감', score: 99, average },
    { subject: '문제 해결력', score: 86, average },
    { subject: '창의성', score: 85, average },
    { subject: '리더십', score: 65, average },
    { subject: '성장 가능성', score: 65, average },
  ];

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
          <div className={styles.chart}>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart cx="50%" cy="55%" outerRadius="60%" data={data}>
                <PolarGrid stroke="#d8d8d8" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontSize: 14, fill: '#757575' }}
                />
                <PolarRadiusAxis style={{ fontSize: 10 }} />
                <Radar
                  name="내 역량의 평균"
                  dataKey="average"
                  stroke="#757575"
                  strokeDasharray={4}
                  fillOpacity={0}
                  dot={{
                    fill: '#fff',
                    fillOpacity: 1,
                    stroke: '#757575',
                    strokeDasharray: 0,
                    r: 2,
                  }}
                  activeDot={false}
                />
                <Radar
                  name="값"
                  dataKey="score"
                  stroke="#5f812e"
                  fill="#5f812e"
                  fillOpacity={0.4}
                  dot={{
                    r: 2,
                    fill: '#5f812e',
                    stroke: '#5f812e',
                    strokeWidth: 1,
                  }}
                  activeDot={false}
                />
                <Legend wrapperStyle={{ fontSize: 14 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <Button type="button" variant="primary" size="lg" onClick={downloadPDF}>
        결과 보고서 다운로드
      </Button>
    </main>
  );
};

export default Report;
