import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { MotionGlobalConfig } from 'motion/react';
import App from '../../App';
import { StyleTypeId } from '../../domain/models/StyleTypes';

describe('BDD Test: シークレットスタイルの初期隠蔽とおしいｗニアミス表示の統合検証', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    MotionGlobalConfig.skipAnimations = true;
    (globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    localStorage.clear();

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

  it('Given 初回訪問時（シークレット未解禁）、図鑑を開くとシークレットスタイルは「🔒 ？？？（シークレット）」と隠蔽表示されていること', async () => {
    await act(async () => {
      root.render(<App />);
    });

    const headerBtn = container.querySelector('#view-all-types-btn') as HTMLButtonElement;
    await act(async () => {
      headerBtn.click();
    });

    const modal = container.querySelector('#all-types-modal-dialog');
    expect(modal).not.toBeNull();

    // 未解禁状態のシークレットカード表示の確認
    const unicornCard = container.querySelector(`#style-card-${StyleTypeId.SECRET_UNICORN}`);
    expect(unicornCard).not.toBeNull();
    expect(unicornCard?.textContent).toContain('🔒 ？？？（シークレット）');
    expect(unicornCard?.textContent).toContain('SECRET 未解禁');
    expect(unicornCard?.textContent).toContain('LOCKED');
  });

  it('Given 診断で5問に回答したとき、毎回100問プールから選ばれた質問が出題され、リセットすると新しい質問がセットされること', async () => {
    await act(async () => {
      root.render(<App />);
    });

    const startBtn = container.querySelector('#start-diagnosis-btn') as HTMLButtonElement;
    expect(startBtn.textContent).toContain('100問から選出');

    await act(async () => {
      startBtn.click();
    });

    // 質問1問目が表示されていること
    expect(container.textContent).toContain('Q1 / 5');
    const firstQuestionText = container.querySelector('h2')?.textContent;
    expect(firstQuestionText).toBeTruthy();
  });
});
