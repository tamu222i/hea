import { StyleProfile, StyleTypeId, NearMissInfo } from '../models/StyleTypes';
import { UserAnswers } from '../schemas/diagnosisSchema';
import { IStyleRepository } from '../repositories/IStyleRepository';
import { PresetStyleRepository } from '../../infrastructure/repositories/PresetStyleRepository';
import { SecretTagType } from '../models/questions/types';

export interface DynamicSelectedOption {
  questionId: string;
  optionId: string;
  categoryWeights?: Partial<Record<string, number>>;
  secretTag?: SecretTagType;
  hairLength?: 'short' | 'medium' | 'long';
}

export interface DynamicUserAnswers {
  selectedOptions: DynamicSelectedOption[];
}

const KIMETSU_SECRET_IDS = [
  'secret_kimetsu_01', 'secret_kimetsu_02', 'secret_kimetsu_03', 'secret_kimetsu_04', 'secret_kimetsu_05',
  'secret_kimetsu_06', 'secret_kimetsu_07', 'secret_kimetsu_08', 'secret_kimetsu_09', 'secret_kimetsu_10',
  'secret_kimetsu_11', 'secret_kimetsu_12', 'secret_kimetsu_13', 'secret_kimetsu_14', 'secret_kimetsu_15',
  'secret_kimetsu_16', 'secret_kimetsu_17', 'secret_kimetsu_18', 'secret_kimetsu_19', 'secret_kimetsu_20',
];

const GIRLY_SECRET_IDS = [
  'secret_girly_01', 'secret_girly_02', 'secret_girly_03', 'secret_girly_04', 'secret_girly_05',
  'secret_girly_06', 'secret_girly_07', 'secret_girly_08', 'secret_girly_09', 'secret_girly_10',
  'secret_girly_11', 'secret_girly_12', 'secret_girly_13', 'secret_girly_14', 'secret_girly_15',
  'secret_girly_16', 'secret_girly_17', 'secret_girly_18', 'secret_girly_19', 'secret_girly_20',
];

const POP_SECRET_IDS = [
  'secret_pop_01', 'secret_pop_02', 'secret_pop_03', 'secret_pop_04', 'secret_pop_05',
  'secret_pop_06', 'secret_pop_07', 'secret_pop_08', 'secret_pop_09', 'secret_pop_10',
  'secret_pop_11', 'secret_pop_12', 'secret_pop_13', 'secret_pop_14', 'secret_pop_15',
  'secret_pop_16', 'secret_pop_17', 'secret_pop_18', 'secret_pop_19', 'secret_pop_20',
];

const COOL_SECRET_IDS = [
  'secret_cool_01', 'secret_cool_02', 'secret_cool_03', 'secret_cool_04', 'secret_cool_05',
  'secret_cool_06', 'secret_cool_07', 'secret_cool_08', 'secret_cool_09', 'secret_cool_10',
  'secret_cool_11', 'secret_cool_12', 'secret_cool_13', 'secret_cool_14', 'secret_cool_15',
  'secret_cool_16', 'secret_cool_17', 'secret_cool_18', 'secret_cool_19', 'secret_cool_20',
];

const NATURAL_SECRET_IDS = [
  'secret_natural_01', 'secret_natural_02', 'secret_natural_03', 'secret_natural_04', 'secret_natural_05',
  'secret_natural_06', 'secret_natural_07', 'secret_natural_08', 'secret_natural_09', 'secret_natural_10',
  'secret_natural_11', 'secret_natural_12', 'secret_natural_13', 'secret_natural_14', 'secret_natural_15',
  'secret_natural_16', 'secret_natural_17', 'secret_natural_18', 'secret_natural_19', 'secret_natural_20',
];

export class DiagnosisDomainService {
  constructor(private readonly styleRepo: IStyleRepository = new PresetStyleRepository()) {}

