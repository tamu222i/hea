export interface QuestionOption {
  id: string;
  label: string;
  subtitle?: string;
  emoji: string;
  colorCode?: string;
  categoryWeights?: Partial<Record<string, number>>;
  secretTag?: 'unicorn' | 'magical' | 'cyber' | 'pharaoh' | 'cosmic';
  hairLength?: 'short' | 'medium' | 'long';
}

export interface PoolQuestion {
  id: string;
  genre: 'fashion' | 'hair' | 'school' | 'activity' | 'food' | 'mood';
  questionText: string;
  description: string;
  options: QuestionOption[];
}
