type Question = {
  id: number;
  text: string;
  options: string[];
};

export type Competency =
  | 'communication'
  | 'technicalExpertise'
  | 'responsibility'
  | 'problemSolving'
  | 'creativity'
  | 'leadership'
  | 'growthPotential';

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: '팀 회의에서 의견이 갈릴 때 가장 이상적인 대응은 무엇인가요?',
    options: [
      '모든 구성원의 의견을 경청하고 균형 있게 전달한다', // 의사소통
      '공동의 목표를 상기시키며 팀 방향성을 이끈다', // 리더십
      '문제의 핵심 원인을 파악하고 대안을 제시한다', // 문제 해결력
    ],
  },
  {
    id: 2,
    text: '새로운 기술이나 도구를 배울 때 어떤 접근 방식을 선호하시나요?',
    options: [
      '먼저 시도하고 필요시 학습하며 적응한다', // 성장 가능성
      '기능과 구조를 이론적으로 파악한 후 사용한다', // 기술 전문성
      '다르게 활용하는 법을 실험하며 응용한다', // 창의성
    ],
  },
  {
    id: 3,
    text: '예상치 못한 문제가 발생했을 때 당신의 대응은?',
    options: [
      '원인을 분석하고 체계적으로 해결한다', // 문제 해결력
      '기술적 원인을 빠르게 진단하고 최적의 해결 방법을 적용한다', // 기술 전문성
      '일단 실행해보며 실전에서 답을 찾는다', // 성장 가능성
    ],
  },
  {
    id: 4,
    text: '업무 중 실수가 발생했을 때 가장 적절한 태도는?',
    options: [
      '책임을 인정하고 스스로 해결책을 제시한다', // 책임감
      '팀과 상황을 공유하고 재발 방지를 위한 프로세스를 논의한다', // 리더십
      '실수를 분석하고 동일한 문제를 방지하는 구조를 만든다', // 문제 해결력
    ],
  },
  {
    id: 5,
    text: '효과적인 리더가 갖추어야 할 가장 중요한 요소는?',
    options: [
      '팀원들과 자주 소통하고 신뢰를 형성하는 능력', // 의사소통
      '팀 전체를 대표하고 책임지는 태도', // 리더십
      '새로운 방식으로 해결책을 제시하는 창의력', // 창의성
    ],
  },
  {
    id: 6,
    text: '프로젝트 시작 단계에서 어떤 행동을 우선하시나요?',
    options: [
      '관련 기술을 깊이 있게 조사하고 익힌다', // 기술 전문성
      '책임과 역할을 명확히 하고 계획을 세운다', // 책임감
      '새로운 방향을 탐색하며 초기 실험을 해본다', // 창의성
    ],
  },
  {
    id: 7,
    text: '기한이 촉박한 프로젝트 상황에서 선호하는 행동은?',
    options: [
      '진행 상황을 명확히 소통하며 팀과 조율한다', // 의사소통
      '자신의 역할을 다하며 결과에 책임을 진다', // 책임감
      '팀에 동기부여를 주고 중심을 잡아준다', // 리더십
    ],
  },
  {
    id: 8,
    text: '낯선 시스템을 도입할 때 어떤 행동이 가장 중요하다고 보시나요?',
    options: [
      '기능을 먼저 분석하고 구조를 파악한다', // 기술 전문성
      '팀원들과 정보를 공유하며 함께 학습한다', // 의사소통
      '시행착오를 두려워하지 않고 직접 써본다', // 성장 가능성
    ],
  },
  {
    id: 9,
    text: '결과가 기대와 다를 경우 어떤 방식으로 대응하시나요?',
    options: [
      '데이터 기반으로 원인을 분석해 해결한다', // 문제 해결력
      '새로운 아이디어를 제안하며 방식을 개선한다', // 창의성
      '실패 원인을 돌아보고 더 나은 방식을 학습하여 적용한다', // 성장 가능성
    ],
  },
  {
    id: 10,
    text: '업무 일정이 지연될 경우, 어떤 대처를 하시나요?',
    options: [
      '핵심 업무를 선별해 우선 처리한다', // 책임감
      '지연 원인을 분석하고 구체적 대안을 세운다', // 문제 해결력
      '유사 사례를 참고해 효과적인 방식을 도입한다', // 기술 전문성
    ],
  },
  {
    id: 11,
    text: '새로운 제안을 할 때 가장 중요하다고 생각하는 방식은?',
    options: [
      '아이디어를 빠르게 시각화하고 실험해본다', // 창의성
      '구성원과 충분히 소통하고 피드백을 반영한다', // 의사소통
      '조직의 목표와 연결지어 전략적으로 설득한다', // 리더십
    ],
  },
  {
    id: 12,
    text: '직무 역량이 부족하다고 느껴질 때, 당신의 행동은?',
    options: [
      '스스로 자료를 찾아 반복 학습한다', // 성장 가능성
      '전문가에게 조언을 구하고 구체적 해결을 시도한다', // 기술 전문성
      '일정 조율을 통해 품질과 기한을 모두 관리한다', // 책임감
    ],
  },
  {
    id: 13,
    text: '팀 내 갈등 상황에서 필요한 대응은 무엇인가요?',
    options: [
      '팀원 간 갈등을 중재하며 해결을 유도한다', // 리더십
      '각자의 입장을 정리하고 공통점을 찾는다', // 의사소통
      '갈등의 구조적 원인을 분석하고 장기 해결을 시도한다', // 문제 해결력
    ],
  },
  {
    id: 14,
    text: '장기적인 커리어를 위한 이상적인 자세는?',
    options: [
      '스스로 학습하며 지속적으로 도전한다', // 성장 가능성
      '업무에 대한 책임감을 가지고 완성도를 높인다', // 책임감
      '새로운 기회를 포착하고 제안할 수 있는 감각을 갖춘다', // 창의성
    ],
  },
];

export const QUESTION_OPTION_COMPETENCIES: Competency[][] = [
  ['communication', 'leadership', 'problemSolving'], // Q1
  ['growthPotential', 'technicalExpertise', 'creativity'], // Q2
  ['problemSolving', 'technicalExpertise', 'growthPotential'], // Q3
  ['responsibility', 'leadership', 'problemSolving'], // Q4
  ['communication', 'leadership', 'creativity'], // Q5
  ['technicalExpertise', 'responsibility', 'creativity'], // Q6
  ['communication', 'responsibility', 'leadership'], // Q7
  ['technicalExpertise', 'communication', 'growthPotential'], // Q8
  ['problemSolving', 'creativity', 'growthPotential'], // Q9
  ['responsibility', 'problemSolving', 'technicalExpertise'], // Q10
  ['creativity', 'communication', 'leadership'], // Q11
  ['growthPotential', 'technicalExpertise', 'responsibility'], // Q12
  ['leadership', 'communication', 'problemSolving'], // Q13
  ['growthPotential', 'responsibility', 'creativity'], // Q14
];