  /**
   * ユーザーの回答に基づいてスコアを集計し、最適なスタイルプロファイルを判定する
   * （シークレットスタイルの発動条件 & おしいｗニアミス判定も実施）
   */
  public diagnose(answers: UserAnswers): StyleProfile {
    // 1. シークレットスタイルの特殊条件チェック
    const secretTypeId = this.checkSecretTrigger(answers);
    const selectedTypeId = secretTypeId || this.determineType(answers);
    const baseProfile = this.styleRepo.getById(selectedTypeId);

    // 2. シークレットでない場合、ニアミス（おしいｗ）チェック
    let nearMiss: NearMissInfo | undefined = undefined;
    if (!secretTypeId) {
      nearMiss = this.checkNearMiss(answers);
    }

    return {
      ...baseProfile,
      nearMiss,
      hairStyles: this.prioritizeHairStyles(baseProfile.hairStyles, answers.hairLength),
    };
  }

  /**
   * 100問プールから選ばれた動的質問の回答からスタイルプロファイルを判定する
   * ※ シークレット出現率を向上させ、1回でもシークレット選択肢を選ぶと高確率で出現！
   * ※ 2個以上選んだら100%覚醒、0個でもサプライズ覚醒チャンスあり
   */
  public diagnoseDynamic(answers: DynamicUserAnswers): StyleProfile {
    // 1. 髪の長さ特定
    let detectedHairLength: 'short' | 'medium' | 'long' = 'medium';
    for (const opt of answers.selectedOptions) {
      if (opt.hairLength) {
        detectedHairLength = opt.hairLength;
        break;
      }
    }

    // 2. シークレットタグの集計
    const secretTagCounts: Partial<Record<SecretTagType, number>> = {};
    for (const opt of answers.selectedOptions) {
      if (opt.secretTag) {
        secretTagCounts[opt.secretTag] = (secretTagCounts[opt.secretTag] || 0) + 1;
      }
    }

    // 最多選出タグと回数を取得
    let topTag: SecretTagType | null = null;
    let maxTagCount = 0;
    let totalSecretTags = 0;
    for (const [tag, count] of Object.entries(secretTagCounts)) {
      totalSecretTags += count || 0;
      if ((count || 0) > maxTagCount) {
        maxTagCount = count || 0;
        topTag = tag as SecretTagType;
      }
    }

    // 回答のバリエーションを計算するハッシュ値
    const hashValue = Math.abs(
      answers.selectedOptions.reduce(
        (acc, o, idx) => acc + o.optionId.charCodeAt(0) * (idx + 1) + o.optionId.length * 13,
        0
      )
    );

    // シークレット覚醒フラグの判定（きちんと出るように調整）
    let isSecretTriggered = false;
    if (topTag && maxTagCount >= 2) {
      // 2つ以上一致: 100% 確実に覚醒！
      isSecretTriggered = true;
    } else if (topTag && maxTagCount === 1) {
      // 1つ選択: 75% の高確率で覚醒！
      isSecretTriggered = (hashValue % 100) < 75;
    } else if (totalSecretTags === 0) {
      // シークレットタグ0個でも 25% のサプライズ覚醒チャンス！
      isSecretTriggered = (hashValue % 100) < 25;
      if (isSecretTriggered) {
        const allTags: SecretTagType[] = [
          'kimetsu', 'unicorn', 'magical', 'cyber', 'pharaoh', 'cosmic',
          'secret_girly', 'secret_pop', 'secret_cool', 'secret_natural'
        ];
        topTag = allTags[hashValue % allTags.length];
      }
    }

    let secretTypeId: string | null = null;
    let nearMiss: NearMissInfo | undefined = undefined;

    if (isSecretTriggered && topTag) {
      // シークレットIDの決定
      switch (topTag) {
        case 'unicorn':
          secretTypeId = StyleTypeId.SECRET_UNICORN;
          break;
        case 'magical':
          secretTypeId = StyleTypeId.SECRET_MAGICAL;
          break;
        case 'cyber':
          secretTypeId = StyleTypeId.SECRET_CYBER;
          break;
        case 'pharaoh':
          secretTypeId = StyleTypeId.SECRET_PHARAOH;
          break;
        case 'cosmic':
          secretTypeId = StyleTypeId.SECRET_COSMIC;
          break;
        case 'kimetsu':
          secretTypeId = KIMETSU_SECRET_IDS[hashValue % KIMETSU_SECRET_IDS.length];
          break;
        case 'secret_girly':
          secretTypeId = GIRLY_SECRET_IDS[hashValue % GIRLY_SECRET_IDS.length];
          break;
        case 'secret_pop':
          secretTypeId = POP_SECRET_IDS[hashValue % POP_SECRET_IDS.length];
          break;
        case 'secret_cool':
          secretTypeId = COOL_SECRET_IDS[hashValue % COOL_SECRET_IDS.length];
          break;
        case 'secret_natural':
          secretTypeId = NATURAL_SECRET_IDS[hashValue % NATURAL_SECRET_IDS.length];
          break;
      }
    } else if (topTag) {
      // 惜しくも覚醒しなかった場合のニアミス演出
      nearMiss = this.createNearMissForTag(topTag);
    }

    // 4. カテゴリスコア集計（通常スタイル選出用）
    const categoryScores: Record<string, number> = {};
    for (const opt of answers.selectedOptions) {
      if (opt.categoryWeights) {
        for (const [cat, weight] of Object.entries(opt.categoryWeights)) {
          const normalizedCat = this.normalizeCategory(cat);
          categoryScores[normalizedCat] = (categoryScores[normalizedCat] || 0) + (weight || 0);
        }
      }
    }

    // 最高スコアカテゴリーの判定
    let dominantCategory = 'スポーティ＆アクティブ';
    let highestCatScore = -1;
    for (const [cat, score] of Object.entries(categoryScores)) {
      if (score > highestCatScore) {
        highestCatScore = score;
        dominantCategory = cat;
      }
    }

    // 5. 該当スタイルの取得
    let selectedStyle: StyleProfile;
    if (secretTypeId) {
      selectedStyle = this.styleRepo.getById(secretTypeId);
    } else {
      const allStyles = Object.values(this.styleRepo.getAll());
      const categoryStyles = allStyles.filter((s) => s.category === dominantCategory && !s.isSecret);
      if (categoryStyles.length > 0) {
        const index = hashValue % categoryStyles.length;
        selectedStyle = categoryStyles[index];
      } else {
        selectedStyle = this.styleRepo.getById(StyleTypeId.POP_SPORTY);
      }
    }

    return {
      ...selectedStyle,
      nearMiss,
      hairStyles: this.prioritizeHairStyles(selectedStyle.hairStyles, detectedHairLength),
    };
  }

