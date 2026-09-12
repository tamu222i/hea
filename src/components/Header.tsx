import React from 'react';
import { Sparkles, RefreshCw, BookOpen } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  onOpenTypesList: () => void;
  isResultView?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onReset, onOpenTypesList, isResultView }) => {
  return (
    <header id="app-header" className="w-full bg-white/90 backdrop-blur-md border-b border-pink-100 sticky top-0 z-40 px-4 py-3 sm:px-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div 
          onClick={onReset}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
          id="header-logo"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-400 to-amber-300 flex items-center justify-center text-white shadow-sm shadow-pink-200 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-bold tracking-wider text-pink-500 uppercase bg-pink-50 px-2 py-0.5 rounded-full">小学生スタイル診断</span>
            <h1 className="text-base sm:text-lg font-black text-slate-800 tracking-tight leading-tight">
              ヘア＆ファッション図鑑
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="view-all-types-btn"
            onClick={onOpenTypesList}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-colors border border-slate-200/80"
          >
            <BookOpen className="w-4 h-4 text-pink-500" />
            <span className="hidden sm:inline">全5タイプを見る</span>
            <span className="sm:hidden">タイプ一覧</span>
          </button>

          {isResultView && (
            <button
              id="reset-diagnosis-btn"
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-pink-600 bg-pink-50 hover:bg-pink-100 rounded-xl transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>もう一度診断</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
