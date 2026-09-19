import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { MotionGlobalConfig } from 'motion/react';
import App from '../../App';
import { PRESET_STYLES } from '../../infrastructure/repositories/presetStyles';
import { StyleTypeId } from '../../domain/models/StyleTypes';
import { generateTotalStyleSvg } from '../../utils/styleImageGenerator';

describe('Total Style Board Image Verification Test', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    MotionGlobalConfig.skipAnimations = true;
    (globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    window.localStorage.clear();

    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    vi.restoreAllMocks();
  });

  it('generateTotalStyleSvgが提案したアイテムを身に着けた女の子キャラクター入りのSVGを正しく生成すること', () => {
    const profile = PRESET_STYLES[StyleTypeId.POP_SPORTY];
    const svg = generateTotalStyleSvg({
      profile,
      aiAdvice: '今日は体育があるから崩れにくいヘアで思いっきり走ろう！',
      luckyItemName: 'カラフルヘアゴム',
      luckyItemEmoji: '🎀',
    });

    // 1. 女の子キャラクターの描画要素
    expect(svg).toContain('id="girl-character"');
    expect(svg).toContain('id="left-eye"');
    expect(svg).toContain('id="right-eye"');

    // 2. スタイル名
    expect(svg).toContain(profile.typeName);

    // 3. 提案されたヘアアレンジ
    expect(svg).toContain('ヘアアレンジ');
    expect(svg).toContain(profile.hairStyles[0].name);

    // 4. 提案されたおすすめカラー（トップス・ボトムス着用）
    expect(svg).toContain('おすすめカラー');
    expect(svg).toContain(profile.recommendedColors[0].name);

    // 5. 提案されたラッキーアイテム（身に着けたアイテム）
    expect(svg).toContain('身に着けたアイテム');
    expect(svg).toContain('カラフルヘアゴム');

    // 6. AIスタイリストのアドバイス
    expect(svg).toContain('AIスタイリストのアドバイス');
    expect(svg).toContain('今日は体育があるから崩れにくいヘア');
  });

  it('診断完了後、結果画面に女の子がアイテムを身に着けた1枚画像カード（TotalStyleBoardCard）と画像・ダウンロードボタンが表示されること', async () => {
    await act(async () => {
      root.render(<App />);
    });

    // クイズ開始
    const startBtn = container.querySelector('#start-diagnosis-btn') as HTMLButtonElement;
    expect(startBtn).not.toBeNull();
    await act(async () => {
      startBtn.click();
    });

    // 5問回答
    for (let step = 1; step <= 5; step++) {
      const optionBtn = container.querySelector('button[id^="option-"]') as HTMLButtonElement;
      expect(optionBtn).not.toBeNull();
      await act(async () => {
        optionBtn.click();
      });
    }

    // 結果画面が表示されること
    const boardCard = container.querySelector('#total-style-board-card');
    expect(boardCard).not.toBeNull();
    expect(boardCard?.textContent).toContain('提案アイテム着用！トータルコーデイラスト（1枚画像）');
    expect(boardCard?.textContent).toContain('おすすめカラー・ヘアアレンジ・ラッキーアイテムを女の子が実際に身に着けたスナップ画像！');

    // ダウンロードボタンと拡大ボタンが存在すること
    const downloadBtn = container.querySelector('#download-total-style-btn');
    const zoomBtn = container.querySelector('#zoom-total-style-btn');
    expect(downloadBtn).not.toBeNull();
    expect(zoomBtn).not.toBeNull();

    // 順序の検証: スタイル -> おみくじ -> 1枚画像ボード
    const resultContainer = container.querySelector('div[class*="space-y-6"]');
    const elements = Array.from(resultContainer?.children || []);
    const headerIndex = elements.findIndex((el) => el.id === 'diagnosis-result-header');
    const fortuneIndex = elements.findIndex((el) => el.id === 'fortune-result-card');
    const boardIndex = elements.findIndex((el) => el.id === 'total-style-board-card');

    expect(headerIndex).toBeGreaterThanOrEqual(0);
    expect(fortuneIndex).toBe(headerIndex + 1); // スタイルの直後におみくじ
    expect(boardIndex).toBe(fortuneIndex + 1); // その直後に1枚画像ボード
  });
});