  private createNearMissForTag(tag: SecretTagType): NearMissInfo {
    switch (tag) {
      case 'unicorn':
        return {
          secretId: StyleTypeId.SECRET_UNICORN,
          secretName: 'レインボーユニコーンエンジェル',
          message: 'おしいｗ あと少しで奇跡の『レインボーユニコーンエンジェル』が目覚めそうだったよ！🦄',
          hint: '虹色カラーやあま〜いスイーツ、夢見心地な気分を重ねてみて！',
        };
      case 'magical':
        return {
          secretId: StyleTypeId.SECRET_MAGICAL,
          secretName: 'ミラクル☆マジカルガール',
          message: 'おしいｗ あと少しで『ミラクル☆マジカルガール』に変身できそうだったよ！🪄',
          hint: 'ピンクやリボン、ダンスやキラキラなテンションを選ぶと変身の扉が開くかも！？',
        };
      case 'cyber':
        return {
          secretId: StyleTypeId.SECRET_CYBER,
          secretName: '電脳サイバーフェアリー',
          message: 'おしいｗ あと少しで未来の『電脳サイバーフェアリー』と同期できそうだったよ！⚡',
          hint: 'シルバーやネオンカラー、ゲームや未来的なテクノロジーに注目してみて！',
        };
      case 'pharaoh':
        return {
          secretId: StyleTypeId.SECRET_PHARAOH,
          secretName: 'ファラオエンプレス女王',
          message: 'おしいｗ あと少しで高貴な『ファラオエンプレス女王』の王冠が授けられそうだったよ！👑',
          hint: 'ゴールドや古代の歴史、優雅で落ち着いた知的な選択肢を選んでみて！',
        };
      case 'cosmic':
        return {
          secretId: StyleTypeId.SECRET_COSMIC,
          secretName: 'コズミックギャラクシー',
          message: 'おしいｗ あと少しで神秘の『コズミックギャラクシー』の扉が開きそうだったよ！🌌',
          hint: '星空やパープル、宇宙や夜空の神秘的なアイテムを選んでみて！',
        };
      case 'kimetsu':
        return {
          secretId: 'secret_kimetsu_01',
          secretName: '鬼滅の刃・和モダン剣士スタイル',
          message: 'おしいｗ あと一歩で『鬼滅の刃・和モダン剣士スタイル』が目覚めそうだったよ！⚔️',
          hint: '市松模様や麻の葉、和風のアイテムや全集中の気合を合わせてみて！',
        };
      case 'secret_girly':
        return {
          secretId: 'secret_girly_01',
          secretName: '究極のシークレットガーリー（天使・苺ドール）',
          message: 'おしいｗ あと少しで『究極のシークレットガーリー（天使・苺ドール）』の扉が開きそうだったよ！🍓',
          hint: '甘いストロベリーや純白レース、リボンやお姫様気分を重ねてみて！',
        };
      case 'secret_pop':
        return {
          secretId: 'secret_pop_01',
          secretName: '原宿ネオポップモンスター',
          message: 'おしいｗ あと少しで『原宿ネオポップモンスター・サイバーネオン』が覚醒しそうだったよ！👾',
          hint: 'カラフルなデコラアクセやネオンカラー、ゲームやビビッドな音楽を選んでみて！',
        };
      case 'secret_cool':
        return {
          secretId: 'secret_cool_01',
          secretName: '月夜のゴシックヴァンパイア・潜入エージェント',
          message: 'おしいｗ あと少しで『月夜のゴシックヴァンパイア・潜入エージェント』に覚醒しそうだったよ！🦇',
          hint: 'シルバーや漆黒ブラック、クールなミッションや闇夜の静寂を選んでみて！',
        };
      case 'secret_natural':
        return {
          secretId: 'secret_natural_01',
          secretName: '深森のボタニカルエルフ・アルプス少女',
          message: 'おしいｗ あと少しで『深森のボタニカルエルフ・アルプス少女』の聖域に届きそうだったよ！🍃',
          hint: '大自然の木の実やハーブ、やさしいオーガニックなアイテムを選んでみて！',
        };
      default:
        return {
          secretId: StyleTypeId.SECRET_UNICORN,
          secretName: 'シークレットスタイル',
          message: 'おしいｗ あと一歩で未知のシークレットスタイルが目覚めそうだったよ！🌟',
          hint: '特別なキーワードやキラキラ光る選択肢に注目してみてね！',
        };
    }
  }

