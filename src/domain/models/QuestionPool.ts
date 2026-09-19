import { PoolQuestion, QuestionOption } from './questions/types';
import { FASHION_QUESTIONS } from './questions/fashionQuestions';
import { HAIR_QUESTIONS } from './questions/hairQuestions';
import { SCHOOL_QUESTIONS } from './questions/schoolQuestions';
import { ACTIVITY_QUESTIONS } from './questions/activityQuestions';
import { FOOD_QUESTIONS } from './questions/foodQuestions';
import { MOOD_QUESTIONS } from './questions/moodQuestions';
import { SECRET_FATE_QUESTIONS } from './questions/secretQuestions';

export * from './questions/types';

// 合計115問以上の質問プール
export const QUESTION_POOL: PoolQuestion[] = [
  ...FASHION_QUESTIONS,      // 20問
  ...HAIR_QUESTIONS,         // 15問
  ...SCHOOL_QUESTIONS,       // 20問
  ...ACTIVITY_QUESTIONS,     // 20問
  ...FOOD_QUESTIONS,         // 15問
  ...MOOD_QUESTIONS,         // 10問
  ...SECRET_FATE_QUESTIONS,  // 15問（シークレット覚醒・運命の扉質問）
];

/**
 * 質問プールから毎回バランスよく5問（基本3問＋髪型1問＋運命のシークレット扉1問）を選出する
 * ※ 毎回必ず第5問にシークレット覚醒の運命質問が登場し、シークレット出現率が大幅UP！
 */
export function selectDiagnosisQuestions(count: number = 5): PoolQuestion[] {
  // 1. hairLength を含む質問から1問選出
  const hairQuestionsWithLength = QUESTION_POOL.filter((q) =>
    q.options.some((opt) => opt.hairLength !== undefined)
  );
  const selectedHairQuestion =
    hairQuestionsWithLength[Math.floor(Math.random() * hairQuestionsWithLength.length)];

  // 2. 運命のシークレット覚醒質問(SECRET_FATE_QUESTIONS)から1問選出
  const selectedSecretFateQuestion =
    SECRET_FATE_QUESTIONS[Math.floor(Math.random() * SECRET_FATE_QUESTIONS.length)];

  // 3. 残りの一般質問（ファッション・学校・休日・食べ物・気分）から選出
  const generalCount = Math.max(1, count - 2);
  const generalQuestions = QUESTION_POOL.filter(
    (q) =>
      q.id !== selectedHairQuestion.id &&
      q.id !== selectedSecretFateQuestion.id &&
      q.genre !== 'secret_fate' &&
      !q.options.some((opt) => opt.hairLength !== undefined)
  );

  const shuffledGeneral = [...generalQuestions].sort(() => Math.random() - 0.5);
  const selectedGeneral: PoolQuestion[] = [];
  const usedGenres = new Set<string>();

  // ジャンルが被らないように優先ピックアップ
  for (const q of shuffledGeneral) {
    if (selectedGeneral.length >= generalCount) break;
    if (!usedGenres.has(q.genre)) {
      selectedGeneral.push(q);
      usedGenres.add(q.genre);
    }
  }

  for (const q of shuffledGeneral) {
    if (selectedGeneral.length >= generalCount) break;
    if (!selectedGeneral.some((item) => item.id === q.id)) {
      selectedGeneral.push(q);
    }
  }

  // 4. [一般3問, 髪型質問, 運命のシークレット覚醒質問] の合計5問を返す
  return [...selectedGeneral, selectedHairQuestion, selectedSecretFateQuestion];
}

// 互換性のためのエイリアス
export const selectFiveQuestions = () => selectDiagnosisQuestions(5);
