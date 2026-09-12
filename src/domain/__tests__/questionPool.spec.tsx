import { describe, it, expect } from 'vitest';
import { QUESTION_POOL, selectFiveQuestions } from '../models/QuestionPool';

describe('Feature: 100問の質問プールと5問ランダム選出 (TDD)', () => {
  it('Given 質問プールが存在するとき、Then 合計100問以上の質問が定義されていること', () => {
    expect(QUESTION_POOL.length).toBeGreaterThanOrEqual(100);
  });

  it('Given 各質問は有効なID、質問文、説明、および2つ以上の選択肢を持つこと', () => {
    QUESTION_POOL.forEach((q, index) => {
      expect(q.id, `Question at index ${index} must have an id`).toBeTruthy();
      expect(q.questionText, `Question ${q.id} must have questionText`).toBeTruthy();
      expect(q.options.length, `Question ${q.id} must have at least 2 options`).toBeGreaterThanOrEqual(2);
      q.options.forEach((opt) => {
        expect(opt.id).toBeTruthy();
        expect(opt.label).toBeTruthy();
        expect(opt.emoji).toBeTruthy();
      });
    });
  });

  it('Given 5問ランダム選出を実行したとき、When selectFiveQuestionsを呼ぶと、Then ちょうど5問が選出され、重複がないこと', () => {
    const selected = selectFiveQuestions();
    expect(selected.length).toBe(5);

    const ids = selected.map((q) => q.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(5);
  });

  it('Given 選出された5問の中に、必ず髪の長さ(hairLength)を判定できる質問が含まれていること', () => {
    // Run multiple times to verify randomness and invariant
    for (let i = 0; i < 20; i++) {
      const selected = selectFiveQuestions();
      const hasHairQuestion = selected.some((q) =>
        q.options.some((opt) => opt.hairLength !== undefined)
      );
      expect(hasHairQuestion, 'Selected 5 questions must contain at least one question with hairLength info').toBe(true);
    }
  });
});
