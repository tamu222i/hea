import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { MotionGlobalConfig } from 'motion/react';
import App from '../../App';
import { StyleTypeId } from '../../domain/models/StyleTypes';

describe('Interactive BDD Test: 図鑑ボタンとモーダルの動作検証', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    // Disable animations so AnimatePresence transitions synchronously
    MotionGlobalConfig.skipAnimations = true;
    // Suppress React 19 act() warning in jsdom
    (globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

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

  it('Given スタート画面が表示されているとき、ヘッダーの「全105スタイル図鑑」ボタンをクリックするとモーダルが正常に開き画面が真っ白にならないこと', async () => {
    await act(async () => {
      root.render(<App />);
    });

    const headerBtn = container.querySelector('#view-all-types-btn') as HTMLButtonElement;
    expect(headerBtn).not.toBeNull();

    await act(async () => {
      headerBtn.click();
    });

    // Verify modal is open and shows 105 styles without crashing
    const modal = container.querySelector('#all-types-modal-dialog');
    expect(modal).not.toBeNull();
    expect(container.textContent).toContain('スタイル大図鑑');
    expect(container.textContent).toContain('全105種');
    expect(container.textContent).toContain('シークレット5種');
  });

  it('Given スタート画面が表示されているとき、中央の「全105種類のスタイル図鑑を自由に見る」ボタンをクリックするとモーダルが開き、スタイルを選択すると結果画面が表示されること', async () => {
    await act(async () => {
      root.render(<App />);
    });

    const startBtn = container.querySelector('#browse-all-styles-start-btn') as HTMLButtonElement;
    expect(startBtn).not.toBeNull();

    // 1. Open modal
    await act(async () => {
      startBtn.click();
    });

    const modal = container.querySelector('#all-types-modal-dialog');
    expect(modal).not.toBeNull();

    // 2. Select POP_SPORTY style card specifically inside the modal
    const targetCard = container.querySelector(`#style-card-${StyleTypeId.POP_SPORTY}`) as HTMLElement;
    expect(targetCard).not.toBeNull();

    await act(async () => {
      targetCard.click();
    });

    // Verify Result page is displayed and NOT blank
    expect(container.textContent).toContain('ポップスポーティ');
    expect(container.textContent).toContain('診断結果発表！');
    expect(container.textContent).toContain('あなたに似合う！ラッキーカラーパレット');
    expect(container.textContent).toContain('おすすめヘアアレンジ集');
    expect(container.textContent).toContain('おすすめファッションコーディネート');
  });

  it('Given 診断結果画面で「ほかの全タイプも見てみる」ボタンをクリックしたとき、モーダルが正常に開くこと', async () => {
    await act(async () => {
      root.render(<App />);
    });

    // Direct navigate to result view by selecting from modal
    const headerBtn = container.querySelector('#view-all-types-btn') as HTMLButtonElement;
    await act(async () => {
      headerBtn.click();
    });

    const targetCard = container.querySelector(`#style-card-${StyleTypeId.SWEET_GIRLY}`) as HTMLElement;
    await act(async () => {
      targetCard.click();
    });

    // Now in Result view, click bottom button
    const bottomBtn = container.querySelector('#bottom-all-types-btn') as HTMLButtonElement;
    expect(bottomBtn).not.toBeNull();

    await act(async () => {
      bottomBtn.click();
    });

    expect(container.querySelector('#all-types-modal-dialog')).not.toBeNull();
    expect(container.textContent).toContain('スタイル大図鑑');
  });

  it('Given モーダルが開いているとき、シークレットスタイルのカードを選択するとシークレット用の覚醒ヘッダーが表示されること', async () => {
    await act(async () => {
      root.render(<App />);
    });

    const headerBtn = container.querySelector('#view-all-types-btn') as HTMLButtonElement;
    await act(async () => {
      headerBtn.click();
    });

    // Select a secret style (secret_unicorn)
    const secretCard = container.querySelector(`#style-card-${StyleTypeId.SECRET_UNICORN}`) as HTMLElement;
    expect(secretCard).not.toBeNull();

    await act(async () => {
      secretCard.click();
    });

    // Verify secret celebration banner is shown
    expect(container.textContent).toContain('伝説のシークレットスタイル覚醒！');
    expect(container.textContent).toContain('レインボーユニコーンエンジェル');
  });

  it('Given モーダルが開いているとき、カテゴリータブ切り替えや検索が正常に動作すること', async () => {
    await act(async () => {
      root.render(<App />);
    });

    const headerBtn = container.querySelector('#view-all-types-btn') as HTMLButtonElement;
    await act(async () => {
      headerBtn.click();
    });

    // Filter by secret category button
    const buttons = Array.from(container.querySelectorAll('button'));
    const secretCategoryBtn = buttons.find((b) => b.textContent?.includes('シークレット (5)'));
    expect(secretCategoryBtn).toBeDefined();

    await act(async () => {
      secretCategoryBtn?.click();
    });

    // Only secret styles should be visible in the grid
    const visibleCards = container.querySelectorAll('#modal-styles-grid [id^="style-card-"]');
    expect(visibleCards.length).toBe(5);
  });
});
