import { describe, it, expect } from 'vitest';
import { DIAGNOSIS_QUESTIONS } from '../../infrastructure/repositories/QuestionRepository';
import { PRESET_STYLES } from '../../infrastructure/repositories/presetStyles';
import { StyleTypeId } from '../../domain/models/StyleTypes';

describe('Feature: 小学生スタイル診断 UIデータ & フロー整合性 (BDD)', () => {
  describe('Scenario: 質問データの整合性検証', () => {
    it('Given 診断クイズが存在するとき、全5問の質問があり、各質問に複数の選択肢が存在すること', () => {
      expect(DIAGNOSIS_QUESTIONS.length).toBe(5);
      DIAGNOSIS_QUESTIONS.forEach((q) => {
        expect(q.options.length).toBeGreaterThanOrEqual(3);
        expect(q.questionText).toBeTruthy();
      });
    });

    it('Given 髪の長さ質問(Q5)が存在するとき、short, medium, long の3選択肢が含まれていること', () => {
      const hairQuestion = DIAGNOSIS_QUESTIONS.find((q) => q.id === 'hairLength');
      expect(hairQuestion).toBeDefined();
      const optionIds = hairQuestion?.options.map((o) => o.id);
      expect(optionIds).toContain('short');
      expect(optionIds).toContain('medium');
      expect(optionIds).toContain('long');
    });
  });

  describe('Scenario: プリセットスタイルの完全性検証', () => {
    it('Given 全5つのスタイルタイプが存在するとき、各タイプに学校コーデと休日コーデ、カラーパレット、ヘアアレンジが設定されていること', () => {
      const types = [
        StyleTypeId.POP_SPORTY,
        StyleTypeId.SWEET_GIRLY,
        StyleTypeId.COOL_CASUAL,
        StyleTypeId.NATURAL_PURE,
        StyleTypeId.TRENDY_IDOL,
      ];

      types.forEach((typeId) => {
        const style = PRESET_STYLES[typeId];
        expect(style).toBeDefined();
        expect(style.typeName).toBeTruthy();
        expect(style.recommendedColors.length).toBeGreaterThanOrEqual(3);
        expect(style.hairStyles.length).toBeGreaterThanOrEqual(1);
        expect(style.schoolFashion.items.length).toBeGreaterThanOrEqual(3);
        expect(style.weekendFashion.items.length).toBeGreaterThanOrEqual(3);
        expect(style.luckyFood).toBeTruthy();
        expect(style.luckyItem).toBeTruthy();
      });
    });
  });
});
