import { StyleProfile } from '../domain/models/StyleTypes';

export type OutfitType =
  | 'onepiece' // ワンピース (Aライン・ティアードワンピ)
  | 'salopette' // サロペット / サロンペット / オーバーオール
  | 'skirt_girly' // プリーツスカート・フレアスカート
  | 'shorts_sporty' // スポーティショートパンツ
  | 'wide_pants' // トレンドワイドパンツ
  | 'jumper_skirt'; // ジャンパースカート

export interface TotalStyleImageOptions {
  profile: StyleProfile;
  aiAdvice: string;
  luckyItemName?: string;
  luckyItemEmoji?: string;
  dateStr?: string;
  selectedOutfitType?: OutfitType;
}

/**
 * Determines hair type key based on hair style name and category
 */
export function detectHairStyleType(hairName: string, category: string): 'twintail' | 'ponytail' | 'bun' | 'braid' | 'halfup' | 'bob' | 'long' {
  const text = `${hairName} ${category}`.toLowerCase();
  if (text.includes('ツイン') || text.includes('おさげ')) return 'twintail';
  if (text.includes('ポニー') || text.includes('ひとつ結び')) return 'ponytail';
  if (text.includes('おだんご') || text.includes('お団子') || text.includes('シニヨン')) return 'bun';
  if (text.includes('編み込み') || text.includes('三つ編み') || text.includes('フィッシュ')) return 'braid';
  if (text.includes('ハーフアップ') || text.includes('くるりんぱ')) return 'halfup';
  if (text.includes('ボブ') || text.includes('ショート') || text.includes('ミニボブ')) return 'bob';
  return 'long';
}

/**
 * Determines natural outfit type based on style profile details,
 * ensuring rich diversity (including onepiece, salopette, skirt, shorts, wide pants).
 */
export function detectOutfitType(profile: StyleProfile): OutfitType {
  const combined = `${profile.typeName} ${profile.category} ${profile.catchphrase} ${profile.schoolFashion.title} ${profile.schoolFashion.items.map((i) => i.name).join(' ')}`.toLowerCase();

  // Explicit keywords
  if (combined.includes('ワンピ') || combined.includes('ドレス') || combined.includes('お嬢') || combined.includes('清楚') || combined.includes('ロマンティック')) {
    return 'onepiece';
  }
  if (
    combined.includes('サロペット') ||
    combined.includes('サロンペット') ||
    combined.includes('オーバーオール') ||
    combined.includes('オールインワン') ||
    combined.includes('アウトドア') ||
    combined.includes('キャンプ')
  ) {
    return 'salopette';
  }
  if (combined.includes('ジャンスカ') || combined.includes('ジャンパー') || combined.includes('プレッピー')) {
    return 'jumper_skirt';
  }
  if (combined.includes('ショートパンツ') || combined.includes('ショーパン') || combined.includes('スポーティ') || combined.includes('アクティブ') || combined.includes('ランニング')) {
    return 'shorts_sporty';
  }
  if (combined.includes('ワイド') || combined.includes('カーゴ') || combined.includes('ストリート') || combined.includes('ダンス') || combined.includes('k-pop')) {
    return 'wide_pants';
  }

  // Naturally distribute across the 205 styles based on typeName hash so each user experiences diverse outfits
  const charSum = profile.typeName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const cycle = charSum % 6;
  switch (cycle) {
    case 0:
      return 'onepiece'; // ワンピース
    case 1:
      return 'salopette'; // サロペット
    case 2:
      return 'skirt_girly'; // ガーリースカート
    case 3:
      return 'shorts_sporty'; // ショーパン
    case 4:
      return 'onepiece'; // ワンピース (高頻度で出現)
    case 5:
      return 'salopette'; // サロペット (高頻度で出現)
    default:
      return 'onepiece';
  }
}

/**
 * Helper to split text into lines
 */
function wrapText(text: string, maxCharsPerLine: number, maxLines: number): string[] {
  const lines: string[] = [];
  let cur = '';
  for (let i = 0; i < text.length; i++) {
    cur += text[i];
    if (cur.length >= maxCharsPerLine) {
      lines.push(cur);
      cur = '';
      if (lines.length >= maxLines) break;
    }
  }
  if (cur && lines.length < maxLines) {
    lines.push(cur);
  }
  return lines;
}

/**
 * Generates an SVG string of a cute anime/manga style elementary school girl wearing the proposed items!
 * Features:
 * - Varied outfits including ワンピース (Onepiece) and サロペット (Salopette/Overall)
 * - Posed and styled with recommended colors, hair arrangements, and lucky items
 * - High quality vector illustration ready for smartphone display and PNG download
 */
