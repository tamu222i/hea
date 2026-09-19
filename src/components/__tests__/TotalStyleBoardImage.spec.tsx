import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { MotionGlobalConfig } from 'motion/react';
import App from '../../App';
import { PRESET_STYLES } from '../../infrastructure/repositories/presetStyles';
import { StyleTypeId } from '../../domain/models/StyleTypes';
import { generateTotalStyleSvg } from '../../utils/styleImageGenerator';

describe('Total Style Board Image & Outfit Variety Test', () => {
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

  it('ワンピース(onepiece)とサロペット(salopette)の衣装がSVG内に描画され、タグも連動すること', () => {
    const profile = PRESET_STYLES[StyleTypeId.SWEET_GIRLY];

    // 1. ワンピース指定
    const onepieceSvg = generateTotalStyleSvg({
      profile,
      aiAdvice: 'ふんわりワンピースでお出かけ♪',
      selectedOutfitType: 'onepiece',
    });
    expect(onepieceSvg).toContain('ワンピース');
    expect(onepieceSvg).toContain('Aラインが可愛い1枚主役コーデ');

    // 2. サロペット指定
    const salopetteSvg = generateTotalStyleSvg({
      profile,
      aiAdvice: 'サロペットでおしゃれにアクティブに！',
      selectedOutfitType: 'salopette',
    });
    expect(salopetteSvg).toContain('サロペット');
    expect(salopetteSvg).toContain('Tシャツと重ね着');
  });

  it('診断完了後、結果画面の上のほう（スタイル決定ヘッダーの直後）にスナップ画像カードが表示され、着せ替えボタンでワンピースやサロペットに切り替えられること', async () => {
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

    // 順序の検証: スナップ画像は結果の上のほう（スタイルヘッダーの直後、おみくじの前）に表示されること
    const resultContainer = container.querySelector('div[class*="space-y-6"]');
    const elements = Array.from(resultContainer?.children || []);
    const headerIndex = elements.findIndex((el) => el.id === 'diagnosis-result-header');
    const boardIndex = elements.findIndex((el) => el.id === 'total-style-board-card');
    const fortuneIndex = elements.findIndex((el) => el.id === 'fortune-result-card');

    expect(headerIndex).toBeGreaterThanOrEqual(0);
    expect(boardIndex).toBe(headerIndex + 1); // スタイルの直後にスナップ画像！
    expect(fortuneIndex).toBe(boardIndex + 1); // その後におみくじ

    // コーデ着せ替えボタン（ワンピース、サロペットなど）が存在すること
    const onepieceBtn = container.querySelector('#outfit-switch-onepiece') as HTMLButtonElement;
    const salopetteBtn = container.querySelector('#outfit-switch-salopette') as HTMLButtonElement;
    expect(onepieceBtn).not.toBeNull();
    expect(salopetteBtn).not.toBeNull();

    // ワンピースをクリックして切り替えられること
    await act(async () => {
      onepieceBtn.click();
    });
    expect(onepieceBtn.className).toContain('bg-pink-500');

    // サロペットをクリックして切り替えられること
    await act(async () => {
      salopetteBtn.click();
    });
    expect(salopetteBtn.className).toContain('bg-pink-500');
  });
});
