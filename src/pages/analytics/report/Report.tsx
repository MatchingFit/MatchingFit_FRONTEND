import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import useUserStore from '@/store/user';
import downloadPDF from '@/utils/downloadPDF';
import Button from '@/components/button/Button';
import styles from './Report.module.css';

type ScoreResultItem = {
  competencyName: string;
  totalScore: number;
};

type ParsedSections = Record<string, string>;

const resultTitles = [
  '1. 핵심 강점',
  '2. 보완할 점 또는 약점',
  '3. 기술 스택 요약',
  '4. 추천 직무 또는 포지션',
];

const subjects = [
  '의사소통',
  '기술 전문성',
  '책임감',
  '문제 해결력',
  '창의성',
  '리더십',
  '성장 가능성',
];

// ✅ 텍스트 파싱 유틸
const parseSectionsByTitle = (
  text: string,
  titles: string[],
): ParsedSections => {
  const result: ParsedSections = {};
  titles.forEach((title, index) => {
    const start = text.indexOf(title);
    const end =
      index + 1 < titles.length ? text.indexOf(titles[index + 1]) : text.length;
    result[title] = text.slice(start + title.length, end).trim();
  });
  return result;
};

const formatBulletList = (text: string): string => {
  return text.replace(/^\s+-/gm, '-');
};

const Report = () => {
  const [animate, setAnimate] = useState(true);

  const location = useLocation();
  const { jobField, scoreResult = [], AIAnalysis = '' } = location.state || {};

  const user = useUserStore((state) => state.user);
  const userName = user?.name;

  // ✅ 평균 점수, radar 차트용 데이터 메모이제이션
  const averageScore = useMemo(() => {
    const total = scoreResult.reduce(
      (sum: number, item: ScoreResultItem) => sum + item.totalScore,
      0,
    );
    return scoreResult.length > 0 ? total / scoreResult.length : 0;
  }, [scoreResult]);

  const data = useMemo(() => {
    return subjects.map((subject) => {
      const match = scoreResult.find(
        (item: ScoreResultItem) => item.competencyName === subject,
      );
      return {
        subject,
        score: match?.totalScore ?? 0,
        averageScore,
      };
    });
  }, [scoreResult, averageScore]);

  const top3 = useMemo(() => {
    return [...data].sort((a, b) => b.score - a.score).slice(0, 3);
  }, [data]);

  const parsedResultSections = useMemo(
    () => parseSectionsByTitle(AIAnalysis, resultTitles),
    [AIAnalysis],
  );

  // 컴포넌트 마운트 후 애니메이션은 한 번만 실행
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(false), 2000); // 2초 후 애니메이션 끔
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className={styles.reportContainer}>
      <div id="pdf-section" className={styles.report}>
        <h2>{userName} 님의 이력서 분석 결과</h2>
        <section className={styles.jobField}>
          <h3>01 직무</h3>
          <p>{jobField}</p>
        </section>
        <section className={styles.competency}>
          <h3>02 이력서에 표현된 역량</h3>
          <div className={styles.top3}>
            <h4>역량 TOP3</h4>
            <div>
              <p className={styles.top3Text}>
                아래는 이력서에 드러난 당신의 역량 중 강조된 세 가지입니다.
                당신이 표현하려 했던 역량과 일치하나요?
              </p>
              <ul className={styles.top3List}>
                {top3.map((v, i) => (
                  <li key={i}>
                    <span>{i + 1}위</span>
                    {v.subject}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className={styles.chart}>
            <ResponsiveContainer width="100%" aspect={1}>
              <RadarChart cx="50%" cy="50%" outerRadius="60%" data={data}>
                <PolarGrid stroke="#d8d8d8" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontSize: 14, fill: '#757575' }}
                />
                <PolarRadiusAxis domain={[0, 20]} style={{ fontSize: 10 }} />
                <Radar
                  name="내 역량의 평균"
                  dataKey="averageScore"
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
                  isAnimationActive={animate}
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
                  isAnimationActive={animate}
                />
                <Legend wrapperStyle={{ fontSize: 14 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className={styles.result}>
          <h3>03 분석 결과</h3>
          <div className={styles.resultSection}>
            {Object.entries(parsedResultSections).map(([title, content]) => (
              <div key={title}>
                <h4>{title}</h4>
                <p className={styles.resultText}>{formatBulletList(content)}</p>
              </div>
            ))}
          </div>
        </section>
        <section className={styles.recomCorp}>
          <h3>04 추천 기업</h3>
        </section>
      </div>
      <Button type="button" variant="primary" size="lg" onClick={downloadPDF}>
        결과 보고서 다운로드
      </Button>
    </main>
  );
};

export default Report;
