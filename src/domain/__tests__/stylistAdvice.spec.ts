import { describe, it, expect } from 'vitest';
import { generateOfflineAdvice } from '../services/StylistAdviceService';
import { PRESET_STYLES } from '../../infrastructure/repositories/presetStyles';
import { StyleTypeId } from '../models/StyleTypes';

describe('Feature: 静的ホスティング・GitHub Pages対応 スタイリストアドバイス生成 (BDD)', () => {
  describe('Scenario: サーバーレス環境（GitHub Pages）でのアドバイス生成', () => {
    it('Given 体育・運動会の日で雨の場合、崩れにくいヘアの助言と前向きな応援メッセージが含まれること', () => {
      const profile = PRESET_STYLES[StyleTypeId.POP_SPORTY];
      const advice = generateOfflineAdvice({
        profile,
        event: '体育・運動会',
        weather: '雨・くもり',
        hairLength: 'medium',
      });

      expect(advice).toContain(profile.typeName);
      expect(advice).toContain('体育');
      expect(advice).toContain('雨');
      expect(advice.length).toBeGreaterThan(30);
    });

    it('Given 発表会で晴れの日・ロングヘアの場合、特別感のあるアドバイスが返ること', () => {
      const profile = PRESET_STYLES[StyleTypeId.SWEET_GIRLY];
      const advice = generateOfflineAdvice({
        profile,
        event: '発表会・おめかし',
        weather: 'ぽかぽか晴れ',
        hairLength: 'long',
      });

      expect(advice).toContain(profile.typeName);
      expect(advice).toContain('発表会');
      expect(advice.length).toBeGreaterThan(30);
    });
  });
});
