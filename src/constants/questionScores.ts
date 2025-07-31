export type Competency =
  | 'communication'
  | 'technical_expertise'
  | 'problem_solving'
  | 'responsibility'
  | 'creativity'
  | 'leadership'
  | 'growth_potential';

export type CompetencyScore = {
  [key in Competency]: number;
};

export const QUESTION_SCORES: {
  [questionId: string]: {
    [optionIndex: number]: Partial<CompetencyScore>;
  };
} = {
  q1: {
    0: { communication: 4, problem_solving: 1 },
    1: { communication: 3 },
    2: { communication: 2 },
  },
  q2: {
    0: { communication: 4 },
    1: { communication: 3, leadership: 3 },
    2: { communication: 3, creativity: 2 },
  },
  q3: {
    0: { technical_expertise: 5 },
    1: { technical_expertise: 4, growth_potential: 2 },
    2: { technical_expertise: 3, creativity: 2 },
  },
  q4: {
    0: { technical_expertise: 4, growth_potential: 2 },
    1: { technical_expertise: 3 },
    2: { technical_expertise: 3 },
  },
  q5: {
    0: { problem_solving: 5 },
    1: { problem_solving: 4 },
    2: { problem_solving: 3, communication: 1 },
  },
  q6: {
    0: { problem_solving: 5, technical_expertise: 1 },
    1: { problem_solving: 4, technical_expertise: 2 },
    2: { problem_solving: 4, creativity: 2 },
  },
  q7: {
    0: { responsibility: 5, problem_solving: 2 },
    1: { responsibility: 4, communication: 2 },
    2: { responsibility: 5 },
  },
  q8: {
    0: { responsibility: 5 },
    1: { responsibility: 4, communication: 1 },
    2: { responsibility: 4 },
  },
  q9: {
    0: { creativity: 5, technical_expertise: 2 },
    1: { creativity: 4 },
    2: { creativity: 3 },
  },
  q10: {
    0: { creativity: 5 },
    1: { creativity: 4 },
    2: { creativity: 4 },
  },
  q11: {
    0: { leadership: 5 },
    1: { leadership: 4, communication: 2 },
    2: { leadership: 4 },
  },
  q12: {
    0: { leadership: 5, responsibility: 2 },
    1: { leadership: 4, communication: 2 },
    2: { leadership: 4 },
  },
  q13: {
    0: { growth_potential: 5, responsibility: 2 },
    1: { growth_potential: 4 },
    2: { growth_potential: 3 },
  },
  q14: {
    0: { growth_potential: 5 },
    1: { growth_potential: 4 },
    2: { growth_potential: 3, problem_solving: 2 },
  },
};
