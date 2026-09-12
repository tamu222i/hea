import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../../App';

describe('App Component Rendering Test', () => {
  it('renders App without crashing', () => {
    expect(() => {
      const html = renderToString(<App />);
      expect(html).toContain('小学生ヘア＆ファッションスタイル診断');
    }).not.toThrow();
  });
});
