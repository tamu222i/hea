import { DailyFortune, LuckyItem, OmikujiGrade } from '../models/FortuneTypes';
import { LUCKY_ITEMS_100 } from '../models/luckyItems100';

export const OMIKUJI_10_GRADES: OmikujiGrade[] = [
  {
    level: 10,
    name: '大吉',
    reading: 'だいきち',
    badgeColor: 'bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white',
    glowColor: 'border-rose-400 shadow-rose-200',
    catchphrase: '超最高潮！すべてがキラキラ輝くミラクル大吉！',
    description: 'あなたの魅力が120%輝く最高の運勢！やってみたかったヘアやコーデに思い切って挑戦してみてね！',
    score: 100,
  },
  {
    level: 9,
    name: '中吉',
    reading: 'ちゅうきち',
    badgeColor: 'bg-gradient-to-r from-pink-500 to-rose-400 text-white',
    glowColor: 'border-pink-300 shadow-pink-200',
    catchphrase: '絶好調！笑顔で過ごすだけでハッピー連発♪',
    description: '周りのみんなからも注目される楽しい一日になりそう。笑顔で「おはよう！」と声をかけてみよう！',
    score: 92,
  },
  {
    level: 8,
    name: '小吉',
    reading: 'しょうきち',
    badgeColor: 'bg-gradient-to-r from-amber-500 to-orange-400 text-white',
    glowColor: 'border-amber-300 shadow-amber-200',
    catchphrase: 'ほっこり幸運！小さな幸せをたくさん発見！',
    description: 'お気に入りのお菓子や友達との楽しいおしゃべりなど、嬉しいプチミラクルがいっぱい起こる予感！',
    score: 85,
  },
  {
    level: 7,
    name: '吉',
    reading: 'きち',
    badgeColor: 'bg-gradient-to-r from-emerald-500 to-teal-400 text-white',
    glowColor: 'border-emerald-300 shadow-emerald-200',
    catchphrase: '安定のグッドラック！自然体のあなたが一番ステキ！',
    description: '穏やかで安心できるとても良い日。いつものお気に入りアイテムを持って出かけると運気さらにUP！',
    score: 78,
  },
  {
    level: 6,
    name: '半吉',
    reading: 'はんきち',
    badgeColor: 'bg-gradient-to-r from-cyan-500 to-blue-400 text-white',
    glowColor: 'border-cyan-300 shadow-cyan-200',
    catchphrase: '半分吉！後半に向かってぐんぐん運気上昇！',
    description: '午前中はのんびり準備して、午後から一気に運気が好転！夕方に向けて楽しみなことが待っているよ♪',
    score: 70,
  },
  {
    level: 5,
    name: '末吉',
    reading: 'すえきち',
    badgeColor: 'bg-gradient-to-r from-blue-500 to-indigo-400 text-white',
    glowColor: 'border-blue-300 shadow-blue-200',
    catchphrase: '未来に期待大！これから嬉しい花が咲くよ♪',
    description: '今がんばっている練習や勉強が、近いうちに大きな幸運となって花開くサイン！あきらめずに続けよう！',
    score: 63,
  },
  {
    level: 4,
    name: '末小吉',
    reading: 'すえしょうきち',
    badgeColor: 'bg-gradient-to-r from-indigo-500 to-purple-400 text-white',
    glowColor: 'border-indigo-300 shadow-indigo-200',
    catchphrase: 'コツコツ前進！丁寧なひと工夫でラッキー到来！',
    description: '机の上や持ち物をきれいに整理整頓すると、思わぬ嬉しい発見があるかも！足元のおしゃれも吉◎',
    score: 55,
  },
  {
    level: 3,
    name: '平',
    reading: 'たいら',
    badgeColor: 'bg-gradient-to-r from-purple-500 to-slate-500 text-white',
    glowColor: 'border-purple-300 shadow-purple-200',
    catchphrase: '波風なしの安心日和！マイペースで穏やかに過ごそう！',
    description: '大きなトラブルのない平和な一日。好きな本を読んだり、お気に入りの音楽を聴いてリラックスしてね。',
    score: 48,
  },
  {
    level: 2,
    name: '小凶',
    reading: 'しょうきょう',
    badgeColor: 'bg-gradient-to-r from-slate-600 to-amber-600 text-white',
    glowColor: 'border-amber-400 shadow-amber-200',
    catchphrase: 'ピンチは大チャンス！慎重さが大きな吉を呼ぶ！',
    description: 'うっかり忘れ物に注意すれば大逆転！鏡の前で笑顔の練習をすると、マイナスを吹き飛ばして大吉に変えられるよ！',
    score: 35,
  },
  {
    level: 1,
    name: '大凶',
    reading: 'だいきょう',
    badgeColor: 'bg-gradient-to-r from-purple-800 to-rose-700 text-white',
    glowColor: 'border-purple-500 shadow-purple-200',
    catchphrase: '底を打った！ここからは運気急上昇のみの大逆転チャンス！',
    description: '厄落としはこれでバッチリ完了！あとは上に向かってぐんぐん運気が上がるだけ。ポジティブな言葉を使えば運気爆上がり！',
    score: 20,
  },
];

