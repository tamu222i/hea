import { describe, it, expect } from 'vitest';
import { DiagnosisDomainService } from '../services/DiagnosisDomainService';
import { UserAnswersSchema } from '../schemas/diagnosisSchema';
import { StyleTypeId } from '../models/StyleTypes';

describe('Feature: 小学生ヘア＆ファッションタイプ診断 (BDD)', () => {
  const service = new DiagnosisDomainService();

  describe('Scenario: 元気で活発な選択肢を選んだ場合', () => {
    it('Given 好きな色「黄色」、好きな食べ物「ハンバーグ/ポテト」、気分「元気いっぱい！」のとき、When 診断すると、Then ポップスポーティタイプが判定されること', () => {
      const rawAnswers = {
        favoriteColor: 'yellow',
        favoriteFood: 'burger_potato',
        weekendActivity: 'active_sports',
        currentMood: 'energetic',
        hairLength: 'medium' as const,
      };

      const validatedAnswers = UserAnswersSchema.parse(rawAnswers);
      const result = service.diagnose(validatedAnswers);

      expect(result.typeId).toBe(StyleTypeId.POP_SPORTY);
      expect(result.typeName).toContain('ポップスポーティ');
      expect(result.recommendedColors.length).toBeGreaterThanOrEqual(3);
      expect(result.hairStyles.length).toBeGreaterThanOrEqual(1);
      expect(result.schoolFashion).toBeDefined();
      expect(result.luckyFood).toBeDefined();
    });
  });

  describe('Scenario: かわいい甘めな選択肢を選んだ場合', () => {
    it('Given 好きな色「パステルピンク」、好きな食べ物「スイーツ」、気分「ふわふわ夢気分」のとき、When 診断すると、Then スウィートガーリータイプが判定されること', () => {
      const rawAnswers = {
        favoriteColor: 'pink',
        favoriteFood: 'sweets_parfait',
        weekendActivity: 'craft_reading',
        currentMood: 'dreamy',
        hairLength: 'long' as const,
      };

      const validatedAnswers = UserAnswersSchema.parse(rawAnswers);
      const result = service.diagnose(validatedAnswers);

      expect(result.typeId).toBe(StyleTypeId.SWEET_GIRLY);
      expect(result.typeName).toContain('スウィートガーリー');
    });
  });

  describe('Scenario: クールで大人っぽい選択肢を選んだ場合', () => {
    it('Given 好きな色「青」、好きな食べ物「ピザ」、気分「クールに落ち着きたい」のとき、When 診断すると、Then クールカジュアルタイプが判定されること', () => {
      const rawAnswers = {
        favoriteColor: 'blue',
        favoriteFood: 'pizza',
        weekendActivity: 'game_youtube',
        currentMood: 'cool_calm',
        hairLength: 'short' as const,
      };

      const validatedAnswers = UserAnswersSchema.parse(rawAnswers);
      const result = service.diagnose(validatedAnswers);

      expect(result.typeId).toBe(StyleTypeId.COOL_CASUAL);
      expect(result.typeName).toContain('クールカジュアル');
    });
  });

  describe('Scenario: ナチュラルで癒やし系の選択肢を選んだ場合', () => {
    it('Given 好きな色「緑」、好きな食べ物「おにぎり・スープ」、気分「リラックス」のとき、When 診断すると、Then ナチュラルピュアタイプが判定されること', () => {
      const rawAnswers = {
        favoriteColor: 'green',
        favoriteFood: 'soup_onigiri',
        weekendActivity: 'nature_walk',
        currentMood: 'relax_gentle',
        hairLength: 'medium' as const,
      };

      const validatedAnswers = UserAnswersSchema.parse(rawAnswers);
      const result = service.diagnose(validatedAnswers);

      expect(result.typeId).toBe(StyleTypeId.NATURAL_PURE);
      expect(result.typeName).toContain('ナチュラルピュア');
    });
  });

  describe('Scenario: トレンド大好きでキラキラな選択肢を選んだ場合', () => {
    it('Given 好きな色「紫」、好きな食べ物「マカロン・タピオカ」、気分「キラキラワクワク！」のとき、When 診断すると、Then トレンドアイドルタイプが判定されること', () => {
      const rawAnswers = {
        favoriteColor: 'purple',
        favoriteFood: 'macaron_tapioca',
        weekendActivity: 'dance_tiktok',
        currentMood: 'sparkle_excited',
        hairLength: 'long' as const,
      };

      const validatedAnswers = UserAnswersSchema.parse(rawAnswers);
      const result = service.diagnose(validatedAnswers);

      expect(result.typeId).toBe(StyleTypeId.TRENDY_IDOL);
      expect(result.typeName).toContain('トレンドおしゃかわアイドル');
    });
  });

  describe('Scenario: 伝説のシークレットスタイルの判定', () => {
    it('Given 虹色・スイーツ・夢気分の回答のとき、When 診断すると、Then 奇跡の幻獣！レインボーユニコーンエンジェルが覚醒すること', () => {
      const answers = UserAnswersSchema.parse({
        favoriteColor: 'rainbow',
        favoriteFood: 'sweets_parfait',
        weekendActivity: 'nature_walk',
        currentMood: 'dreamy',
        hairLength: 'long',
      });

      const result = service.diagnose(answers);
      expect(result.typeId).toBe(StyleTypeId.SECRET_UNICORN);
      expect(result.isSecret).toBe(true);
      expect(result.rarity).toBe('Secret');
      expect(result.typeName).toContain('ユニコーン');
    });

    it('Given ピンク・スイーツ・ダンス・キラキラ気分のとき、Then ミラクル☆マジカルガールが覚醒すること', () => {
      const answers = UserAnswersSchema.parse({
        favoriteColor: 'pink',
        favoriteFood: 'sweets_parfait',
        weekendActivity: 'dance_tiktok',
        currentMood: 'sparkle_excited',
        hairLength: 'medium',
      });

      const result = service.diagnose(answers);
      expect(result.typeId).toBe(StyleTypeId.SECRET_MAGICAL);
      expect(result.isSecret).toBe(true);
      expect(result.typeName).toContain('マジカルガール');
    });

    it('Given シルバー・ゲーム・クールのとき、Then 電脳サイバーフェアリーが覚醒すること', () => {
      const answers = UserAnswersSchema.parse({
        favoriteColor: 'silver',
        favoriteFood: 'pizza',
        weekendActivity: 'game_youtube',
        currentMood: 'cool_calm',
        hairLength: 'short',
      });

      const result = service.diagnose(answers);
      expect(result.typeId).toBe(StyleTypeId.SECRET_CYBER);
      expect(result.isSecret).toBe(true);
      expect(result.typeName).toContain('電脳サイバー');
    });

    it('Given ベージュ・博物館・リラックスのとき、Then ファラオエンプレス女王が覚醒すること', () => {
      const answers = UserAnswersSchema.parse({
        favoriteColor: 'beige',
        favoriteFood: 'soup_onigiri',
        weekendActivity: 'library_museum',
        currentMood: 'relax_gentle',
        hairLength: 'medium',
      });

      const result = service.diagnose(answers);
      expect(result.typeId).toBe(StyleTypeId.SECRET_PHARAOH);
      expect(result.isSecret).toBe(true);
      expect(result.typeName).toContain('ファラオエンプレス');
    });

    it('Given 紫・自然散歩・夢気分のとき、Then コズミックギャラクシーが覚醒すること', () => {
      const answers = UserAnswersSchema.parse({
        favoriteColor: 'purple',
        favoriteFood: 'fruits',
        weekendActivity: 'nature_walk',
        currentMood: 'dreamy',
        hairLength: 'long',
      });

      const result = service.diagnose(answers);
      expect(result.typeId).toBe(StyleTypeId.SECRET_COSMIC);
      expect(result.isSecret).toBe(true);
      expect(result.typeName).toContain('コズミックギャラクシー');
    });
  });

  describe('Scenario: スキーマバリデーションによる不正データの検出', () => {
    it('Given 必須の好きな色が空文字である無効な回答のとき、When スキーマ検証すると、Then ZodErrorがスローされること', () => {
      const invalidAnswers = {
        favoriteColor: '',
        favoriteFood: 'burger_potato',
        weekendActivity: 'active_sports',
        currentMood: 'energetic',
        hairLength: 'medium',
      };

      expect(() => UserAnswersSchema.parse(invalidAnswers)).toThrow();
    });
  });
});
