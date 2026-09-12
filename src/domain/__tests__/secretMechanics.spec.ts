import { describe, it, expect } from 'vitest';
import { DiagnosisDomainService } from '../services/DiagnosisDomainService';
import { StyleTypeId } from '../models/StyleTypes';

describe('Feature: シークレットスタイルの隠蔽＆「おしいｗ」ニアミス判定 (TDD)', () => {
  const service = new DiagnosisDomainService();

  describe('Scenario: シークレット条件にあと1問で届くニアミス（惜しいｗ）のとき', () => {
    it('Given ユニコーンシークレットの条件4問中3問を満たす回答のとき、Then ニアミス情報（おしいｗメッセージ＆ヒント）が付与されること', () => {
      // 虹色 + スイーツ + 夢気分のうち2〜3個合致（例えば虹色＋スイーツ＋違う気分など）
      const answers = {
        favoriteColor: 'rainbow',
        favoriteFood: 'sweets_parfait',
        weekendActivity: 'active_sports',
        currentMood: 'energetic', // 夢気分ではない
        hairLength: 'medium' as const,
      };

      const result = service.diagnose(answers);
      expect(result.isSecret).toBeFalsy();
      expect(result.nearMiss).toBeDefined();
      expect(result.nearMiss?.secretName).toContain('ユニコーン');
      expect(result.nearMiss?.message).toContain('おしい');
      expect(result.nearMiss?.hint).toBeTruthy();
    });

    it('Given マジカルガールの条件（ピンク＋スイーツ＋ダンス）に近いとき、Then マジカルガールのニアミス情報が付与されること', () => {
      const answers = {
        favoriteColor: 'pink',
        favoriteFood: 'sweets_parfait',
        weekendActivity: 'dance_tiktok',
        currentMood: 'cool_calm', // キラキラではない
        hairLength: 'medium' as const,
      };

      const result = service.diagnose(answers);
      expect(result.isSecret).toBeFalsy();
      expect(result.nearMiss).toBeDefined();
      expect(result.nearMiss?.secretName).toContain('マジカルガール');
      expect(result.nearMiss?.message).toContain('おしい');
    });

    it('Given まったくシークレット条件に近くない回答のとき、Then ニアミス情報は付与されないこと', () => {
      const answers = {
        favoriteColor: 'yellow',
        favoriteFood: 'burger_potato',
        weekendActivity: 'active_sports',
        currentMood: 'energetic',
        hairLength: 'short' as const,
      };

      const result = service.diagnose(answers);
      expect(result.nearMiss).toBeUndefined();
    });
  });

  describe('Scenario: 新しい100問プールからの動的な回答セットに対する診断', () => {
    it('Given 動的に選出された5問に対する回答レコードを受け取ったとき、Then 適切なスタイルプロファイルを算出できること', () => {
      const dynamicAnswers = {
        selectedOptions: [
          { questionId: 'q_fashion_1', optionId: 'opt_girly_ribbon', categoryWeights: { 'スウィート＆ガーリー': 3 } },
          { questionId: 'q_hair_1', optionId: 'opt_hair_kururinpa', categoryWeights: { 'スウィート＆ガーリー': 2 }, hairLength: 'long' as const },
          { questionId: 'q_sweet_1', optionId: 'opt_parfait', categoryWeights: { 'スウィート＆ガーリー': 2 } },
          { questionId: 'q_color_1', optionId: 'opt_pink', categoryWeights: { 'スウィート＆ガーリー': 2 } },
          { questionId: 'q_mood_1', optionId: 'opt_dreamy', categoryWeights: { 'スウィート＆ガーリー': 2 } },
        ],
      };

      const result = service.diagnoseDynamic(dynamicAnswers);
      expect(result).toBeDefined();
      expect(result.typeName).toBeTruthy();
      expect(result.category).toBe('ガーリー＆ロマンティック');
    });
  });
});