export function generateTotalStyleSvg({
  profile,
  aiAdvice,
  luckyItemName,
  luckyItemEmoji = '🍀',
  dateStr = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }),
  selectedOutfitType,
}: TotalStyleImageOptions): string {
  const hair = profile.hairStyles[0] || {
    name: 'ナチュラルスタイル',
    tagline: 'かんたん可愛い',
    durationMinutes: 3,
    difficulty: 'かんたん',
    steps: [{ instruction: 'ブラッシングして毛先を整えるよ' }],
  };

  const hairType = detectHairStyleType(hair.name, profile.category);
  const outfitType = selectedOutfitType || detectOutfitType(profile);

  // Recommended colors
  const primaryColor = profile.recommendedColors[0]?.hex || '#FB7185';
  const primaryColorName = profile.recommendedColors[0]?.name || 'ピンク';
  const secondaryColor = profile.recommendedColors[1]?.hex || '#38BDF8';
  const secondaryColorName = profile.recommendedColors[1]?.name || 'ミントブルー';
  const accentColor = profile.recommendedColors[2]?.hex || '#FBBF24';

  const resolvedLuckyItem = luckyItemName || profile.luckyItem || 'お気に入りのヘアピン';

  // Sanitized advice text
  const cleanAdvice = (aiAdvice || profile.description || '今日も笑顔で元気いっぱい過ごしてね！')
    .replace(/\r?\n/g, ' ')
    .trim();
  const adviceLines = wrapText(cleanAdvice, 32, 3);

  // Character Color Palettes
  const hairBase = '#4A2818';
  const hairDark = '#361A0C';
  const hairLight = '#784326';
  const skinBase = '#FFE8D6';
  const skinShadow = '#FCD5B5';
  const cheekColor = '#FF9EAA';
  const eyeColor = '#3B2014';
  const eyePupil = '#1A0E08';
  const eyeHighlight = '#FFFFFF';

  // Outfit metadata for fashion callout tag
  let outfitTagName = '👗 コーデ・ボトムス';
  let outfitItemDesc = `${secondaryColorName}コーデ`;
  let outfitSubtitle = '動きやすさ＆可愛さ満点！';
  if (outfitType === 'onepiece') {
    outfitTagName = '👗 ティアードワンピース';
    outfitItemDesc = `${primaryColorName}のワンピース`;
    outfitSubtitle = 'Aラインが可愛い1枚主役コーデ♪';
  } else if (outfitType === 'salopette') {
    outfitTagName = '👖 サロペットスタイル';
    outfitItemDesc = `${secondaryColorName}のサロペット`;
    outfitSubtitle = `${primaryColorName}Tシャツと重ね着！`;
  } else if (outfitType === 'shorts_sporty') {
    outfitTagName = '🏃‍♀️ ショートパンツ';
    outfitItemDesc = `${secondaryColorName}のショーパン`;
    outfitSubtitle = '元気に走れるアクティブコーデ！';
  } else if (outfitType === 'wide_pants') {
    outfitTagName = '✨ トレンドワイドパンツ';
    outfitItemDesc = `${secondaryColorName}のパンツ`;
    outfitSubtitle = '大人っぽくて脚長効果も抜群！';
  } else if (outfitType === 'jumper_skirt') {
    outfitTagName = '🎀 ジャンパースカート';
    outfitItemDesc = `${secondaryColorName}のジャンスカ`;
    outfitSubtitle = '上品＆きれいめなスクールスタイル！';
  }

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1280" width="900" height="1280" style="background:#FFF5F7; font-family:'Hiragino Kaku Gothic ProN', 'Meiryo', 'Segoe UI', sans-serif;">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF0F5" />
      <stop offset="50%" stop-color="#FFF8F0" />
      <stop offset="100%" stop-color="#F3E8FF" />
    </linearGradient>

    <!-- Header Gradient -->
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#EC4899" />
      <stop offset="50%" stop-color="#F43F5E" />
      <stop offset="100%" stop-color="#FB923C" />
    </linearGradient>

    <!-- Girl Stage Aura Gradient -->
    <radialGradient id="stageAura" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95" />
      <stop offset="60%" stop-color="#FFF1F2" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#FDE2E4" stop-opacity="0" />
    </radialGradient>

    <!-- Clothes Gradients -->
    <linearGradient id="primaryColorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.3" />
      <stop offset="40%" stop-color="${primaryColor}" />
      <stop offset="100%" stop-color="${primaryColor}" />
    </linearGradient>
    <linearGradient id="secondaryColorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.25" />
      <stop offset="45%" stop-color="${secondaryColor}" />
      <stop offset="100%" stop-color="${secondaryColor}" />
    </linearGradient>
    <linearGradient id="denimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60A5FA" />
      <stop offset="60%" stop-color="#2563EB" />
      <stop offset="100%" stop-color="#1D4ED8" />
    </linearGradient>

    <!-- Soft Drop Shadow Filter -->
    <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="5" stdDeviation="6" flood-color="#BE185D" flood-opacity="0.10" />
    </filter>
    <filter id="glowTag" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000000" flood-opacity="0.08" />
    </filter>
  </defs>

  <!-- Background Base Canvas -->
  <rect width="900" height="1280" fill="url(#bgGrad)" rx="36" />

  <!-- Outer Decorative Border -->
  <rect x="18" y="18" width="864" height="1244" fill="none" stroke="#FBCFE8" stroke-width="3" stroke-dasharray="10 8" rx="28" />

  <!-- Corner Sparkles -->
  <g fill="#F472B6" opacity="0.6">
    <path d="M 45 45 Q 55 45 55 35 Q 55 45 65 45 Q 55 45 55 55 Q 55 45 45 45 Z" />
    <path d="M 845 45 Q 855 45 855 35 Q 855 45 865 45 Q 855 45 855 55 Q 855 45 845 45 Z" />
    <path d="M 45 1235 Q 55 1235 55 1225 Q 55 1235 65 1235 Q 55 1235 55 1245 Q 55 1235 45 1235 Z" />
    <path d="M 845 1235 Q 855 1235 855 1225 Q 855 1235 865 1235 Q 855 1235 855 1245 Q 855 1235 845 1235 Z" />
  </g>

  <!-- ==================== HEADER BANNER ==================== -->
  <g transform="translate(50, 36)">
    <!-- Top Badge -->
    <rect x="250" y="0" width="300" height="30" rx="15" fill="#FCE7F3" stroke="#F472B6" stroke-width="1.5" />
    <text x="400" y="20" font-size="13" font-weight="900" fill="#DB2777" text-anchor="middle">
      🎀 トータルコーディネート スナップ 🎀
    </text>

    <!-- Main Title Card -->
    <rect x="40" y="40" width="720" height="88" rx="24" fill="url(#headerGrad)" filter="url(#softShadow)" />
    <text x="400" y="78" font-size="28" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">
      ${profile.typeName}
    </text>
    <text x="400" y="110" font-size="15" font-weight="700" fill="#FEF08A" text-anchor="middle">
      ${profile.catchphrase || '〜 あなたに一番似合うおすすめスタイル 〜'}
    </text>
  </g>

  <!-- ==================== CENTRAL STAGE (STAGE GLOW) ==================== -->
  <ellipse cx="450" cy="590" rx="260" ry="360" fill="url(#stageAura)" />
  <!-- Sparkles around the girl -->
  <g fill="#F59E0B" opacity="0.75">
    <path d="M 230 290 Q 240 290 240 280 Q 240 290 250 290 Q 240 290 240 300 Q 240 290 230 290 Z" />
    <path d="M 660 310 Q 670 310 670 300 Q 670 310 680 310 Q 670 310 670 320 Q 670 310 660 310 Z" />
    <path d="M 210 610 Q 220 610 220 600 Q 220 610 230 610 Q 220 610 220 620 Q 220 610 210 610 Z" />
    <path d="M 680 630 Q 690 630 690 620 Q 690 630 700 630 Q 690 630 690 640 Q 690 630 680 630 Z" />
    <circle cx="260" cy="460" r="4" fill="#EC4899" opacity="0.6" />
    <circle cx="640" cy="480" r="5" fill="#3B82F6" opacity="0.6" />
    <circle cx="280" cy="740" r="4" fill="#F59E0B" opacity="0.6" />
    <circle cx="630" cy="760" r="4" fill="#10B981" opacity="0.6" />
  </g>

  <!-- ==================== GIRL CHARACTER ILLUSTRATION ==================== -->
  <g id="girl-character" transform="translate(260, 185)">
    <!-- 1. BACK HAIR (Behind Head & Body) -->
    ${
      hairType === 'twintail'
        ? `
        <!-- Left Twintail -->
        <path d="M 120 180 Q 60 210 50 310 Q 40 390 70 440 Q 95 380 95 280 Z" fill="${hairBase}" stroke="${hairDark}" stroke-width="2.5" />
        <path d="M 65 260 Q 60 340 75 410" stroke="${hairLight}" stroke-width="3" fill="none" stroke-linecap="round" />
        <!-- Right Twintail -->
        <path d="M 260 180 Q 320 210 330 310 Q 340 390 310 440 Q 285 380 285 280 Z" fill="${hairBase}" stroke="${hairDark}" stroke-width="2.5" />
        <path d="M 315 260 Q 320 340 305 410" stroke="${hairLight}" stroke-width="3" fill="none" stroke-linecap="round" />
        `
        : hairType === 'ponytail'
        ? `
        <!-- High Ponytail sweeping to the right -->
        <path d="M 250 140 Q 320 120 350 180 Q 370 270 330 380 Q 300 340 280 230 Z" fill="${hairBase}" stroke="${hairDark}" stroke-width="2.5" />
        <path d="M 290 160 Q 340 210 330 320" stroke="${hairLight}" stroke-width="3" fill="none" stroke-linecap="round" />
        `
        : hairType === 'bun'
        ? `
        <!-- Left Bun -->
        <circle cx="110" cy="110" r="38" fill="${hairBase}" stroke="${hairDark}" stroke-width="2.5" />
        <circle cx="110" cy="110" r="28" fill="${hairLight}" opacity="0.4" />
        <!-- Right Bun -->
        <circle cx="270" cy="110" r="38" fill="${hairBase}" stroke="${hairDark}" stroke-width="2.5" />
        <circle cx="270" cy="110" r="28" fill="${hairLight}" opacity="0.4" />
        `
        : hairType === 'braid'
        ? `
        <!-- Left Braid -->
        <path d="M 120 200 Q 80 260 90 340 Q 95 400 85 450 Q 110 410 115 330 Z" fill="${hairBase}" stroke="${hairDark}" stroke-width="2" />
        <!-- Right Braid -->
        <path d="M 260 200 Q 300 260 290 340 Q 285 400 295 450 Q 270 410 265 330 Z" fill="${hairBase}" stroke="${hairDark}" stroke-width="2" />
        `
        : hairType === 'bob'
        ? `
        <!-- Bob Back curve -->
        <path d="M 110 180 Q 85 240 100 290 Q 140 310 190 310 Q 240 310 280 290 Q 295 240 270 180 Z" fill="${hairBase}" stroke="${hairDark}" stroke-width="2" />
        `
        : `
        <!-- Long Straight / Wavy Hair Back -->
        <path d="M 115 170 Q 80 260 85 420 Q 90 510 120 530 Q 140 430 135 300 L 245 300 Q 240 430 260 530 Q 290 510 295 420 Q 300 260 265 170 Z" fill="${hairBase}" stroke="${hairDark}" stroke-width="2" />
        <path d="M 100 290 Q 95 380 110 480" stroke="${hairLight}" stroke-width="3" fill="none" stroke-linecap="round" />
        <path d="M 280 290 Q 285 380 270 480" stroke="${hairLight}" stroke-width="3" fill="none" stroke-linecap="round" />
        `
    }

    <!-- 2. LEGS & FEET -->
    <!-- Legs shadow -->
    <ellipse cx="190" cy="745" rx="75" ry="12" fill="#BE185D" opacity="0.15" />

    ${
      outfitType === 'wide_pants'
        ? `
        <!-- Wide Pants Legs (Covering upper legs down to ankle) -->
        <path d="M 140 435 L 240 435 L 255 675 L 205 675 L 190 510 L 175 675 L 125 675 Z" fill="url(#secondaryColorGrad)" stroke="#1E293B" stroke-width="2.5" />
        <!-- Wide Pants Seams & Creases -->
        <path d="M 152 460 L 152 665" stroke="#000000" stroke-width="1.2" opacity="0.2" />
        <path d="M 228 460 L 228 665" stroke="#000000" stroke-width="1.2" opacity="0.2" />
        `
        : outfitType === 'salopette'
        ? `
        <!-- Salopette Pants Legs (Overalls style) -->
        <path d="M 140 420 L 240 420 L 250 670 L 208 670 L 190 490 L 172 670 L 130 670 Z" fill="url(#denimGrad)" stroke="#1E293B" stroke-width="2.5" />
        <!-- Rolled up hem cuff -->
        <rect x="127" y="650" width="46" height="20" rx="4" fill="#93C5FD" stroke="#1E293B" stroke-width="1.5" />
        <rect x="207" y="650" width="46" height="20" rx="4" fill="#93C5FD" stroke="#1E293B" stroke-width="1.5" />
        `
        : `
        <!-- Bare Legs for Skirt / Onepiece / Shorts -->
        <!-- Left Leg -->
        <path d="M 155 520 L 152 640 L 148 680" stroke="${skinBase}" stroke-width="22" stroke-linecap="round" />
        <path d="M 152 620 L 148 670" stroke="${skinShadow}" stroke-width="18" stroke-linecap="round" opacity="0.25" />
        <!-- Right Leg -->
        <path d="M 225 520 L 228 640 L 232 680" stroke="${skinBase}" stroke-width="22" stroke-linecap="round" />
        <path d="M 228 620 L 232 670" stroke="${skinShadow}" stroke-width="18" stroke-linecap="round" opacity="0.25" />

        <!-- Socks (Cute socks with accent stripes) -->
        <path d="M 148 640 L 146 685" stroke="#FFFFFF" stroke-width="23" stroke-linecap="round" />
        <path d="M 136 648 L 160 648" stroke="${primaryColor}" stroke-width="3.5" />
        <path d="M 232 640 L 234 685" stroke="#FFFFFF" stroke-width="23" stroke-linecap="round" />
        <path d="M 222 648 L 246 648" stroke="${primaryColor}" stroke-width="3.5" />
        `
    }

    <!-- Shoes (Cute trendy sneakers matching secondary/accent color) -->
    <!-- Left Shoe -->
    <g transform="translate(125, 680)">
      <path d="M 5 15 Q 15 5 35 8 Q 45 12 42 26 Q 30 32 8 30 Q -3 28 5 15 Z" fill="${secondaryColor}" stroke="#1E293B" stroke-width="2" />
      <path d="M 0 28 L 44 28" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" />
      <circle cx="22" cy="16" r="3" fill="#FFFFFF" />
      <circle cx="28" cy="18" r="3" fill="#FFFFFF" />
    </g>
    <!-- Right Shoe -->
    <g transform="translate(215, 680)">
      <path d="M 5 15 Q 15 5 35 8 Q 45 12 42 26 Q 30 32 8 30 Q -3 28 5 15 Z" fill="${secondaryColor}" stroke="#1E293B" stroke-width="2" />
      <path d="M 0 28 L 44 28" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" />
      <circle cx="22" cy="16" r="3" fill="#FFFFFF" />
      <circle cx="28" cy="18" r="3" fill="#FFFFFF" />
    </g>

    <!-- 3. LOWER GARMENTS / SKIRTS / SHORTS / ONEPIECE LOWER -->
    ${
      outfitType === 'onepiece'
        ? `
        <!-- ONEPIECE SKIRT PART (Flared A-line with tiered frills) -->
        <path d="M 148 380 Q 190 390 232 380 L 275 550 Q 190 575 105 550 Z" fill="url(#primaryColorGrad)" stroke="#1E293B" stroke-width="2.5" />
        <!-- Bottom Tier Frills in Accent / White -->
        <path d="M 105 550 Q 125 565 145 553 Q 165 568 190 555 Q 215 568 235 553 Q 255 565 275 550 L 280 568 Q 190 595 100 568 Z" fill="#FFFFFF" stroke="#1E293B" stroke-width="1.8" />
        <!-- Ribbon tie at waist -->
        <ellipse cx="190" cy="385" rx="14" ry="7" fill="${accentColor}" stroke="#B45309" stroke-width="1.5" />
        <path d="M 183 388 L 175 425 M 197 388 L 205 425" stroke="${accentColor}" stroke-width="3" stroke-linecap="round" />
        `
        : outfitType === 'salopette'
        ? `
        <!-- SALOPETTE WAIST / HIP SECTION (Denim / Colored Overalls) -->
        <!-- Center Bib & Waist Area -->
        <rect x="150" y="330" width="80" height="95" rx="8" fill="url(#denimGrad)" stroke="#1E293B" stroke-width="2.5" />
        <!-- Left Shoulder Strap with metal buckle -->
        <path d="M 156 280 L 156 345" stroke="#1D4ED8" stroke-width="10" stroke-linecap="round" />
        <rect x="151" y="325" width="10" height="12" rx="2" fill="${accentColor}" stroke="#1E293B" stroke-width="1.2" />
        <!-- Right Shoulder Strap with metal buckle -->
        <path d="M 224 280 L 224 345" stroke="#1D4ED8" stroke-width="10" stroke-linecap="round" />
        <rect x="219" y="325" width="10" height="12" rx="2" fill="${accentColor}" stroke="#1E293B" stroke-width="1.2" />
        <!-- Front Bib Center Pocket (Kangaroo Pocket) -->
        <path d="M 166 350 L 214 350 L 210 385 L 170 385 Z" fill="#3B82F6" stroke="#FFFFFF" stroke-width="1.5" stroke-dasharray="3 2" />
        <circle cx="190" cy="365" r="5" fill="${accentColor}" />
        `
        : outfitType === 'shorts_sporty'
        ? `
        <!-- Sporty Short Pants in Secondary Color -->
        <path d="M 140 435 L 240 435 L 255 510 L 205 515 L 190 470 L 175 515 L 125 510 Z" fill="url(#secondaryColorGrad)" stroke="#1E293B" stroke-width="2.5" />
        <!-- White side stripes -->
        <path d="M 132 445 L 122 505" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" />
        <path d="M 248 445 L 258 505" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" />
        <path d="M 180 445 L 200 445" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" />
        `
        : outfitType === 'jumper_skirt'
        ? `
        <!-- Jumper Skirt in Secondary Color -->
        <path d="M 145 350 L 235 350 L 265 530 Q 190 550 115 530 Z" fill="url(#secondaryColorGrad)" stroke="#1E293B" stroke-width="2.5" />
        <!-- Deep V-Neck cut -->
        <path d="M 165 350 L 190 410 L 215 350" stroke="#1E293B" stroke-width="2" fill="none" />
        `
        : outfitType === 'wide_pants'
        ? `
        <!-- High Waist Band for Wide Pants -->
        <rect x="142" y="420" width="96" height="18" rx="6" fill="${secondaryColor}" stroke="#1E293B" stroke-width="2" />
        <circle cx="190" cy="429" r="4" fill="${accentColor}" />
        `
        : `
        <!-- Flared Pleated Skirt in Secondary Color -->
        <path d="M 145 435 Q 190 442 235 435 L 265 525 Q 190 545 115 525 Z" fill="url(#secondaryColorGrad)" stroke="#1E293B" stroke-width="2.5" />
        <!-- Pleat creases -->
        <path d="M 152 440 L 140 528" stroke="${secondaryColor}" stroke-width="3" opacity="0.6" />
        <path d="M 172 441 L 165 533" stroke="#000000" stroke-width="1.5" opacity="0.25" />
        <path d="M 190 442 L 190 535" stroke="#000000" stroke-width="1.5" opacity="0.25" />
        <path d="M 208 441 L 215 533" stroke="#000000" stroke-width="1.5" opacity="0.25" />
        <path d="M 228 440 L 240 528" stroke="${secondaryColor}" stroke-width="3" opacity="0.6" />
        <!-- Cute Belt or Ribbon -->
        <rect x="150" y="430" width="80" height="10" rx="5" fill="#FFFFFF" stroke="#1E293B" stroke-width="1.5" />
        <circle cx="190" cy="435" r="5" fill="${accentColor}" stroke="#1E293B" stroke-width="1" />
        `
    }

    <!-- 4. TORSO & TOPS -->
    <!-- Neck -->
    <path d="M 178 245 L 178 285 L 202 285 L 202 245 Z" fill="${skinBase}" stroke="${skinShadow}" stroke-width="1.5" />

    <!-- Left Arm & Hand (Posed cute on hip) -->
    <path d="M 145 285 Q 105 330 115 390 Q 120 405 138 400 Q 140 375 145 350" stroke="${skinBase}" stroke-width="18" stroke-linecap="round" fill="none" />
    <circle cx="132" cy="398" r="9" fill="${skinBase}" />

    <!-- Right Arm & Hand (Waving / peace sign pose!) -->
    <path d="M 235 285 Q 275 320 280 370 Q 285 395 270 405 Q 260 380 245 340" stroke="${skinBase}" stroke-width="18" stroke-linecap="round" fill="none" />
    <circle cx="275" cy="402" r="9" fill="${skinBase}" />
    <!-- Peace finger accents -->
    <path d="M 273 400 L 282 388" stroke="${skinBase}" stroke-width="5" stroke-linecap="round" />
    <path d="M 278 404 L 289 396" stroke="${skinBase}" stroke-width="5" stroke-linecap="round" />

    <!-- Top Body Clothes (Colored in Recommended Color 1) -->
    ${
      outfitType === 'onepiece'
        ? `
        <!-- Onepiece Bodice -->
        <path d="M 140 285 Q 190 270 240 285 L 235 390 Q 190 400 145 390 Z" fill="url(#primaryColorGrad)" stroke="#1E293B" stroke-width="2.5" />
        <!-- Onepiece Cute Ruffle Sleeves -->
        <path d="M 145 285 Q 120 300 128 325 Q 140 330 150 315 Z" fill="url(#primaryColorGrad)" stroke="#1E293B" stroke-width="2" />
        <path d="M 235 285 Q 260 300 252 325 Q 240 330 230 315 Z" fill="url(#primaryColorGrad)" stroke="#1E293B" stroke-width="2" />
        <!-- Sweetheart / Round Collar with lace -->
        <path d="M 172 285 Q 190 305 208 285" stroke="#FFFFFF" stroke-width="4" fill="none" stroke-linecap="round" />
        <!-- Chest Buttons -->
        <circle cx="190" cy="320" r="3" fill="#FFFFFF" stroke="#1E293B" stroke-width="1" />
        <circle cx="190" cy="345" r="3" fill="#FFFFFF" stroke="#1E293B" stroke-width="1" />
        `
        : outfitType === 'salopette'
        ? `
        <!-- Inner T-Shirt behind Salopette -->
        <path d="M 140 285 Q 190 270 240 285 L 245 425 Q 190 435 135 425 Z" fill="url(#primaryColorGrad)" stroke="#1E293B" stroke-width="2.5" />
        <!-- T-Shirt Sleeves -->
        <path d="M 148 285 Q 125 305 125 330 Q 140 340 152 320 Z" fill="url(#primaryColorGrad)" stroke="#1E293B" stroke-width="2" />
        <path d="M 232 285 Q 255 305 255 330 Q 240 340 228 320 Z" fill="url(#primaryColorGrad)" stroke="#1E293B" stroke-width="2" />
        <!-- Crewneck collar -->
        <path d="M 172 285 Q 190 300 208 285" stroke="#FFFFFF" stroke-width="4" fill="none" stroke-linecap="round" />
        `
        : `
        <!-- Standard Top / T-Shirt / Blouse -->
        <path d="M 140 285 Q 190 270 240 285 L 245 440 Q 190 448 135 440 Z" fill="url(#primaryColorGrad)" stroke="#1E293B" stroke-width="2.5" />
        <!-- Sleeves -->
        <path d="M 148 285 Q 125 305 125 330 Q 140 340 152 320 Z" fill="url(#primaryColorGrad)" stroke="#1E293B" stroke-width="2" />
        <path d="M 232 285 Q 255 305 255 330 Q 240 340 228 320 Z" fill="url(#primaryColorGrad)" stroke="#1E293B" stroke-width="2" />
        <!-- Top Collar / Neckline & Ribbon Accent -->
        <path d="M 172 285 Q 190 305 208 285" stroke="#FFFFFF" stroke-width="4" fill="none" stroke-linecap="round" />
        <!-- Chest Cute Graphic / Motif (Heart) -->
        <path d="M 190 345 C 190 335 180 330 173 336 C 165 344 170 355 190 368 C 210 355 215 344 207 336 C 200 330 190 335 190 345 Z" fill="#FFFFFF" opacity="0.9" stroke="#E11D48" stroke-width="1" />
        `
    }

    <!-- Lucky Item: Crossbody Pochette / Bag -->
    <g id="girl-lucky-bag">
      <!-- Strap running across body -->
      <path d="M 148 285 Q 190 360 230 425" stroke="#92400E" stroke-width="3.5" fill="none" />
      <!-- Pochette Bag resting near hip -->
      <rect x="215" y="405" width="38" height="32" rx="8" fill="#FDE68A" stroke="#B45309" stroke-width="2" />
      <path d="M 215 415 Q 234 425 253 415" stroke="#B45309" stroke-width="2" fill="none" />
      <!-- Lucky Star/Clover on bag -->
      <circle cx="234" cy="425" r="4" fill="${primaryColor}" />
    </g>

    <!-- 5. HEAD & FACE -->
    <!-- Head Contour (Cute Anime Face) -->
    <path d="M 130 180 Q 120 225 140 245 Q 190 270 240 245 Q 260 225 250 180 Q 245 130 190 130 Q 135 130 130 180 Z" fill="${skinBase}" stroke="${skinShadow}" stroke-width="2" />
    
    <!-- Ears -->
    <circle cx="128" cy="205" r="10" fill="${skinBase}" stroke="${skinShadow}" stroke-width="1" />
    <circle cx="252" cy="205" r="10" fill="${skinBase}" stroke="${skinShadow}" stroke-width="1" />

    <!-- Cute Cheeks (Blush) -->
    <ellipse cx="152" cy="218" rx="14" ry="8" fill="${cheekColor}" opacity="0.55" />
    <ellipse cx="228" cy="218" rx="14" ry="8" fill="${cheekColor}" opacity="0.55" />
    <!-- Cheek lines -->
    <path d="M 146 216 L 150 222 M 153 216 L 157 222" stroke="#E11D48" stroke-width="1.2" stroke-linecap="round" opacity="0.6" />
    <path d="M 223 216 L 227 222 M 230 216 L 234 222" stroke="#E11D48" stroke-width="1.2" stroke-linecap="round" opacity="0.6" />

    <!-- Nose -->
    <circle cx="190" cy="206" r="2" fill="#D97706" opacity="0.6" />

    <!-- Smiling Mouth -->
    <path d="M 178 226 Q 190 240 202 226" stroke="#BE185D" stroke-width="2.5" fill="#FDA4AF" stroke-linecap="round" />
    <!-- White teeth highlight -->
    <path d="M 183 227 Q 190 231 197 227" stroke="#FFFFFF" stroke-width="1.8" fill="none" stroke-linecap="round" />

    <!-- Eyebrows -->
    <path d="M 148 168 Q 162 160 174 168" stroke="${hairDark}" stroke-width="2.2" fill="none" stroke-linecap="round" />
    <path d="M 206 168 Q 218 160 232 168" stroke="${hairDark}" stroke-width="2.2" fill="none" stroke-linecap="round" />

    <!-- Left Eye (Big Sparkling Anime Eye) -->
    <g id="left-eye">
      <path d="M 142 188 Q 158 174 174 186" stroke="#1E293B" stroke-width="3.8" fill="none" stroke-linecap="round" />
      <path d="M 172 184 L 178 181" stroke="#1E293B" stroke-width="2" stroke-linecap="round" />
      <ellipse cx="158" cy="192" rx="13" ry="16" fill="${eyeColor}" />
      <ellipse cx="158" cy="194" rx="9" ry="11" fill="${eyePupil}" />
      <circle cx="154" cy="188" r="5.5" fill="${eyeHighlight}" />
      <circle cx="163" cy="199" r="2.8" fill="${eyeHighlight}" />
      <path d="M 147 203 Q 158 207 169 203" stroke="#475569" stroke-width="1.8" fill="none" stroke-linecap="round" />
    </g>

    <!-- Right Eye (Big Sparkling Anime Eye) -->
    <g id="right-eye">
      <path d="M 206 186 Q 222 174 238 188" stroke="#1E293B" stroke-width="3.8" fill="none" stroke-linecap="round" />
      <path d="M 236 184 L 242 181" stroke="#1E293B" stroke-width="2" stroke-linecap="round" />
      <ellipse cx="222" cy="192" rx="13" ry="16" fill="${eyeColor}" />
      <ellipse cx="222" cy="194" rx="9" ry="11" fill="${eyePupil}" />
      <circle cx="218" cy="188" r="5.5" fill="${eyeHighlight}" />
      <circle cx="227" cy="199" r="2.8" fill="${eyeHighlight}" />
      <path d="M 211 203 Q 222 207 233 203" stroke="#475569" stroke-width="1.8" fill="none" stroke-linecap="round" />
    </g>

    <!-- 6. FRONT HAIR & BANGS (Over Face) -->
    <path d="M 125 175 Q 115 110 190 100 Q 265 110 255 175 Q 240 135 190 135 Q 140 135 125 175 Z" fill="${hairBase}" stroke="${hairDark}" stroke-width="2.5" />
    <path d="M 130 160 Q 142 185 145 198 Q 152 175 160 195 Q 172 172 185 198 Q 192 172 205 198 Q 215 175 225 195 Q 232 178 245 198 Q 248 180 250 160 Q 240 145 190 145 Q 140 145 130 160 Z" fill="${hairBase}" stroke="${hairDark}" stroke-width="2" />
    <ellipse cx="190" cy="130" rx="45" ry="6" fill="#FFFFFF" opacity="0.35" />

    <!-- Side Bangs Framing Face -->
    <path d="M 122 170 Q 118 215 128 245 Q 134 235 132 200 Z" fill="${hairBase}" stroke="${hairDark}" stroke-width="1.5" />
    <path d="M 258 170 Q 262 215 252 245 Q 246 235 248 200 Z" fill="${hairBase}" stroke="${hairDark}" stroke-width="1.5" />

    <!-- 7. HAIR ACCESSORIES & WEARING THE LUCKY ITEM! -->
    ${
      hairType === 'twintail'
        ? `
        <!-- Left Twintail Ribbon -->
        <g transform="translate(100, 160)">
          <path d="M 10 10 C -5 -5 -10 20 10 15 C 25 20 25 -5 10 10 Z" fill="${primaryColor}" stroke="#BE185D" stroke-width="2" />
          <path d="M 5 15 L -2 30" stroke="${primaryColor}" stroke-width="4" stroke-linecap="round" />
          <path d="M 12 15 L 18 28" stroke="${primaryColor}" stroke-width="4" stroke-linecap="round" />
          <circle cx="10" cy="12" r="4.5" fill="${accentColor}" />
        </g>
        <!-- Right Twintail Ribbon -->
        <g transform="translate(260, 160)">
          <path d="M 10 10 C -5 -5 -10 20 10 15 C 25 20 25 -5 10 10 Z" fill="${primaryColor}" stroke="#BE185D" stroke-width="2" />
          <path d="M 5 15 L -2 30" stroke="${primaryColor}" stroke-width="4" stroke-linecap="round" />
          <path d="M 12 15 L 18 28" stroke="${primaryColor}" stroke-width="4" stroke-linecap="round" />
          <circle cx="10" cy="12" r="4.5" fill="${accentColor}" />
        </g>
        `
        : hairType === 'ponytail'
        ? `
        <!-- High Ponytail Scrunchie -->
        <ellipse cx="250" cy="140" rx="14" ry="10" fill="${primaryColor}" stroke="#BE185D" stroke-width="2" />
        <circle cx="250" cy="140" r="5" fill="${accentColor}" />
        `
        : `
        <!-- Cute Hairpin in hair -->
        <g transform="translate(135, 145)">
          <rect x="0" y="0" width="28" height="6" rx="3" fill="${accentColor}" stroke="#B45309" stroke-width="1.5" />
          <path d="M 14 -2 L 17 4 L 23 4 L 18 8 L 20 14 L 14 10 L 8 14 L 10 8 L 5 4 L 11 4 Z" fill="#F59E0B" stroke="#B45309" stroke-width="1" />
        </g>
        `
    }
  </g>

  <!-- ==================== FASHION MAGAZINE CALLOUT TAGS ==================== -->
  <!-- 1. HAIR STYLE CALLOUT (TOP LEFT) -->
  <g transform="translate(45, 275)" filter="url(#glowTag)">
    <rect width="210" height="74" rx="16" fill="#FFFFFF" stroke="#F59E0B" stroke-width="2" />
    <rect x="12" y="10" width="86" height="20" rx="6" fill="#FEF3C7" />
    <text x="55" y="24" font-size="11" font-weight="900" fill="#B45309" text-anchor="middle">💇‍♀️ ヘアアレンジ</text>
    <text x="14" y="48" font-size="15" font-weight="900" fill="#1E293B">${hair.name}</text>
    <text x="14" y="65" font-size="11" font-weight="700" fill="#64748B">目安: ${hair.durationMinutes}分 / ${hair.difficulty}</text>
    <!-- Pointer Line to Girl's Hair -->
    <path d="M 210 37 L 275 37 L 340 330" stroke="#F59E0B" stroke-width="2" stroke-dasharray="4 4" fill="none" />
    <circle cx="340" cy="330" r="4" fill="#F59E0B" />
  </g>

  <!-- 2. RECOMMENDED COLOR / TOP CLOTHES (TOP RIGHT) -->
  <g transform="translate(645, 275)" filter="url(#glowTag)">
    <rect width="210" height="74" rx="16" fill="#FFFFFF" stroke="${primaryColor}" stroke-width="2" />
    <rect x="12" y="10" width="86" height="20" rx="6" fill="#FFF1F2" />
    <text x="55" y="24" font-size="11" font-weight="900" fill="#E11D48" text-anchor="middle">🎨 おすすめカラー</text>
    <!-- Color Swatch Circle -->
    <circle cx="24" cy="52" r="10" fill="${primaryColor}" stroke="#FFFFFF" stroke-width="2" />
    <text x="42" y="52" font-size="15" font-weight="900" fill="#1E293B">${primaryColorName}のトップス</text>
    <text x="42" y="66" font-size="11" font-weight="700" fill="#64748B">${primaryColor} / メインカラー</text>
    <!-- Pointer Line to Girl's Tops -->
    <path d="M 0 37 L -65 37 L -180 230" stroke="${primaryColor}" stroke-width="2" stroke-dasharray="4 4" fill="none" />
    <circle cx="465" cy="505" r="4" fill="${primaryColor}" />
  </g>

  <!-- 3. FASHION COORDINATE / DYNAMIC OUTFIT TAG (BOTTOM LEFT) -->
  <g transform="translate(45, 665)" filter="url(#glowTag)">
    <rect width="210" height="74" rx="16" fill="#FFFFFF" stroke="${secondaryColor}" stroke-width="2" />
    <rect x="12" y="10" width="105" height="20" rx="6" fill="#F0F9FF" />
    <text x="64" y="24" font-size="11" font-weight="900" fill="#0369A1" text-anchor="middle">${outfitTagName}</text>
    <!-- Color Swatch Circle -->
    <circle cx="24" cy="52" r="10" fill="${secondaryColor}" stroke="#FFFFFF" stroke-width="2" />
    <text x="42" y="52" font-size="14" font-weight="900" fill="#1E293B">${outfitItemDesc}</text>
    <text x="42" y="66" font-size="11" font-weight="700" fill="#64748B">${outfitSubtitle}</text>
    <!-- Pointer Line to Girl's Outfit -->
    <path d="M 210 37 L 285 37 L 380 0" stroke="${secondaryColor}" stroke-width="2" stroke-dasharray="4 4" fill="none" />
    <circle cx="425" cy="665" r="4" fill="${secondaryColor}" />
  </g>

  <!-- 4. WEARING LUCKY ITEM (BOTTOM RIGHT) -->
  <g transform="translate(645, 665)" filter="url(#glowTag)">
    <rect width="210" height="74" rx="16" fill="#FFFFFF" stroke="#EC4899" stroke-width="2" />
    <rect x="12" y="10" width="98" height="20" rx="6" fill="#FDF2F8" />
    <text x="61" y="24" font-size="11" font-weight="900" fill="#BE185D" text-anchor="middle">🍀 身に着けたアイテム</text>
    <text x="14" y="50" font-size="14" font-weight="900" fill="#78350F">
      ${luckyItemEmoji} ${resolvedLuckyItem.slice(0, 11)}
    </text>
    <text x="14" y="66" font-size="11" font-weight="700" fill="#EC4899">身に着けて今日の運気UP✨</text>
    <!-- Pointer Line to Girl's Bag / Accessory -->
    <path d="M 0 37 L -80 37 L -150 -70" stroke="#EC4899" stroke-width="2" stroke-dasharray="4 4" fill="none" />
    <circle cx="495" cy="595" r="4" fill="#EC4899" />
  </g>

  <!-- ==================== FOOTER: AI STYLIST MESSAGE & CARD ==================== -->
  <g transform="translate(50, 995)">
    <rect width="800" height="225" rx="26" fill="#FFFFFF" stroke="#FBCFE8" stroke-width="2" filter="url(#softShadow)" />

    <!-- Stylist Badge Header -->
    <g transform="translate(28, 22)">
      <rect width="220" height="34" rx="17" fill="#9333EA" />
      <text x="110" y="23" font-size="14" font-weight="900" fill="#FFFFFF" text-anchor="middle">
        🤖 AIスタイリストのアドバイス
      </text>
    </g>

    <!-- Advice Bubble -->
    <g transform="translate(28, 70)">
      <rect width="744" height="96" rx="16" fill="#FAF5FF" stroke="#F3E8FF" stroke-width="1.5" />
      <g transform="translate(18, 30)">
        ${adviceLines
          .map((line, idx) => {
            return `<text x="0" y="${idx * 26}" font-size="14" font-weight="700" fill="#334155">${line}</text>`;
          })
          .join('')}
      </g>
    </g>

    <!-- Bottom Metadata row -->
    <g transform="translate(28, 185)">
      <text x="0" y="20" font-size="13" font-weight="800" fill="#64748B">
        診断日: ${dateStr}
      </text>
      <text x="180" y="20" font-size="13" font-weight="900" fill="#EC4899">
        #小学生ヘア＆ファッション #トータルコーデ
      </text>
      <text x="744" y="20" font-size="13" font-weight="800" fill="#DB2777" text-anchor="end">
        📸 画像を保存して毎日のコーデのお手本にしてね！
      </text>
    </g>
  </g>
</svg>
  `.trim();
}

/**
 * Converts the generated SVG string into a PNG Data URL using an in-memory Canvas.
 * Falls back to SVG data URL if canvas rendering is unavailable.
 */
export async function convertSvgToPngDataUrl(svgString: string, width = 900, height = 1280): Promise<string> {
  const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return svgDataUrl;
  }

  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(svgDataUrl);
            return;
          }
          // Draw white background
          ctx.fillStyle = '#FFF5F7';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          const pngUrl = canvas.toDataURL('image/png');
          resolve(pngUrl);
        } catch {
          resolve(svgDataUrl);
        }
      };

      img.onerror = () => {
        resolve(svgDataUrl);
      };

      img.src = svgDataUrl;
    } catch {
      resolve(svgDataUrl);
    }
  });
}
