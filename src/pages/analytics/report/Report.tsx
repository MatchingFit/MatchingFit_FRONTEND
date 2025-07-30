import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import axiosFormInstance from '@/lib/axiosFormInstance';
import useUserStore from '@/store/user';
import { generatePDFBlob, downloadPDF } from '@/utils/generatePDF';
import CustomRadarChart from '@/components/radarChart/RadarChart';
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
  const location = useLocation();
  const {
    resumeId,
    jobField,
    scoreResult = [],
    AIAnalysis = '',
  } = location.state || {};

  const user = useUserStore((state) => state.user);
  const userName = user?.name;

  useEffect(() => {
    if (!resumeId || !user) return;

    const timer = setTimeout(() => {
      const uploadPDFtoServer = async () => {
        const blob = await generatePDFBlob();

        if (!blob) return;

        try {
          const formData = new FormData();
          formData.append('file', blob, 'report.pdf');
          formData.append('resume_id', resumeId);

          await axiosFormInstance.post('/upload/pdf', formData);
        } catch (err) {
          console.error(err);
        }
      };

      uploadPDFtoServer();
    }, 100);

    return () => clearTimeout(timer);
  }, [resumeId, user]);

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
            <CustomRadarChart
              data={data}
              averageLabel="내 역량의 평균"
              scoreLabel="값"
            />
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
