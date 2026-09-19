import { describe, it, expect } from 'vitest';
import { DiagnosisDomainService, DynamicSelectedOption } from '../services/DiagnosisDomainService';
import { selectDiagnosisQuestions, selectFiveQuestions } from '../models/QuestionPool';

describe('Feature: シークレットスタイルの出現率調整＆バリエーション検証 (BDD/TDD)', () => {
  const service = new DiagnosisDomainService();

  describe('Scenario 1: 質問選出における運命のシークレット扉の保証', () => {
    it('Given 診断クイズを開始したとき、When 5問が選出されると、Then 必ず1問は運命のシークレット扉(secret_fate)質問が含まれていること', () => {
      for (let i = 0; i < 20; i++) {
        const questions = selectFiveQuestions();
        expect(questions.length).toBe(5);

        const hasSecretFateQuestion = questions.some((q) => q.genre === 'secret_fate');
        expect(hasSecretFateQuestion, '5問中、必ず1問はシークレット覚醒の運命質問が含まれること').toBe(true);
      }
    });
  });

  describe('Scenario 2: シークレットタグ選択時の確実な覚醒', () => {
    it('Given ユーザーが鬼滅の刃タグ(kimetsu)の選択肢を2つ以上選んだとき、Then 100%確実に鬼滅の刃シークレットスタイルが覚醒すること', () => {
      const answers = {
        selectedOptions: [
          { questionId: 'f8', optionId: 'f8_kimetsu', secretTag: 'kimetsu' as const },
          { questionId: 'sf1', optionId: 'sf1_blade', secretTag: 'kimetsu' as const },
          { questionId: 'h1', optionId: 'h1_twin', hairLength: 'long' as const },
          { questionId: 'f1', optionId: 'f1_sweet' },
          { questionId: 's1', optionId: 's1_read' },
        ],
      };

      const result = service.diagnoseDynamic(answers);
      expect(result.isSecret).toBe(true);
      expect(result.typeId).toMatch(/^secret_kimetsu_\d{2}$/);
      expect(result.category).toContain('鬼滅');
    });

    it('Given ユーザーがガーリーシークレットタグ(secret_girly)を2つ選んだとき、Then 100%確実にガーリーシークレットスタイルが覚醒すること', () => {
      const answers = {
        selectedOptions: [
          { questionId: 'f11', optionId: 'f11_strawberry', secretTag: 'secret_girly' as const },
          { questionId: 'sf2', optionId: 'sf2_strawberry', secretTag: 'secret_girly' as const },
          { questionId: 'h1', optionId: 'h1_short', hairLength: 'short' as const },
          { questionId: 'f2', optionId: 'f2_sport' },
          { questionId: 's2', optionId: 's2_play' },
        ],
      };

      const result = service.diagnoseDynamic(answers);
      expect(result.isSecret).toBe(true);
      expect(result.typeId).toMatch(/^secret_girly_\d{2}$/);
    });

    it('Given ユーザーがシークレットタグを1つだけ選んだとき、Then 高確率（75%）でシークレットが覚醒し、覚醒しない場合でも専用のニアミス情報が付与されること', () => {
      let secretCount = 0;
      let nearMissCount = 0;

      // 100回テストして出現率を検証
      for (let i = 0; i < 100; i++) {
        const answers = {
          selectedOptions: [
            { questionId: 'q1', optionId: `opt_kimetsu_${i}`, secretTag: 'kimetsu' as const },
            { questionId: 'q2', optionId: `opt_normal_${i}` },
            { questionId: 'q3', optionId: `opt_hair_${i}`, hairLength: 'medium' as const },
            { questionId: 'q4', optionId: `opt_food_${i}` },
            { questionId: 'q5', optionId: `opt_mood_${i}` },
          ],
        };

        const result = service.diagnoseDynamic(answers);
        if (result.isSecret) {
          secretCount++;
          expect(result.typeId).toMatch(/^secret_kimetsu_\d{2}$/);
        } else if (result.nearMiss) {
          nearMissCount++;
          expect(result.nearMiss.message).toContain('鬼滅の刃');
        }
      }

      expect(secretCount).toBeGreaterThanOrEqual(60); // 75%付近で確実に出現
      expect(secretCount + nearMissCount).toBe(100); // 覚醒かニアミスのいずれかが必ず発生
    });
  });
});
