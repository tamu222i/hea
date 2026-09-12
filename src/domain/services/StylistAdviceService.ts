import { StyleProfile } from '../models/StyleTypes';

export interface AdviceRequestParams {
  profile: StyleProfile;
  event: string;
  weather: string;
  hairLength: 'short' | 'medium' | 'long';
}

/**
 * Generates tailored stylist advice.
 * If backend API (/api/stylist-advice) is available, calls it.
 * If running in static environment (GitHub Pages, etc.) or if the fetch fails/times out,
 * seamlessly returns rich rule-based customized advice.
 */
export async function getStylistAdvice(params: AdviceRequestParams): Promise<string> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch('/api/stylist-advice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        typeName: params.profile.typeName,
        event: params.event,
        weather: params.weather,
        hairLength: params.hairLength,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data?.advice) {
        return data.advice;
      }
    }
  } catch {
    // Expected on static hosts like GitHub Pages or when offline
  }

  // Graceful offline & static host advice generator
  return generateOfflineAdvice(params);
}

export function generateOfflineAdvice({
  profile,
  event,
  weather,
  hairLength,
}: AdviceRequestParams): string {
  // Hair tip based on event & hair length
  let hairAdvice = '';
  if (event.includes('体育') || event.includes('運動会')) {
    hairAdvice =
      hairLength === 'short'
        ? '前髪やサイドの髪が目にかからないよう、耳の後ろでピン留めすると全力で動けるよ！'
        : '走ったりジャンプしてもほどけないよう、太めのゴムでしっかりまとめるのが大正解！';
  } else if (event.includes('発表会') || event.includes('おめかし')) {
    hairAdvice =
      hairLength === 'short'
        ? 'サイドに可愛いピンやカチューシャを添えると、上品で華やかな主役スタイルに♪'
        : '毛先をふんわり整えて、ハーフアップや三つ編みでとびきりおめかししてみてね！';
  } else if (event.includes('遠足') || event.includes('校外学習')) {
    hairAdvice =
      hairLength === 'short'
        ? '帽子をかぶりやすいスッキリしたシルエットがおすすめ！'
        : '帽子を脱ぎ着してもくずれないよう、低めの位置でまとめるのがベストだよ♪';
  } else {
    hairAdvice =
      hairLength === 'short'
        ? 'ブラシでツヤを出して、毛先を整えるだけで清潔感たっぷりの好印象に！'
        : '授業中もノートを書くときに邪魔にならないまとめ髪がとっても似合うよ！';
  }

  // Weather & Fashion advice
  let weatherAdvice = '';
  if (weather.includes('雨') || weather.includes('くもり')) {
    weatherAdvice = '雨の日は湿気で広がりやすいので、ピンやゴムをポーチに忍ばせておくと安心だよ☔ 足元は歩きやすいスニーカーを選ぼう！';
  } else if (weather.includes('あつ') || weather.includes('夏日')) {
    weatherAdvice = 'あつい日は汗拭きハンカチと水筒を忘れずに☀️ 涼しい素材のお洋服と首元スッキリヘアで乗り切ろう！';
  } else if (weather.includes('寒') || weather.includes('ひんやり')) {
    weatherAdvice = '肌寒い日はさっと羽織れるカーディガンやパーカーが便利🧣 首元を冷やさないように温かくしてね！';
  } else if (weather.includes('風')) {
    weatherAdvice = '風がつよい日は髪がふわっとなびきやすいから、崩れにくいまとめ髪がぴったり🍃';
  } else {
    weatherAdvice = 'ぽかぽかお天気で気分も最高！今日のラッキーカラーをお洋服や小物に取り入れてみよう✨';
  }

  // Encouragement closing
  const luckyColor = profile.recommendedColors[0]?.name || 'お気に入りのカラー';

  return `【${profile.typeName}のあなたへ】\n今日の予定「${event}」（お天気：${weather}）には、${hairAdvice}\n${weatherAdvice}\nラッキーカラーの「${luckyColor}」を味方にして、今日も元気にいってらっしゃい✨`;
}
