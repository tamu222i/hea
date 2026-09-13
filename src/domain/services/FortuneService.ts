import { DailyFortune, LuckyItem } from '../models/FortuneTypes';
import { LUCKY_ITEMS_100 } from '../models/luckyItems100';

export class FortuneService {
  /**
   * 全100種類のラッキーアイテムリストを取得
   */
  getAllLuckyItems(): LuckyItem[] {
    return LUCKY_ITEMS_100;
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
   * 今日のデイリー占いを生成
   */
  getDailyFortune(date: Date = new Date()): DailyFortune {
    const seed = this.getDateSeed(date);
    const dateString = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;

    const itemIndex = Math.floor(this.pseudoRandom(seed * 7 + 13) * LUCKY_ITEMS_100.length);
    const luckyItem = LUCKY_ITEMS_100[itemIndex];

    const overallStars = 3 + Math.floor(this.pseudoRandom(seed * 3 + 7) * 3); // 3, 4, 5 stars
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
      overallStars: Math.min(5, Math.max(3, overallStars)),
      fashionLuck: fashionAdvices[fIdx],
      socialLuck: socialAdvices[sIdx],
      studyLuck: studyAdvices[stIdx],
      luckyNumber,
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