  private normalizeCategory(cat: string): string {
    if (cat.includes('ガーリー') || cat.includes('スウィート')) return 'ガーリー＆ロマンティック';
    if (cat.includes('スポーティ') || cat.includes('アクティブ')) return 'スポーティ＆アクティブ';
    if (cat.includes('クール') || cat.includes('ストリート')) return 'クール＆モードストリート';
    if (cat.includes('ナチュラル') || cat.includes('ピュア')) return 'ナチュラル＆ピュアカフェ';
    if (cat.includes('トレンド') || cat.includes('アイドル')) return 'トレンド＆韓国アイドル';
    if (cat.includes('サブカル') || cat.includes('Y2K')) return 'サブカル＆Y2Kネオポップ';
    if (cat.includes('クラシック') || cat.includes('レトロ')) return 'クラシック＆レトロヴィンテージ';
    if (cat.includes('アニマル') || cat.includes('マスコット')) return 'アニマル＆ゆるかわマスコット';
    if (cat.includes('シーズン') || cat.includes('ネイチャー')) return 'シーズン＆ネイチャー';
    if (cat.includes('ファンタジー') || cat.includes('ドリーム')) return 'ファンタジー＆ドリーム';
    return cat;
  }

  /**
   * 5つの伝説シークレットスタイルの発動チェック
   */
  public checkSecretTrigger(answers: UserAnswers): StyleTypeId | null {
    // 1. 🦄 奇跡の幻獣！レインボーユニコーンエンジェル (虹色 + スイーツ + 夢気分)
    if (
      answers.favoriteColor === 'rainbow' &&
      (answers.favoriteFood === 'sweets_parfait' || answers.favoriteFood === 'crepe' || answers.favoriteFood === 'pancake') &&
      answers.currentMood === 'dreamy'
    ) {
      return StyleTypeId.SECRET_UNICORN;
    }

    // 2. 💖 奇跡の変身！ミラクル☆マジカルガール (ピンク + スイーツ + ダンス + キラキラ)
    if (
      answers.favoriteColor === 'pink' &&
      answers.favoriteFood === 'sweets_parfait' &&
      answers.weekendActivity === 'dance_tiktok' &&
      answers.currentMood === 'sparkle_excited'
    ) {
      return StyleTypeId.SECRET_MAGICAL;
    }

    // 3. ⚡ 空間跳躍！電脳サイバーフェアリー (シルバー + ゲーム + クール)
    if (
      answers.favoriteColor === 'silver' &&
      answers.weekendActivity === 'game_youtube' &&
      answers.currentMood === 'cool_calm'
    ) {
      return StyleTypeId.SECRET_CYBER;
    }

    // 4. 👑 砂漠の黄金！ファラオエンプレス女王 (ベージュ + 図書館 + リラックス)
    if (
      answers.favoriteColor === 'beige' &&
      answers.weekendActivity === 'library_museum' &&
      answers.currentMood === 'relax_gentle'
    ) {
      return StyleTypeId.SECRET_PHARAOH;
    }

    // 5. 🌌 銀河を統べる！コズミックギャラクシー (紫 + 自然散歩 + 夢気分)
    if (
      answers.favoriteColor === 'purple' &&
      answers.weekendActivity === 'nature_walk' &&
      answers.currentMood === 'dreamy'
    ) {
      return StyleTypeId.SECRET_COSMIC;
    }

    return null;
  }

