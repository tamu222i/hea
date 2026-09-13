import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { MotionGlobalConfig } from 'motion/react';
import App from '../../App';
import { LUCKY_ITEMS_100 } from '../../domain/models/luckyItems100';
import { FortuneService } from '../../domain/services/FortuneService';
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

  it('FortuneServiceが日替わり運勢とスタイル別ラッキーアイテムを正常に生成できること', () => {
    const service = new FortuneService();
    const fortune = service.getDailyFortune();

    expect(fortune.luckyItem).toBeDefined();
    expect(fortune.luckyItem.luckyColor).toBeDefined();
    expect(fortune.fashionLuck.length).toBeGreaterThan(0);
    expect(fortune.socialLuck.length).toBeGreaterThan(0);
    expect(fortune.studyLuck.length).toBeGreaterThan(0);

    const styleItem = service.getLuckyItemForStyle(StyleTypeId.SWEET_GIRLY, 'girly');
    expect(styleItem).toBeDefined();
    expect(styleItem.name.length).toBeGreaterThan(0);
  });

  it('Given 過去に当てたスタイルやシークレットがlocalStorageに保存されているとき、リロード（初期レンダリング）しても解禁状態を保持していること', async () => {
    // Simulate previous session where user unlocked secret and regular style
    window.localStorage.setItem('kids_style_unlocked_secrets_v1', JSON.stringify([StyleTypeId.SECRET_UNICORN]));
    window.localStorage.setItem('kids_style_discovered_styles_v1', JSON.stringify([StyleTypeId.SECRET_UNICORN, StyleTypeId.POP_SPORTY]));
    window.localStorage.setItem('kids_style_collected_lucky_items_v1', JSON.stringify([1, 2, 3]));

    await act(async () => {
      root.render(<App />);
    });

    // Verify counter in start screen reflects saved storage
    expect(container.textContent).toContain('2 / 105種');
    expect(container.textContent).toContain('3 / 100種');

    // Open book modal
    const bookBtn = container.querySelector('#browse-all-styles-start-btn') as HTMLButtonElement;
    expect(bookBtn).not.toBeNull();

    await act(async () => {
      bookBtn.click();
    });

    // In modal, SECRET_UNICORN should be unlocked rather than locked
    const unicornCard = container.querySelector(`#style-card-${StyleTypeId.SECRET_UNICORN}`);
    expect(unicornCard).not.toBeNull();
    expect(unicornCard?.textContent).toContain('SECRET 解禁済');
    expect(unicornCard?.textContent).toContain('レインボーユニコーンエンジェル');
  });

  it('Given スタート画面から「🔮 今日の100種アイテム占い」ボタンをクリックすると、占いモーダルが正常に開き100種の図鑑タブが見られること', async () => {
    await act(async () => {
      root.render(<App />);
    });

    const fortuneBtn = container.querySelector('#open-fortune-start-btn') as HTMLButtonElement;
    expect(fortuneBtn).not.toBeNull();

    await act(async () => {
      fortuneBtn.click();
    });

    // Verify Fortune modal is visible
    const fortuneModal = container.querySelector('#fortune-modal-dialog');
    expect(fortuneModal).not.toBeNull();
    expect(container.textContent).toContain('スタイル占い＆ラッキーアイテム100');
    expect(container.textContent).toContain('今日の運勢');
    expect(container.textContent).toContain('全100種アイテム図鑑');

    // Switch to collection tab
    const collectionTab = container.querySelector('#tab-collection-view') as HTMLButtonElement;
    expect(collectionTab).not.toBeNull();

    await act(async () => {
      collectionTab.click();
    });

    // Check item grid is rendered with items up to 100
    expect(container.textContent).toContain('No.1');
    expect(container.textContent).toContain('No.100');
    expect(container.textContent).toContain('友達や家族へ「ありがとう」');
  });
});
