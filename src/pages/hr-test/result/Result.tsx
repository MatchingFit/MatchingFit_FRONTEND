import { useEffect, useState } from 'react';
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
import styles from './Result.module.css';

const competencyDescriptions: { [key: string]: string } = {
  의사소통:
    '팀원 간 원활한 협업과 갈등 조정을 위한 커뮤니케이션 능력을 높게 평가합니다.',
  '기술 전문성':
    '직무에 필요한 지식과 기술을 깊이 있게 이해하고, 실제 업무에 적용할 수 있는 인재를 선호합니다.',
  '문제 해결력':
    '스스로 상황을 분석하고 실행 가능한 해결책을 제시할 수 있는 인재를 선호합니다.',
  책임감: '맡은 일을 끝까지 해내며 결과에 책임지는 태도를 중요하게 생각합니다.',
  창의성:
    '기존 방식에 얽매이지 않고, 새로운 아이디어로 문제를 해결하거나 개선점을 제안하는 인재를 높이 평가합니다.',
  리더십:
    '팀을 이끌며 구성원에게 긍정적인 영향을 주고, 목표 달성을 위해 방향을 제시할 수 있는 역량을 중요하게 여깁니다.',
  '성장 가능성':
    '피드백을 수용하고 지속적으로 배우려는 태도를 가진, 잠재력 높은 인재에게 주목합니다.',
};

const subjects: string[] = [
  '의사소통',
  '기술 전문성',
  '책임감',
  '문제 해결력',
  '창의성',
  '리더십',
  '성장 가능성',
];

const HRTestResult = () => {
  const [animate, setAnimate] = useState(true);

  // 컴포넌트 마운트 후 애니메이션은 한 번만 실행
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(false), 2000); // 2초 후 애니메이션 끔
    return () => clearTimeout(timer);
  }, []);

  const user = useUserStore((state) => state.user);
  const userName = user?.name;

  const location = useLocation();
  const { scoreResult } = location.state || {};

  const orderedScoreResult: Record<string, number> = {};
  subjects.forEach((key) => {
    if (scoreResult[key] !== undefined) {
      orderedScoreResult[key] = scoreResult[key];
    }
  });

  const total = (Object.values(orderedScoreResult) as number[]).reduce(
    (sum: number, score: number) => sum + score,
    0,
  );
  const averageScore = total / Object.values(orderedScoreResult).length;

  const data = Object.entries(orderedScoreResult).map(([subject, score]) => ({
    subject,
    score: Number(score),
    averageScore,
  }));

  const top3 = Object.entries(orderedScoreResult)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <main className={styles.report}>
      <div>
        <h2>HR 담당자 성향 분석 결과 리포트</h2>
        <p>
          {userName} 님의 테스트 결과를 기반으로, 현재 선호하는 인재의 역량과
          스타일을 분석한 보고서입니다. <br />
          이는 채용 시 어떤 역량에 집중하고 있는지를 객관적으로 확인하고, 조직에
          적합한 인재 유형을 파악하는 데 활용할 수 있습니다.
        </p>
      </div>
      <section className={styles.competency}>
        <h3> 📌 역량 선호도 차트 </h3>
        <p>
          {userName} 님이 선호하는 인재 역량은 다음 7가지로 분류되며, 아래
          그래프는 그 선호도 분포를 시각화한 것입니다. <br />
          해당 차트는 인재 평가 시 중시하는 역량의 우선순위를 시각적으로
          보여줍니다.
        </p>
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
                name="평균"
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
        <h4>🏅 선호 역량 Top 3 </h4>
        <ol className={styles.top3List}>
          {top3.map(([key], index) => (
            <li key={key}>
              <span className={styles.top3Competency}>
                {index + 1}. {key}{' '}
              </span>
              <span className={styles.top3Description}>
                <span>▶️</span>
                {competencyDescriptions[key]}
              </span>
            </li>
          ))}
        </ol>
      </section>
      <section className={styles.recomRes}>
        <h3>📄 추천 이력서</h3>
        <p>
          {userName} 님의 성향 분석을 바탕으로 선별된 구직자의 이력서입니다.
          선호하는 인재상에 부합하는 구직자를 확인해보세요.
        </p>
        <ul>
          <li></li>
          <li></li>
        </ul>
      </section>
    </main>
  );
};

export default HRTestResult;