export class FortuneService {
  /**
   * 全100種類のラッキーアイテムリストを取得
   */
  getAllLuckyItems(): LuckyItem[] {
    return LUCKY_ITEMS_100;
  }

  /**
   * 10段階評価の全おみくじグレードを取得
   */
  getAllOmikujiGrades(): OmikujiGrade[] {
    return OMIKUJI_10_GRADES;
  }

  /**
   * アイテムIDからアイテムを取得
   */
  getItemById(id: number): LuckyItem | undefined {
    return LUCKY_ITEMS_100.find((item) => item.id === id);
  }

  /**
   * 日付ベースのハッシュシードを生成
   */
  private getDateSeed(date: Date = new Date()): number {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return year * 10000 + month * 100 + day;
  }

  /**
   * 簡易ハッシュ関数
   */
  private pseudoRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  /**
   * 今日のデイリー占いを生成（10段階評価つき）
   */
  getDailyFortune(date: Date = new Date()): DailyFortune {
    const seed = this.getDateSeed(date);
    const dateString = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;

    const itemIndex = Math.floor(this.pseudoRandom(seed * 7 + 13) * LUCKY_ITEMS_100.length);
    const luckyItem = LUCKY_ITEMS_100[itemIndex];

    // 10段階評価のおみくじグレードをシードから算出（大吉〜吉がやや出やすい親しみやすい重み付け）
    const gradeRand = this.pseudoRandom(seed * 5 + 17);
    const gradeIndex = Math.floor(gradeRand * OMIKUJI_10_GRADES.length);
    const omikuji = OMIKUJI_10_GRADES[gradeIndex] || OMIKUJI_10_GRADES[0];

    const overallStars = Math.max(1, Math.min(10, omikuji.level));
    const luckyNumber = 1 + Math.floor(this.pseudoRandom(seed * 11 + 5) * 99);

    const fashionAdvices = [
      'いつもと違う色を小物で取り入れると大吉！',
      'お気に入りのヘアアクセをつけると注目度アップ！',
      '清潔感ある着こなしで誰からも好印象間違いなし♪',
      '足元のおしゃれ（靴下やスニーカー）にこだわってみて！',
      'トレンドのシルエットを意識すると自信倍増！',
      '笑顔が最高のアクセサリー！自信を持って堂々とね。',
    ];

    const socialAdvices = [
      '笑顔で「おはよう！」を言うと新しい友達ができるかも！',
      '困っている友達に優しく声をかけると感謝されるよ。',
      '共通の好きなものの話で盛り上がれそう♪',
      '友達の良いところを言葉にして褒めると友情運UP！',
      '聞き上手になると周りから信頼度が急上昇！',
    ];

    const studyAdvices = [
      'お気に入りの文房具を使うと集中力が長続きするよ！',
      '難しい問題もあきらめずに挑戦するとヒントが閃く！',
      'ノートのまとめ方を工夫するとテストの点数UP♪',
      '休み時間にしっかり深呼吸して脳をリフレッシュ！',
      '読書タイムに素敵な言葉やアイデアと出会えそう。',
    ];

    const fIdx = Math.floor(this.pseudoRandom(seed * 17 + 1) * fashionAdvices.length);
    const sIdx = Math.floor(this.pseudoRandom(seed * 19 + 3) * socialAdvices.length);
    const stIdx = Math.floor(this.pseudoRandom(seed * 23 + 9) * studyAdvices.length);

    return {
      dateString,
      luckyItem,
      overallStars,
      omikuji,
      fashionLuck: fashionAdvices[fIdx],
      socialLuck: socialAdvices[sIdx],
      studyLuck: studyAdvices[stIdx],
      luckyNumber,
    };
  }

