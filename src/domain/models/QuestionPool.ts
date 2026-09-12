import { PoolQuestion, QuestionOption } from './questions/types';
import { FASHION_QUESTIONS } from './questions/fashionQuestions';
import { HAIR_QUESTIONS } from './questions/hairQuestions';
import { SCHOOL_QUESTIONS } from './questions/schoolQuestions';
import { ACTIVITY_QUESTIONS } from './questions/activityQuestions';
import { FOOD_QUESTIONS } from './questions/foodQuestions';
import { MOOD_QUESTIONS } from './questions/moodQuestions';

export * from './questions/types';

// 合計100問の質問プール
export const QUESTION_POOL: PoolQuestion[] = [
  ...FASHION_QUESTIONS,  // 20問
  ...HAIR_QUESTIONS,     // 15問
  ...SCHOOL_QUESTIONS,   // 20問
  ...ACTIVITY_QUESTIONS, // 20問
  ...FOOD_QUESTIONS,     // 15問
  ...MOOD_QUESTIONS,     // 10問
];

/**
 * 100問のプールから毎回バランスよく5問をランダム選出する
 * ※ ヘアアレンジ提案のため、必ず1問は髪の長さ(hairLength)判定ができる質問を含める
 */
export function selectFiveQuestions(): PoolQuestion[] {
  // 1. hairLength を含む質問（HAIR_QUESTIONSなど）から1問選出
  const hairQuestionsWithLength = QUESTION_POOL.filter((q) =>
    q.options.some((opt) => opt.hairLength !== undefined)
  );
  const selectedHairQuestion =
    hairQuestionsWithLength[Math.floor(Math.random() * hairQuestionsWithLength.length)];

  // 2. 残りのプール（選出された質問を除く）からシャッフルして4問選出
  const otherQuestions = QUESTION_POOL.filter((q) => q.id !== selectedHairQuestion.id);
  const shuffledOthers = [...otherQuestions].sort(() => Math.random() - 0.5);

  // ジャンルが偏りすぎないように抽出
  const selectedOtherFour: PoolQuestion[] = [];
  const usedGenres = new Set<string>();

  // 1次パス: 異なるジャンルからピックアップ
  for (const q of shuffledOthers) {
    if (selectedOtherFour.length >= 4) break;
    if (!usedGenres.has(q.genre)) {
      selectedOtherFour.push(q);
      usedGenres.add(q.genre);
    }
  }

  // もし4問に満たない場合は残りを順次追加
  for (const q of shuffledOthers) {
    if (selectedOtherFour.length >= 4) break;
    if (!selectedOtherFour.some((item) => item.id === q.id)) {
      selectedOtherFour.push(q);
    }
  }

  // 3. 5問をまとめてシャッフル（ただし髪型質問が最後だと自然な流れになりやすいので、4問+髪型質問、または全体シャッフル）
  // 質問の流れとして、4問の楽しいクイズの後に髪の長さを聞くのが自然
  return [...selectedOtherFour, selectedHairQuestion];
}
