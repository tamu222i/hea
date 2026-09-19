export type SecretTagType =
  | 'unicorn'
  | 'magical'
  | 'cyber'
  | 'pharaoh'
  | 'cosmic'
  | 'kimetsu'
  | 'secret_girly'
  | 'secret_pop'
  | 'secret_cool'
  | 'secret_natural';

export interface QuestionOption {
  id: string;
  label: string;
  subtitle?: string;
  emoji: string;
  colorCode?: string;
  categoryWeights?: Partial<Record<string, number>>;
  secretTag?: SecretTagType;
  hairLength?: 'short' | 'medium' | 'long';
}

export interface PoolQuestion {
  id: string;
  genre: 'fashion' | 'hair' | 'school' | 'activity' | 'food' | 'mood' | 'secret_fate';
  questionText: string;
  description: string;
  options: QuestionOption[];
}
