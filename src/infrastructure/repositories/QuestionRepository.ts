export interface QuestionOption {
  id: string;
  label: string;
  subtitle?: string;
  emoji: string;
  colorCode?: string;
}

export interface DiagnosisQuestion {
  id: 'favoriteColor' | 'favoriteFood' | 'weekendActivity' | 'currentMood' | 'hairLength';
  stepNumber: number;
  questionText: string;
  description: string;
  options: QuestionOption[];
}

export const DIAGNOSIS_QUESTIONS: DiagnosisQuestion[] = [
  {
    id: 'favoriteColor',
    stepNumber: 1,
    questionText: 'いちばん大すきな色はどれ？',
    description: '直感で「これ！」と思う色をえらんでね',
    options: [
      { id: 'yellow', label: 'あかるい黄色・元気オレンジ', subtitle: '太陽みたいにポカポカ！', emoji: '☀️', colorCode: '#FBBF24' },
      { id: 'pink', label: 'スウィートピンク・パステル', subtitle: 'お花畑やお菓子みたい！', emoji: '🌸', colorCode: '#F472B6' },
      { id: 'blue', label: 'さわやかブルー・かっこいい黒', subtitle: '空や海のようにすっきり！', emoji: '🌊', colorCode: '#38BDF8' },
      { id: 'green', label: 'やさしい若草グリーン・ベージュ', subtitle: '森や自然の癒やしカラー！', emoji: '🍀', colorCode: '#84CC16' },
      { id: 'purple', label: 'きらきらパープル・オーロラ', subtitle: '魔法使いやアイドルみたい！', emoji: '✨', colorCode: '#C084FC' },
    ],
  },
  {
    id: 'favoriteFood',
    stepNumber: 2,
    questionText: '大すきな食べものはどれ？',
    description: 'いま食べたいメニューを選んでね！',
    options: [
      { id: 'burger_potato', label: 'ジューシーハンバーグ＆ポテト', subtitle: 'みんな大すき！元気の源！', emoji: '🍔' },
      { id: 'sweets_parfait', label: 'いちごパフェ＆ふわふわパンケーキ', subtitle: '甘くてかわいいスイーツ！', emoji: '🥞' },
      { id: 'pizza', label: '焼きたてピザ＆具だくさんサンド', subtitle: 'サクッとおいしいごちそう！', emoji: '🍕' },
      { id: 'soup_onigiri', label: '具だくさんスープ＆おにぎり', subtitle: 'ほっこりお腹にしみる味！', emoji: '🍙' },
      { id: 'macaron_tapioca', label: 'カラフルマカロン＆タピオカ', subtitle: '映えてかわいいトレンドおやつ！', emoji: '🧋' },
    ],
  },
  {
    id: 'weekendActivity',
    stepNumber: 3,
    questionText: '休みの日は何をしてあそぶのが好き？',
    description: 'いちばんワクワクする過ごし方は？',
    options: [
      { id: 'active_sports', label: '公園で鬼ごっこや自転車・スポーツ！', subtitle: '外で思いっきり体を動かす！', emoji: '🚲' },
      { id: 'craft_reading', label: 'おうちでお絵かき・工作やかわいい小物集め', subtitle: 'じっくり作品をつくるのが好き！', emoji: '🎨' },
      { id: 'game_youtube', label: 'ゲームで対戦や動画チェック・お買い物', subtitle: 'マイペースにトレンドを楽しむ！', emoji: '🎮' },
      { id: 'nature_walk', label: '図書館で本を読んだり自然をお散歩', subtitle: '穏やかにリフレッシュ！', emoji: '📚' },
      { id: 'dance_tiktok', label: 'ダンスの練習やお気に入りの服でポーズ！', subtitle: '音楽に合わせてノリノリ！', emoji: '💃' },
    ],
  },
  {
    id: 'currentMood',
    stepNumber: 4,
    questionText: '今日のきぶんはどんな感じ？',
    description: '今の気分にいちばん近いものを選んでね',
    options: [
      { id: 'energetic', label: '元気ハッピー！走り回りたい気分！', subtitle: 'エネルギーまんたん！', emoji: '⚡' },
      { id: 'dreamy', label: 'ふわふわ夢心地・お姫さま気分', subtitle: 'かわいい世界にひたりたい！', emoji: '🎀' },
      { id: 'cool_calm', label: '落ち着いてスマートにかっこよく決めたい！', subtitle: 'すっきり大人っぽくいこう！', emoji: '🕶️' },
      { id: 'relax_gentle', label: 'のんびりリラックス・やさしい気持ち', subtitle: '心をおだやかに過ごしたい！', emoji: '🌿' },
      { id: 'sparkle_excited', label: 'キラキラ注目の的！ワクワクどきどき！', subtitle: '主役級に輝きたい！', emoji: '🌟' },
    ],
  },
  {
    id: 'hairLength',
    stepNumber: 5,
    questionText: '今の髪の長さはどれくらい？',
    description: 'あなたの長さにぴったりなヘアアレンジを提案するよ',
    options: [
      { id: 'short', label: 'ショート・ボブ（あご〜肩上）', subtitle: 'すっきり軽やか！ピンアレンジが得意', emoji: '✂️' },
      { id: 'medium', label: 'ミディアム（肩〜鎖骨くらい）', subtitle: '結びやすくてアレンジいろいろ！', emoji: '💁‍♀️' },
      { id: 'long', label: 'ロング（鎖骨より長い）', subtitle: 'おだんごや三つ編みも自由自在！', emoji: '👧' },
    ],
  },
];