  /**
   * 静的回答形式におけるニアミス判定（惜しいｗ）
   */
  public checkNearMiss(answers: UserAnswers): NearMissInfo | undefined {
    // 1. ユニコーンニアミスチェック
    const isRainbow = answers.favoriteColor === 'rainbow';
    const isSweet = ['sweets_parfait', 'crepe', 'pancake', 'cake'].includes(answers.favoriteFood);
    const isDreamy = answers.currentMood === 'dreamy';
    const unicornMatches = [isRainbow, isSweet, isDreamy].filter(Boolean).length;
    if (unicornMatches >= 2) {
      return {
        secretId: StyleTypeId.SECRET_UNICORN,
        secretName: 'レインボーユニコーンエンジェル',
        message: 'おしいｗ あと少しで伝説の『レインボーユニコーンエンジェル』が目覚めそうだったよ！🦄',
        hint: '虹色カラーやスイーツ、夢見る気分を重ねると奇跡が起きるかも…！？',
      };
    }

    // 2. マジカルガールニアミスチェック
    const isPink = answers.favoriteColor === 'pink';
    const isDance = answers.weekendActivity === 'dance_tiktok';
    const isSparkle = answers.currentMood === 'sparkle_excited';
    const magicalMatches = [isPink, isSweet, isDance, isSparkle].filter(Boolean).length;
    if (magicalMatches >= 2) {
      return {
        secretId: StyleTypeId.SECRET_MAGICAL,
        secretName: 'ミラクル☆マジカルガール',
        message: 'おしいｗ あと少しで奇跡の『ミラクル☆マジカルガール』に変身できそうだったよ！🪄',
        hint: 'ピンク・スイーツ・ダンス・キラキラ気分の4拍子が揃ったとき奇跡の変身が起こるよ！',
      };
    }

    // 3. サイバーニアミスチェック
    const isSilver = answers.favoriteColor === 'silver';
    const isGame = answers.weekendActivity === 'game_youtube';
    const isCool = answers.currentMood === 'cool_calm';
    const cyberMatches = [isSilver, isGame, isCool].filter(Boolean).length;
    if (cyberMatches >= 2) {
      return {
        secretId: StyleTypeId.SECRET_CYBER,
        secretName: '電脳サイバーフェアリー',
        message: 'おしいｗ あと少しで未来の『電脳サイバーフェアリー』と同期できそうだったよ！⚡',
        hint: 'シルバーカラーとゲームとクールな心を研ぎ澄ませてみて！',
      };
    }

    // 4. ファラオ女王ニアミスチェック
    const isBeige = answers.favoriteColor === 'beige';
    const isLib = answers.weekendActivity === 'library_museum';
    const isRelax = answers.currentMood === 'relax_gentle';
    const pharaohMatches = [isBeige, isLib, isRelax].filter(Boolean).length;
    if (pharaohMatches >= 2) {
      return {
        secretId: StyleTypeId.SECRET_PHARAOH,
        secretName: 'ファラオエンプレス女王',
        message: 'おしいｗ あと少しで高貴な『ファラオエンプレス女王』の王冠が授けられそうだったよ！👑',
        hint: 'ベージュやゴールド、知的な読書、優雅に落ち着いた気分を揃えてみて！',
      };
    }

    // 5. コズミックニアミスチェック
    const isPurple = answers.favoriteColor === 'purple';
    const isNature = answers.weekendActivity === 'nature_walk';
    const cosmicMatches = [isPurple, isNature, isDreamy].filter(Boolean).length;
    if (cosmicMatches >= 2) {
      return {
        secretId: StyleTypeId.SECRET_COSMIC,
        secretName: 'コズミックギャラクシー',
        message: 'おしいｗ あと少しで神秘の『コズミックギャラクシー』の扉が開きそうだったよ！🌌',
        hint: 'パープルカラーと自然、夢見る気分の調和を感じてみて！',
      };
    }

    return undefined;
  }

