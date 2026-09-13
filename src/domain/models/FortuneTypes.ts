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

export interface DailyFortune {
  dateString: string;
  luckyItem: LuckyItem;
  overallStars: number; // 1 to 5
  fashionLuck: string; // e.g. "いつもと違う色にチャレンジすると大吉！"
  socialLuck: string; // e.g. "笑顔のあいさつで友達と仲良し度アップ！"
  studyLuck: string; // e.g. "お気に入りのペンを使うと集中力アップ！"
  luckyNumber: number;
  luckyStyleId?: string;
}
