import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { MotionGlobalConfig } from 'motion/react';
import App from '../../App';
import { LUCKY_ITEMS_100 } from '../../domain/models/luckyItems100';
import { FortuneService, OMIKUJI_10_GRADES } from '../../domain/services/FortuneService';
import { StyleTypeId } from '../../domain/models/StyleTypes';

describe('Fortune Telling & Persistence Verification Test', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    MotionGlobalConfig.skipAnimations = true;
    (globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

    // Reset localStorage before each test
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
  });

  it('100種類のラッキーアイテムがユニークなID・名前・絵文字・アドバイスで定義されていること', () => {
    expect(LUCKY_ITEMS_100.length).toBe(100);
    const ids = new Set(LUCKY_ITEMS_100.map((item) => item.id));
    expect(ids.size).toBe(100);

    // Verify all 6 categories exist
    const categories = new Set(LUCKY_ITEMS_100.map((item) => item.category));
    expect(categories.has('stationery')).toBe(true);
    expect(categories.has('accessory')).toBe(true);
    expect(categories.has('sweets')).toBe(true);
    expect(categories.has('goods')).toBe(true);
    expect(categories.has('motif')).toBe(true);
    expect(categories.has('action')).toBe(true);

    // Each item has valid properties
    LUCKY_ITEMS_100.forEach((item) => {
      expect(item.name.length).toBeGreaterThan(0);
      expect(item.emoji.length).toBeGreaterThan(0);
      expect(item.advice.length).toBeGreaterThan(0);
      expect(item.luckyColor.length).toBeGreaterThan(0);
    });
  });

  it('10段階おみくじ評価（大吉〜大凶）が10段階正しく定義されており、FortuneServiceで評価できること', () => {
    expect(OMIKUJI_10_GRADES.length).toBe(10);
    const levels = OMIKUJI_10_GRADES.map((g) => g.level);
    expect(levels).toEqual([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);

    const service = new FortuneService();
    const fortune = service.getDailyFortune();

    expect(fortune.omikuji).toBeDefined();
    expect(fortune.omikuji.level).toBeGreaterThanOrEqual(1);
    expect(fortune.omikuji.level).toBeLessThanOrEqual(10);
    expect(fortune.omikuji.name).toBeDefined();
    expect(fortune.omikuji.reading).toBeDefined();
    expect(fortune.luckyItem).toBeDefined();

    // 5問回答からのおみくじ導出
    const omikujiFromAnswers = service.getOmikujiForAnswers(
      [
        { questionId: 'q1', optionId: 'opt1' },
        { questionId: 'q2', optionId: 'opt2' },
        { questionId: 'q3', optionId: 'opt3' },
        { questionId: 'q4', optionId: 'opt4' },
        { questionId: 'q5', optionId: 'opt5' },
      ],
      StyleTypeId.SWEET_GIRLY,
      'girly'
    );
    expect(omikujiFromAnswers.omikuji).toBeDefined();
    expect(omikujiFromAnswers.omikuji.level).toBeGreaterThanOrEqual(1);
    expect(omikujiFromAnswers.omikuji.level).toBeLessThanOrEqual(10);
  });

  it('Given 過去に当てたスタイルやシークレットがlocalStorageに保存されているとき、リロードしても解禁状態を保持していること', async () => {
    window.localStorage.setItem('kids_style_unlocked_secrets_v1', JSON.stringify([StyleTypeId.SECRET_UNICORN]));
    window.localStorage.setItem('kids_style_discovered_styles_v1', JSON.stringify([StyleTypeId.SECRET_UNICORN, StyleTypeId.POP_SPORTY]));
    window.localStorage.setItem('kids_style_collected_lucky_items_v1', JSON.stringify([1, 2, 3]));

    await act(async () => {
      root.render(<App />);
    });

    // Verify counter in start screen reflects saved storage
    expect(container.textContent).toContain('2 / 205種');
    expect(container.textContent).toContain('3 / 100種');

    // Open book modal
    const bookBtn = container.querySelector('#browse-all-styles-start-btn') as HTMLButtonElement;
    expect(bookBtn).not.toBeNull();

    await act(async () => {
      bookBtn.click();
    });

    const unicornCard = container.querySelector(`#style-card-${StyleTypeId.SECRET_UNICORN}`);
    expect(unicornCard).not.toBeNull();
    expect(unicornCard?.textContent).toContain('SECRET 解禁済');
    expect(unicornCard?.textContent).toContain('レインボーユニコーンエンジェル');
  });

  it('トップ画面のスタイル図鑑の横にアイテム一覧ボタンが配置され、クリックでアイテム図鑑が開くこと', async () => {
    await act(async () => {
      root.render(<App />);
    });

    // ヘッダーの単独占いボタンがないこと
    expect(container.querySelector('#header-fortune-btn')).toBeNull();

    // スタート画面でスタイル図鑑ボタンとアイテム一覧ボタンが並んでいること
    const stylesBookBtn = container.querySelector('#browse-all-styles-start-btn');
    const itemsListBtn = container.querySelector('#browse-all-items-start-btn') as HTMLButtonElement;

    expect(stylesBookBtn).not.toBeNull();
    expect(itemsListBtn).not.toBeNull();
    expect(itemsListBtn.textContent).toContain('全100種アイテム一覧');

    // アイテム一覧ボタンを押すとモーダルが開くこと
    await act(async () => {
      itemsListBtn.click();
    });

    expect(container.querySelector('#fortune-modal-content')).not.toBeNull();
    expect(container.textContent).toContain('ラッキーアイテム図鑑（全100種）');
  });

  it('5問クイズに回答すると、結果画面でスタイルの直後におみくじ10段階評価カードが表示されること', async () => {
    await act(async () => {
      root.render(<App />);
    });

    // スタートボタンを押下
    const startBtn = container.querySelector('#start-diagnosis-btn') as HTMLButtonElement;
    await act(async () => {
      startBtn.click();
    });

    // 5問回答する
    for (let step = 1; step <= 5; step++) {
      const optionBtn = container.querySelector('button[id^="option-"]') as HTMLButtonElement;
      expect(optionBtn).not.toBeNull();
      await act(async () => {
        optionBtn.click();
      });
    }

    // 結果画面が表示されること
    const resultScreen = container.querySelector('#diagnosis-result-header');
    const fortuneCard = container.querySelector('#fortune-result-card');
    expect(resultScreen).not.toBeNull();
    expect(fortuneCard).not.toBeNull();

    // スタイルカード（diagnosis-result-header）の直後の要素として配置されていること
    const resultContainer = container.querySelector('div[class*="space-y-6"]');
    expect(resultContainer).not.toBeNull();

    // 要素の出現順を検証: スタイルヘッダー -> スナップ画像ボード（上のほうに表示） -> おみくじカード
    const elements = Array.from(resultContainer?.children || []);
    const headerIndex = elements.findIndex((el) => el.id === 'diagnosis-result-header');
    const boardIndex = elements.findIndex((el) => el.id === 'total-style-board-card');
    const fortuneIndex = elements.findIndex((el) => el.id === 'fortune-result-card');

    expect(headerIndex).toBeGreaterThanOrEqual(0);
    expect(boardIndex).toBe(headerIndex + 1); // スタイルの直後にスナップ画像
    expect(fortuneIndex).toBe(boardIndex + 1); // スナップ画像の直後におみくじカード！

    expect(container.querySelector('#omikuji-grade-box')).not.toBeNull();
    expect(container.textContent).toContain('おみくじ10段階評価');
    expect(container.textContent).toContain('今日のスタイルおみくじ結果');
    expect(container.textContent).toContain('本日あなたのラッキーアイテム');

    // 占いガチャボタン（🎲 100種から別のおみくじを引く）は削除されていること
    expect(container.querySelector('#draw-lucky-item-btn')).toBeNull();
  });
});