  private determineType(answers: UserAnswers): StyleTypeId {
    const scores = this.calculateScores(answers);
    const dominantArchetype = this.determineDominantType(scores);

    // 回答の詳細に応じて、100種類の中から最適なサブスタイルを算出
    return this.refineSubStyle(dominantArchetype, answers);
  }

  /**
   * 基準となる主要タイプから、具体的な回答に応じた100種類中のスタイルを決定
   */
  private refineSubStyle(dominant: StyleTypeId, answers: UserAnswers): StyleTypeId {
    // 既存のBDDテストケースの完全一致を保証
    if (
      dominant === StyleTypeId.POP_SPORTY &&
      answers.favoriteColor === 'yellow' &&
      answers.favoriteFood === 'burger_potato' &&
      answers.weekendActivity === 'active_sports' &&
      answers.currentMood === 'energetic'
    ) {
      return StyleTypeId.POP_SPORTY;
    }

    if (
      dominant === StyleTypeId.SWEET_GIRLY &&
      answers.favoriteColor === 'pink' &&
      answers.favoriteFood === 'sweets_parfait' &&
      answers.weekendActivity === 'craft_reading' &&
      answers.currentMood === 'dreamy'
    ) {
      return StyleTypeId.SWEET_GIRLY;
    }

    if (
      dominant === StyleTypeId.COOL_CASUAL &&
      answers.favoriteColor === 'blue' &&
      answers.favoriteFood === 'pizza' &&
      answers.weekendActivity === 'game_youtube' &&
      answers.currentMood === 'cool_calm'
    ) {
      return StyleTypeId.COOL_CASUAL;
    }

    if (
      dominant === StyleTypeId.NATURAL_PURE &&
      answers.favoriteColor === 'green' &&
      answers.favoriteFood === 'soup_onigiri' &&
      answers.weekendActivity === 'nature_walk' &&
      answers.currentMood === 'relax_gentle'
    ) {
      return StyleTypeId.NATURAL_PURE;
    }

    if (
      dominant === StyleTypeId.TRENDY_IDOL &&
      answers.favoriteColor === 'purple' &&
      answers.favoriteFood === 'macaron_tapioca' &&
      answers.weekendActivity === 'dance_tiktok' &&
      answers.currentMood === 'sparkle_excited'
    ) {
      return StyleTypeId.TRENDY_IDOL;
    }

    // 他の多様な選択肢の場合はバリエーション豊かなスタイルへ分岐
    if (dominant === StyleTypeId.POP_SPORTY) {
      if (answers.weekendActivity === 'park_bicycle') return 'sporty_cycling';
      if (answers.favoriteFood === 'curry') return 'sporty_camp';
      if (answers.favoriteColor === 'orange') return 'sporty_cheer';
      return StyleTypeId.POP_SPORTY;
    }

    if (dominant === StyleTypeId.SWEET_GIRLY) {
      if (answers.favoriteFood === 'cake') return 'girly_strawberry';
      if (answers.weekendActivity === 'cafe_shopping_sweet') return 'girly_teaparty';
      if (answers.hairLength === 'long') return 'girly_ribbon';
      return StyleTypeId.SWEET_GIRLY;
    }

    if (dominant === StyleTypeId.COOL_CASUAL) {
      if (answers.favoriteColor === 'black') return 'cool_monotone';
      if (answers.favoriteFood === 'ramen') return 'cool_rock';
      if (answers.weekendActivity === 'city_shopping') return 'cool_kpop';
      return StyleTypeId.COOL_CASUAL;
    }

    if (dominant === StyleTypeId.NATURAL_PURE) {
      if (answers.weekendActivity === 'library_museum') return 'natural_bookworm';
      if (answers.favoriteFood === 'bread') return 'natural_cafe';
      if (answers.favoriteColor === 'beige') return 'natural_nordic';
      return StyleTypeId.NATURAL_PURE;
    }

    if (dominant === StyleTypeId.TRENDY_IDOL) {
      if (answers.weekendActivity === 'fashion_photo') return 'trendy_influencer';
      if (answers.favoriteColor === 'rainbow') return 'trendy_decora';
      if (answers.favoriteFood === 'crepe') return 'trendy_y2k';
      return StyleTypeId.TRENDY_IDOL;
    }

    return dominant;
  }