  /**
   * 5問の質問に回答した結果から、その人だけの10段階おみくじとラッキーアイテムを導出
   */
  getOmikujiForAnswers(
    answeredOptions?: { questionId: string; optionId: string }[],
    styleTypeId?: string,
    styleCategory?: string,
    date: Date = new Date()
  ): DailyFortune {
    const seedDate = this.getDateSeed(date);
    const dateString = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;

    // 5問の回答からハッシュを生成
    let answerHash = 0;
    if (answeredOptions && answeredOptions.length > 0) {
      for (const opt of answeredOptions) {
        const str = `${opt.questionId}_${opt.optionId}`;
        for (let i = 0; i < str.length; i++) {
          answerHash = (answerHash << 5) - answerHash + str.charCodeAt(i);
          answerHash |= 0;
        }
      }
    } else {
      const safeId = styleTypeId || 'default_style';
      for (let i = 0; i < safeId.length; i++) {
        answerHash = (answerHash << 5) - answerHash + safeId.charCodeAt(i);
        answerHash |= 0;
      }
    }

    const combinedSeed = Math.abs(answerHash + seedDate);

    // 10段階評価（大吉〜大凶）の決定
    const gradeIndex = combinedSeed % OMIKUJI_10_GRADES.length;
    const omikuji = OMIKUJI_10_GRADES[gradeIndex];

    // ラッキーアイテム（100種より選出）
    const luckyItem = this.getLuckyItemForStyle(styleTypeId, styleCategory);

    const luckyNumber = (combinedSeed % 99) + 1;

    const fashionAdvices = [
      'いつもと違う色を小物で取り入れると大吉！',
      'お気に入りのヘアアクセをつけると注目度アップ！',
      '清潔感ある着こなしで誰からも好印象間違いなし♪',
      '足元のおしゃれ（靴下やスニーカー）にこだわってみて！',
      'トレンドのシルエットを意識すると自信倍増！',
      '笑顔が最高のアクセサリー！自信を持って堂々とね。',
    ];

    const socialAdvices = [
      '笑顔で「おはよう！」を言うと新しい友達ができるかも！',
      '困っている友達に優しく声をかけると感謝されるよ。',
      '共通の好きなものの話で盛り上がれそう♪',
      '友達の良いところを言葉にして褒めると友情運UP！',
      '聞き上手になると周りから信頼度が急上昇！',
    ];

    const studyAdvices = [
      'お気に入りの文房具を使うと集中力が長続きするよ！',
      '難しい問題もあきらめずに挑戦するとヒントが閃く！',
      'ノートのまとめ方を工夫するとテストの点数UP♪',
      '休み時間にしっかり深呼吸して脳をリフレッシュ！',
      '読書タイムに素敵な言葉やアイデアと出会えそう。',
    ];

    const fIdx = (combinedSeed * 3) % fashionAdvices.length;
    const sIdx = (combinedSeed * 7) % socialAdvices.length;
    const stIdx = (combinedSeed * 11) % studyAdvices.length;

    return {
      dateString,
      luckyItem,
      overallStars: omikuji.level,
      omikuji,
      fashionLuck: fashionAdvices[fIdx],
      socialLuck: socialAdvices[sIdx],
      studyLuck: studyAdvices[stIdx],
      luckyNumber,
      luckyStyleId: styleTypeId,
    };
  }

  /**
   * 診断スタイルに合わせたラッキーアイテムを選出
   */
  getLuckyItemForStyle(styleTypeId?: string, styleCategory?: string): LuckyItem {
    const safeId = styleTypeId || 'default_style';
    // スタイルIDからシードを計算
    let hash = 0;
    for (let i = 0; i < safeId.length; i++) {
      hash = (hash << 5) - hash + safeId.charCodeAt(i);
      hash |= 0;
    }
    const todaySeed = this.getDateSeed();
    const combinedSeed = Math.abs(hash + todaySeed);

    // カテゴリに応じたアイテム優先
    let candidateItems = LUCKY_ITEMS_100;
    if (styleCategory === 'girly') {
      candidateItems = LUCKY_ITEMS_100.filter(
        (i) => i.category === 'accessory' || i.category === 'sweets' || i.category === 'motif'
      );
    } else if (styleCategory === 'casual' || styleCategory === 'sporty') {
      candidateItems = LUCKY_ITEMS_100.filter(
        (i) => i.category === 'action' || i.category === 'goods' || i.category === 'stationery'
      );
    }

    if (candidateItems.length === 0) {
      candidateItems = LUCKY_ITEMS_100;
    }

    const index = combinedSeed % candidateItems.length;
    return candidateItems[index] || LUCKY_ITEMS_100[0];
  }

  /**
   * ランダムなおみくじラッキーアイテムを引く（ガチャモード）
   */
  drawRandomLuckyItem(): LuckyItem {
    const randomIndex = Math.floor(Math.random() * LUCKY_ITEMS_100.length);
    return LUCKY_ITEMS_100[randomIndex];
  }
}

