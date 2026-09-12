import { StyleProfile, HairStyle, FashionCoord, ColorPaletteItem } from '../../domain/models/StyleTypes';

export interface RawStyleItem {
  id: string;
  name: string;
  catchphrase: string;
  description: string;
  category: string;
  categoryIcon: string;
  isSecret?: boolean;
  secretHint?: string;
  traits: [string, string, string];
  colors: { name: string; hex: string; desc: string }[];
  luckyFood: string;
  luckyItem: string;
  hairSchool: {
    name: string;
    tagline: string;
    difficulty: 'かんたん' | 'ふつう' | 'ちょっとチャレンジ';
    duration: number;
    suitableLengths: ('short' | 'medium' | 'long')[];
    steps: { title: string; instruction: string }[];
  };
  hairWeekend: {
    name: string;
    tagline: string;
    difficulty: 'かんたん' | 'ふつう' | 'ちょっとチャレンジ';
    duration: number;
    suitableLengths: ('short' | 'medium' | 'long')[];
    steps: { title: string; instruction: string }[];
  };
  fashionSchool: {
    title: string;
    summary: string;
    top: string;
    bottom: string;
    shoes: string;
  };
  fashionWeekend: {
    title: string;
    summary: string;
    top: string;
    bottom: string;
    shoes: string;
  };
}

export function buildStyleProfile(raw: RawStyleItem): StyleProfile {
  const recommendedColors: ColorPaletteItem[] = raw.colors.map((c, i) => ({
    id: `${raw.id}_c${i + 1}`,
    name: c.name,
    hex: c.hex,
    description: c.desc,
    isLuckyColor: i === 0,
  }));

  const hairStyles: HairStyle[] = [
    {
      id: `${raw.id}_hair_school`,
      name: raw.hairSchool.name,
      tagline: raw.hairSchool.tagline,
      difficulty: raw.hairSchool.difficulty,
      durationMinutes: raw.hairSchool.duration,
      suitableLengths: raw.hairSchool.suitableLengths,
      isSchoolOk: true,
      itemsNeeded: ['ヘアゴム', 'くし/ブラシ'],
      steps: raw.hairSchool.steps.map((s, idx) => ({
        stepNumber: idx + 1,
        title: s.title,
        instruction: s.instruction,
      })),
    },
    {
      id: `${raw.id}_hair_weekend`,
      name: raw.hairWeekend.name,
      tagline: raw.hairWeekend.tagline,
      difficulty: raw.hairWeekend.difficulty,
      durationMinutes: raw.hairWeekend.duration,
      suitableLengths: raw.hairWeekend.suitableLengths,
      isSchoolOk: false,
      itemsNeeded: ['お気に入りヘアアクセ', 'ヘアゴム', 'ヘアピン'],
      steps: raw.hairWeekend.steps.map((s, idx) => ({
        stepNumber: idx + 1,
        title: s.title,
        instruction: s.instruction,
      })),
    },
  ];

  const schoolFashion: FashionCoord = {
    id: `${raw.id}_coord_school`,
    title: raw.fashionSchool.title,
    scene: '通学・学校',
    summary: raw.fashionSchool.summary,
    point: '動きやすさと清潔感を大切にしながら、さりげなく個性を光らせよう！',
    items: [
      { category: 'トップス', name: raw.fashionSchool.top, description: '学校の机でも快適で動きやすい', colorSuggestion: raw.colors[0]?.name || '定番カラー' },
      { category: 'ボトムス/ワンピ', name: raw.fashionSchool.bottom, description: 'ポケット付きでハンカチもしっかり入る', colorSuggestion: raw.colors[1]?.name || '合わせやすいカラー' },
      { category: 'くつ/ソックス', name: raw.fashionSchool.shoes, description: '下駄箱の脱ぎ履きもスムーズなスニーカー', colorSuggestion: raw.colors[2]?.name || '差し色' },
    ],
  };

  const weekendFashion: FashionCoord = {
    id: `${raw.id}_coord_weekend`,
    title: raw.fashionWeekend.title,
    scene: '休日・おでかけ',
    summary: raw.fashionWeekend.summary,
    point: 'お気に入りのアイテムを主役にして、とびきりワクワクする休日に！',
    items: [
      { category: 'トップス', name: raw.fashionWeekend.top, description: '休日の気分を盛り上げるお気に入りの1着', colorSuggestion: raw.colors[0]?.name || '主役カラー' },
      { category: 'ボトムス/ワンピ', name: raw.fashionWeekend.bottom, description: 'シルエットがおしゃれな特別アイテム', colorSuggestion: raw.colors[1]?.name || 'トーンカラー' },
      { category: 'くつ/ソックス', name: raw.fashionWeekend.shoes, description: 'おでかけ先に合わせたおしゃれシューズ', colorSuggestion: raw.colors[2]?.name || 'アクセント' },
    ],
  };

  return {
    typeId: raw.id,
    typeName: raw.name,
    catchphrase: raw.catchphrase,
    description: raw.description,
    category: raw.category,
    categoryIcon: raw.categoryIcon,
    isSecret: raw.isSecret,
    secretHint: raw.secretHint,
    rarity: raw.isSecret ? 'Secret' : 'Normal',
    personalityTraits: [...raw.traits],
    recommendedColors,
    hairStyles,
    schoolFashion,
    weekendFashion,
    luckyFood: raw.luckyFood,
    luckyItem: raw.luckyItem,
  };
}

