export type StyleTypeId = string;

export const StyleTypeId = {
  POP_SPORTY: 'pop_sporty',
  SWEET_GIRLY: 'sweet_girly',
  COOL_CASUAL: 'cool_casual',
  NATURAL_PURE: 'natural_pure',
  TRENDY_IDOL: 'trendy_idol',
  // 5 Secret Styles
  SECRET_MAGICAL: 'secret_magical',
  SECRET_CYBER: 'secret_cyber',
  SECRET_PHARAOH: 'secret_pharaoh',
  SECRET_COSMIC: 'secret_cosmic',
  SECRET_UNICORN: 'secret_unicorn',
} as const;

export interface ColorPaletteItem {
  id: string;
  name: string;
  hex: string;
  description: string;
  isLuckyColor?: boolean;
}

export interface HairStyleStep {
  stepNumber: number;
  title: string;
  instruction: string;
  tip?: string;
}

export interface HairStyle {
  id: string;
  name: string;
  tagline: string;
  difficulty: 'かんたん' | 'ふつう' | 'ちょっとチャレンジ';
  durationMinutes: number;
  suitableLengths: ('short' | 'medium' | 'long')[];
  isSchoolOk: boolean;
  steps: HairStyleStep[];
  itemsNeeded: string[];
  imageUrl?: string;
  accentBadge?: string;
}

export interface FashionItem {
  category: 'トップス' | 'ボトムス/ワンピ' | 'アウター' | 'くつ/ソックス' | '小物/アクセ';
  name: string;
  description: string;
  colorSuggestion: string;
}

export interface FashionCoord {
  id: string;
  title: string;
  scene: '通学・学校' | '休日・おでかけ' | 'イベント・おめかし';
  summary: string;
  items: FashionItem[];
  point: string;
  imageUrl?: string;
}

export interface StyleProfile {
  typeId: StyleTypeId;
  typeName: string;
  catchphrase: string;
  description: string;
  category: string;
  categoryIcon?: string;
  isSecret?: boolean;
  secretHint?: string;
  rarity?: 'Normal' | 'Rare' | 'Secret';
  personalityTraits: string[];
  recommendedColors: ColorPaletteItem[];
  hairStyles: HairStyle[];
  schoolFashion: FashionCoord;
  weekendFashion: FashionCoord;
  luckyFood: string;
  luckyItem: string;
  imageUrl?: string;
}

