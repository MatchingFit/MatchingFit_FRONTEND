import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QUESTIONS from '@/constants/questions';
import {
  QUESTION_SCORES,
  type Competency,
  type CompetencyScore,
} from '@/constants/questionScores';
import Icon from '@/components/icon/Icon';
import Option from './components/option/Option';
import styles from './Quiz.module.css';

const competencyNameMap: Record<Competency, string> = {
  communication: '의사소통',
  technical_expertise: '기술 전문성',
  problem_solving: '문제 해결력',
  responsibility: '책임감',
  creativity: '창의성',
  leadership: '리더십',
  growth_potential: '성장 가능성',
};

const HRTestQuiz = () => {
  const navigate = useNavigate();

  const total = QUESTIONS.length;

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentQuestion = QUESTIONS[currentStep];

  const userAnswers = useMemo(() => {
    const result: Record<string, number> = {};
    selectedIndexes.forEach((index, i) => {
      result[`q${i + 1}`] = index;
    });
    console.log(result);
    return result;
  }, [selectedIndexes]);

  const calculateScores = (): Record<string, number> => {
    const result: CompetencyScore = {
      communication: 0,
      technical_expertise: 0,
      problem_solving: 0,
      responsibility: 0,
      creativity: 0,
      leadership: 0,
      growth_potential: 0,
    };

    for (const [questionId, selectedIndex] of Object.entries(userAnswers)) {
      const score = QUESTION_SCORES[questionId]?.[selectedIndex];
      if (!score) continue;

      for (const [competency, value] of Object.entries(score)) {
        result[competency as Competency] += value;
      }
    }

    // 한글 키로 매핑
    const translated: Record<string, number> = {};
    for (const [key, value] of Object.entries(result)) {
      const korKey = competencyNameMap[key as Competency];
      translated[korKey] = value;
    }

    return translated;
  };

  const handleSelect = (option: string) => {
    const selectedIndex = currentQuestion.options.findIndex(
      (o) => o === option,
    );
    if (selectedIndex === -1) return;

    const updated = [...selectedIndexes];
    updated[currentStep] = selectedIndex;
    setSelectedIndexes(updated);

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
              <Option onClick={() => handleSelect(option)}>{option}</Option>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default HRTestQuiz;