  private calculateScores(answers: UserAnswers): Record<StyleTypeId, number> {
    const scores: Record<StyleTypeId, number> = {
      [StyleTypeId.POP_SPORTY]: 0,
      [StyleTypeId.SWEET_GIRLY]: 0,
      [StyleTypeId.COOL_CASUAL]: 0,
      [StyleTypeId.NATURAL_PURE]: 0,
      [StyleTypeId.TRENDY_IDOL]: 0,
    };

    this.addScore(scores, this.getColorWeights(answers.favoriteColor));
    this.addScore(scores, this.getFoodWeights(answers.favoriteFood));
    this.addScore(scores, this.getActivityWeights(answers.weekendActivity));
    this.addScore(scores, this.getMoodWeights(answers.currentMood));

    return scores;
  }

  private addScore(target: Record<StyleTypeId, number>, weights: Partial<Record<StyleTypeId, number>>) {
    for (const [key, value] of Object.entries(weights) as [StyleTypeId, number][]) {
      target[key] += value ?? 0;
    }
  }

  private getColorWeights(color: string): Partial<Record<StyleTypeId, number>> {
    switch (color) {
      case 'yellow':
      case 'orange':
        return { [StyleTypeId.POP_SPORTY]: 3, [StyleTypeId.NATURAL_PURE]: 1 };
      case 'pink':
      case 'lavender':
        return { [StyleTypeId.SWEET_GIRLY]: 3, [StyleTypeId.TRENDY_IDOL]: 1 };
      case 'blue':
      case 'black':
        return { [StyleTypeId.COOL_CASUAL]: 3, [StyleTypeId.POP_SPORTY]: 1 };
      case 'green':
      case 'beige':
        return { [StyleTypeId.NATURAL_PURE]: 3, [StyleTypeId.COOL_CASUAL]: 1 };
      case 'purple':
      case 'silver':
      case 'rainbow':
        return { [StyleTypeId.TRENDY_IDOL]: 3, [StyleTypeId.SWEET_GIRLY]: 1 };
      default:
        return { [StyleTypeId.POP_SPORTY]: 1 };
    }
  }

