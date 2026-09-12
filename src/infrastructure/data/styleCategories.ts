export interface StyleCategoryDef {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  description: string;
}

export const STYLE_CATEGORIES: StyleCategoryDef[] = [
  {
    id: 'sporty',
    name: 'スポーティ＆アクティブ',
    shortName: 'スポーティ',
    icon: '⚡',
    color: '#38BDF8',
    description: '元気いっぱい！走ったり動いたりするのが大すきなアクティブスタイル',
  },
  {
    id: 'girly',
    name: 'ガーリー＆ロマンティック',
    shortName: 'ガーリー',
    icon: '🎀',
    color: '#F472B6',
    description: 'リボンやフリル、お花がたっぷり！お姫様気分の甘めスタイル',
  },
  {
    id: 'cool',
    name: 'クール＆ストリート',
    shortName: 'クール',
    icon: '🎸',
    color: '#64748B',
    description: 'かっこよくてスタイリッシュ！デニムやモノトーンの大人っぽスタイル',
  },
  {
    id: 'natural',
    name: 'ナチュラル＆リラックス',
    shortName: 'ナチュラル',
    icon: '🌿',
    color: '#34D399',
    description: '森や自然のぬくもり。落ち着いたやさしさと清潔感あふれるスタイル',
  },
  {
    id: 'trendy',
    name: 'トレンド＆アイドル',
    shortName: 'トレンド',
    icon: '✨',
    color: '#C084FC',
    description: 'キラキラ主役級！いま流行りの最先端やアイドル風映えスタイル',
  },
  {
    id: 'classic',
    name: 'クラシック＆トラッド',
    shortName: 'トラッド',
    icon: '🎩',
    color: '#818CF8',
    description: '英国スクールやお嬢様風！知的で上品な伝統スタイル',
  },
  {
    id: 'subcul',
    name: 'サブカル＆個性派アート',
    shortName: 'サブカル',
    icon: '🎨',
    color: '#F97316',
    description: 'カラフルで遊び心満点！じぶんだけの特別な個性を表現するスタイル',
  },
  {
    id: 'animal',
    name: 'キュートアニマル',
    shortName: 'アニマル',
    icon: '🐾',
    color: '#FB7185',
    description: 'ねこやうさぎ、こいぬの愛らしさを散りばめた癒やされスタイル',
  },
  {
    id: 'nature',
    name: 'シーズン＆ネイチャー',
    shortName: 'シーズン',
    icon: '🌸',
    color: '#F59E0B',
    description: '桜や青空、夜空、雪の結晶など四季や自然の美しさをまとうスタイル',
  },
  {
    id: 'fantasy',
    name: 'ファンタジー＆ドリーム',
    shortName: 'ファンタジー',
    icon: '🔮',
    color: '#A855F7',
    description: '人魚姫やおとぎ話、星くず魔法のファンタジックスタイル',
  },
  {
    id: 'secret',
    name: '🌟 シークレット (全5種)',
    shortName: 'シークレット',
    icon: '🌟',
    color: '#EAB308',
    description: '特別な組み合わせだけで出現する、伝説の激レアスタイル！',
  },
];
