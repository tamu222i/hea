export type LuckyItemCategory =
  | 'stationery'
  | 'accessory'
  | 'sweets'
  | 'goods'
  | 'motif'
  | 'action';

export interface LuckyItem {
  id: number;
  name: string;
  category: LuckyItemCategory;
  categoryLabel: string;
  emoji: string;
  luckyColor: string;
  advice: string;
}

/**
 * おみくじの10段階評価グレード
 */
export interface OmikujiGrade {
  level: number; // 1 (大凶/大逆転吉) 〜 10 (大吉)
  name: string; // e.g. "大吉", "中吉", etc.
  reading: string; // e.g. "だいきち"
  badgeColor: string; // e.g. "bg-rose-500 text-white"
  glowColor: string; // e.g. "border-rose-300 shadow-rose-200"
  catchphrase: string; // 短い見出し
  description: string; // おみくじの教え・アドバイス
  score: number; // 100点満点換算
}

export interface DailyFortune {
  dateString: string;
  luckyItem: LuckyItem;
  overallStars: number; // 1 to 5 (or 1 to 10)
  omikuji: OmikujiGrade; // 10段階評価
  fashionLuck: string; // e.g. "いつもと違う色にチャレンジすると大吉！"
  socialLuck: string; // e.g. "笑顔のあいさつで友達と仲良し度アップ！"
  studyLuck: string; // e.g. "お気に入りのペンを使うと集中力アップ！"
  luckyNumber: number;
  luckyStyleId?: string;
}

