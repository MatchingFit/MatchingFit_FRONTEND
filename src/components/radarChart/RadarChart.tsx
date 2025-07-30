import { useEffect, useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type ChartDataItem = {
  subject: string;
  score: number;
  averageScore: number;
};

type CustomRadarChartProps = {
  data: ChartDataItem[];
  averageLabel?: string;
  scoreLabel?: string;
};

const CustomRadarChart = ({
  data,
  averageLabel,
  scoreLabel,
}: CustomRadarChartProps) => {
  const [animate, setAnimate] = useState(true);

  // 컴포넌트 마운트 후 애니메이션은 한 번만 실행
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(false), 2000); // 2초 후 애니메이션 끔
    return () => clearTimeout(timer);
  }, []);

  return (
    <ResponsiveContainer width="100%" aspect={1}>
      <RadarChart cx="50%" cy="50%" outerRadius="60%" data={data}>
        <PolarGrid stroke="#d8d8d8" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fontSize: 14, fill: '#757575' }}
        />
        <PolarRadiusAxis domain={[0, 20]} style={{ fontSize: 10 }} />
        <Radar
          name={averageLabel}
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
          name={scoreLabel}
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
  );
};

export default CustomRadarChart;