export interface CompactStyleItem {
  id: string;
  name: string;
  catchphrase: string;
  description: string;
  category: string;
  categoryIcon: string;
  isSecret?: boolean;
  secretHint?: string;
  traits: [string, string, string];
  colors: { name: string; hex: string }[];
  luckyFood: string;
  luckyItem: string;
  hairSchoolName: string;
  hairSchoolTagline: string;
  hairWeekendName: string;
  hairWeekendTagline: string;
  fashionSchoolTop: string;
  fashionSchoolBottom: string;
  fashionSchoolShoes: string;
  fashionWeekendTop: string;
  fashionWeekendBottom: string;
  fashionWeekendShoes: string;
}

export function buildFromCompactStyle(c: CompactStyleItem): StyleProfile {
  const recommendedColors: ColorPaletteItem[] = c.colors.map((col, i) => ({
    id: `${c.id}_c${i + 1}`,
    name: col.name,
    hex: col.hex,
    description: i === 0 ? 'あなたの魅力を最大限に引き出すラッキーカラー！' : `${col.name}でバランスの取れたおしゃれに。`,
    isLuckyColor: i === 0,
  }));

  const hairStyles: HairStyle[] = [
    {
      id: `${c.id}_hair_school`,
      name: c.hairSchoolName,
      tagline: c.hairSchoolTagline,
      difficulty: 'かんたん',
      durationMinutes: 3,
      suitableLengths: ['medium', 'long'],
      isSchoolOk: true,
      itemsNeeded: ['ヘアゴム', 'ブラシ'],
      steps: [
        { stepNumber: 1, title: '手ぐしでまとめる', instruction: '髪全体をブラッシングして結びやすい位置に集めます。' },
        { stepNumber: 2, title: 'ゴムでしっかり結ぶ', instruction: '通学中や体育の授業でも崩れないよう結びます。' },
        { stepNumber: 3, title: 'バランスを整える', instruction: 'トップの髪を少し引き出して自然な立体感を出して完成！' },
      ],
    },
    {
      id: `${c.id}_hair_weekend`,
      name: c.hairWeekendName,
      tagline: c.hairWeekendTagline,
      difficulty: 'ふつう',
      durationMinutes: 5,
      suitableLengths: ['short', 'medium', 'long'],
      isSchoolOk: false,
      itemsNeeded: ['お気に入りヘアアクセ', 'ヘアゴム', 'ピン'],
      steps: [
        { stepNumber: 1, title: 'ベースを整える', instruction: '毛先を軽く巻くか、手ぐしでふんわり動きをつけます。' },
        { stepNumber: 2, title: 'アレンジを施す', instruction: 'お団子や編み込みで休日の特別感を演出します。' },
        { stepNumber: 3, title: 'ヘアアクセをオン', instruction: 'テーマに合わせたアクセサリーを飾って完成！' },
      ],
    },
  ];

  const schoolFashion: FashionCoord = {
    id: `${c.id}_coord_school`,
    title: `${c.categoryIcon} 通学・スクールスタイル`,
    scene: '通学・学校',
    summary: '校則もバッチリ安心！動きやすくて誰からも好印象の通学コーディネート。',
    point: '着心地の良いストレッチ素材とおしゃれなカラー配色がポイント！',
    items: [
      { category: 'トップス', name: c.fashionSchoolTop, description: '机に向かっても動きやすい快適トップス', colorSuggestion: c.colors[0]?.name || 'メインカラー' },
      { category: 'ボトムス/ワンピ', name: c.fashionSchoolBottom, description: 'ポケット付きでハンカチ・ティッシュも安心', colorSuggestion: c.colors[1]?.name || 'サブカラー' },
      { category: 'くつ/ソックス', name: c.fashionSchoolShoes, description: '通学路も走りやすいクッションスニーカー', colorSuggestion: c.colors[2]?.name || 'アクセント' },
    ],
  };

  const weekendFashion: FashionCoord = {
    id: `${c.id}_coord_weekend`,
    title: `${c.categoryIcon} 休日・おでかけスタイル`,
    scene: '休日・おでかけ',
    summary: 'お友達とのおでかけやショッピングで気分最高潮になれる特別コーデ！',
    point: 'トレンドアイテムを主役に、自分らしさを思いっきりアピールしよう！',
    items: [
      { category: 'トップス', name: c.fashionWeekendTop, description: '休日のお出かけ気分を盛り上げるお気に入りトップス', colorSuggestion: c.colors[0]?.name || '主役カラー' },
      { category: 'ボトムス/ワンピ', name: c.fashionWeekendBottom, description: '写真映えバツグンのおしゃれシルエットボトムス', colorSuggestion: c.colors[1]?.name || 'トーンカラー' },
      { category: 'くつ/ソックス', name: c.fashionWeekendShoes, description: 'おでかけ先でも疲れにくいおしゃれシューズ', colorSuggestion: c.colors[2]?.name || 'ポイントカラー' },
    ],
  };

  return {
    typeId: c.id,
    typeName: c.name,
    catchphrase: c.catchphrase,
    description: c.description,
    category: c.category,
    categoryIcon: c.categoryIcon,
    isSecret: c.isSecret,
    secretHint: c.secretHint,
    rarity: c.isSecret ? 'Secret' : 'Normal',
    personalityTraits: [...c.traits],
    recommendedColors,
    hairStyles,
    schoolFashion,
    weekendFashion,
    luckyFood: c.luckyFood,
    luckyItem: c.luckyItem,
  };
}