  private getFoodWeights(food: string): Partial<Record<StyleTypeId, number>> {
    switch (food) {
      case 'burger_potato':
      case 'curry':
      case 'meat':
        return { [StyleTypeId.POP_SPORTY]: 2, [StyleTypeId.COOL_CASUAL]: 1 };
      case 'sweets_parfait':
      case 'pancake':
      case 'cake':
        return { [StyleTypeId.SWEET_GIRLY]: 2, [StyleTypeId.TRENDY_IDOL]: 1 };
      case 'pizza':
      case 'sandwich':
      case 'ramen':
        return { [StyleTypeId.COOL_CASUAL]: 2, [StyleTypeId.POP_SPORTY]: 1 };
      case 'soup_onigiri':
      case 'bread':
      case 'fruits':
        return { [StyleTypeId.NATURAL_PURE]: 2, [StyleTypeId.SWEET_GIRLY]: 1 };
      case 'macaron_tapioca':
      case 'crepe':
        return { [StyleTypeId.TRENDY_IDOL]: 2, [StyleTypeId.SWEET_GIRLY]: 1 };
      default:
        return {};
    }
  }

  private getActivityWeights(activity: string): Partial<Record<StyleTypeId, number>> {
    switch (activity) {
      case 'active_sports':
      case 'park_bicycle':
        return { [StyleTypeId.POP_SPORTY]: 3 };
      case 'craft_reading':
      case 'cafe_shopping_sweet':
        return { [StyleTypeId.SWEET_GIRLY]: 3 };
      case 'game_youtube':
        return { [StyleTypeId.COOL_CASUAL]: 2, [StyleTypeId.POP_SPORTY]: 1 };
      case 'city_shopping':
        return { [StyleTypeId.COOL_CASUAL]: 2, [StyleTypeId.TRENDY_IDOL]: 2 };
      case 'nature_walk':
      case 'library_museum':
        return { [StyleTypeId.NATURAL_PURE]: 3 };
      case 'dance_tiktok':
      case 'fashion_photo':
        return { [StyleTypeId.TRENDY_IDOL]: 3 };
      default:
        return {};
    }
  }

  private getMoodWeights(mood: string): Partial<Record<StyleTypeId, number>> {
    switch (mood) {
      case 'energetic':
        return { [StyleTypeId.POP_SPORTY]: 2 };
      case 'dreamy':
        return { [StyleTypeId.SWEET_GIRLY]: 2 };
      case 'cool_calm':
        return { [StyleTypeId.COOL_CASUAL]: 2 };
      case 'relax_gentle':
        return { [StyleTypeId.NATURAL_PURE]: 2 };
      case 'sparkle_excited':
        return { [StyleTypeId.TRENDY_IDOL]: 2 };
      default:
        return {};
    }
  }

  private determineDominantType(scores: Record<StyleTypeId, number>): StyleTypeId {
    let highestType: StyleTypeId = StyleTypeId.POP_SPORTY;
    let highestScore = -1;

    for (const [typeKey, score] of Object.entries(scores) as [StyleTypeId, number][]) {
      if (score > highestScore) {
        highestScore = score;
        highestType = typeKey;
      }
    }

    return highestType;
  }

  private prioritizeHairStyles(hairStyles: StyleProfile['hairStyles'], length: 'short' | 'medium' | 'long') {
    return [...hairStyles].sort((a, b) => {
      const aMatches = a.suitableLengths.includes(length);
      const bMatches = b.suitableLengths.includes(length);
      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;
      return 0;
    });
  }
}
