import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  type Competency,
  QUESTIONS,
  QUESTION_OPTION_COMPETENCIES,
} from '@/constants/questions';
import Icon from '@/components/icon/Icon';
import Option from './components/option/Option';
import styles from './Quiz.module.css';

const competencyNameMap: Record<Competency, string> = {
  communication: '의사소통',
  technicalExpertise: '기술 전문성',
  responsibility: '책임감',
  problemSolving: '문제 해결력',
  creativity: '창의성',
  leadership: '리더십',
  growthPotential: '성장 가능성',
};

const BASE_SCORE = 5;
const MULTIPLIER = 2;

const HRTestQuiz = () => {
  const navigate = useNavigate();

  const total = QUESTIONS.length;

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<(0 | 1 | 2)[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentQuestion = QUESTIONS[currentStep];

  const calculateScores = (): Record<string, number> => {
    const scores: Record<Competency, number> = {
      communication: BASE_SCORE,
      technicalExpertise: BASE_SCORE,
      responsibility: BASE_SCORE,
      problemSolving: BASE_SCORE,
      creativity: BASE_SCORE,
      leadership: BASE_SCORE,
      growthPotential: BASE_SCORE,
    };

    selectedOptions.forEach((selectedOption, i) => {
      const competency = QUESTION_OPTION_COMPETENCIES[i][selectedOption];
      scores[competency] += 1;
    });

    // 한글 키로 매핑 + 가중치 곱하기
    const translated: Record<string, number> = {};
    for (const [key, value] of Object.entries(scores)) {
      const korKey = competencyNameMap[key as Competency];
      translated[korKey] = value * MULTIPLIER;
    }

    return translated;
  };

  const handleSelect = (selectedIndex: 0 | 1 | 2) => {
    const updatedOptions = [...selectedOptions];
    updatedOptions[currentStep] = selectedIndex;
    setSelectedOptions(updatedOptions);

    if (currentStep === total - 1) {
      const scoreResult = calculateScores();
      console.log(scoreResult);
      navigate('/hr-test/loading', { state: { scoreResult } });
    } else {
      animateStep(() => setCurrentStep((prev) => prev + 1));
    }
  };

  const goToPrevStep = () => {
    if (currentStep === 0) return;
    animateStep(() => setCurrentStep((prev) => prev - 1));
  };

  const animateStep = (callback: () => void) => {
    setIsAnimating(true);
    setTimeout(() => {
      callback();
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className={styles.quizContainer}>
      <div className={styles.quizHeader}>
        <button
          type="button"
          aria-label="이전 질문 보기"
          className={styles.prevButton}
          onClick={goToPrevStep}
        >
          <Icon id="arrow-back" width={16} height={16} />
        </button>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${((currentStep + 1) / total) * 100}%` }}
          />
        </div>
        <div className={styles.progressText}>
          <span className={styles.now}>{currentStep + 1}</span>
          <span className={styles.total}>/{total}</span>
        </div>
      </div>
      <div
        className={`${styles.questionContainer} ${isAnimating ? styles.fadeOut : ''}`}
      >
        <div className={styles.quizCount}>Q{currentQuestion.id}.</div>
        <div className={styles.question}>{currentQuestion.text}</div>
        <ol className={styles.answerList}>
          {currentQuestion.options.map((option, i) => (
            <li key={i}>
              <Option onClick={() => handleSelect(i as 0 | 1 | 2)}>
                {option}
              </Option>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default HRTestQuiz;
