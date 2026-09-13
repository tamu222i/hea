import React, { useState } from 'react';
import { LuckyItem, DailyFortune } from '../domain/models/FortuneTypes';
import { FortuneService } from '../domain/services/FortuneService';
import { Sparkles, Dices, Star, Gift, Compass } from 'lucide-react';

interface FortuneCardProps {
  styleTypeId?: string;
  typeId?: string;
  styleName: string;
  styleCategory?: string;
  category?: string;
  onItemCollected?: (item: LuckyItem) => void;
  onCollectItem?: (id: number) => void;
  onOpenCollection?: () => void;
}

export const FortuneCard: React.FC<FortuneCardProps> = ({
  styleTypeId,
  typeId,
  styleName,
  styleCategory,
  category,
  onItemCollected,
  onCollectItem,
  onOpenCollection,
}) => {
  const actualTypeId = styleTypeId || typeId || 'default-style';
  const actualCategory = styleCategory || category;
  const fortuneService = React.useMemo(() => new FortuneService(), []);

  // 今日の占い基本データ
  const dailyFortune: DailyFortune = React.useMemo(
    () => fortuneService.getDailyFortune(),
    [fortuneService]
  );

  // このスタイルにぴったりのラッキーアイテムを初期設定
  const initialItem = React.useMemo(
    () => fortuneService.getLuckyItemForStyle(actualTypeId, actualCategory),
    [fortuneService, actualTypeId, actualCategory]
  );

  const [currentItem, setCurrentItem] = useState<LuckyItem>(initialItem);
  const [isRolling, setIsRolling] = useState(false);

  // 初回ロード時にアイテム獲得を親へ通知
  React.useEffect(() => {
    if (onItemCollected) {
      onItemCollected(currentItem);
    }
    if (onCollectItem) {
      onCollectItem(currentItem.id);
    }
  }, [currentItem, onItemCollected, onCollectItem]);

  // 100種類の中からおみくじガチャを引く
  const handleRollAgain = () => {
    setIsRolling(true);
    let count = 0;
    const interval = setInterval(() => {
      const randomItem = fortuneService.drawRandomLuckyItem();
      setCurrentItem(randomItem);
      count++;
      if (count > 6) {
        clearInterval(interval);
        const finalItem = fortuneService.drawRandomLuckyItem();
        setCurrentItem(finalItem);
        setIsRolling(false);
        if (onItemCollected) {
          onItemCollected(finalItem);
        }
      }
    }, 80);
  };

  return (
    <div
      id="fortune-result-card"
      className="w-full bg-gradient-to-br from-amber-50/70 via-rose-50/50 to-purple-50/70 rounded-3xl p-5 sm:p-6 border-2 border-amber-200/80 shadow-md relative overflow-hidden"
    >
      {/* Decorative background badges */}
      <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-200/30 rounded-full blur-xl pointer-events-none" />
      <div className="absolute -left-6 -top-6 w-32 h-32 bg-pink-200/30 rounded-full blur-xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex items-center justify-between gap-3 mb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-pink-500 text-white flex items-center justify-center shadow-md shadow-amber-300">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-800">
                今日のスタイル占い＆ラッキーアイテム
              </h3>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-pink-500 text-white shadow-xs">
                全100種類
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {dailyFortune.dateString} のあなたの運勢をチェック♪
            </p>
          </div>
        </div>

        {/* Fortune Stars */}
        <div className="flex flex-col items-end">
          <div className="text-[11px] font-black text-amber-800 flex items-center gap-1">
            ラッキー度
          </div>
          <div className="flex items-center text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < dailyFortune.overallStars
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Lucky Item Display */}
      <div
        id="lucky-item-box"
        className={`bg-white rounded-2xl p-4 sm:p-5 border border-amber-200 shadow-sm relative z-10 transition-all ${
          isRolling ? 'scale-[0.99] opacity-80' : 'scale-100 opacity-100'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          {/* Emoji & ID avatar */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-amber-100 via-pink-100 to-purple-100 border-2 border-amber-300 flex flex-col items-center justify-center shadow-inner shrink-0 relative">
            <span className="text-3xl sm:text-4xl select-none animate-bounce-short">
              {currentItem.emoji}
            </span>
            <span className="absolute bottom-1 right-2 text-[9px] font-black text-amber-800 bg-white/90 px-1.5 py-0.2 rounded-full border border-amber-200">
              No.{currentItem.id}/100
            </span>
          </div>

          {/* Item details */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1 flex-wrap">
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700">
                {currentItem.categoryLabel}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                ラッキーカラー: <strong>{currentItem.luckyColor}</strong>
              </span>
            </div>

            <h4 className="text-lg sm:text-xl font-black text-slate-800 mb-1.5 flex items-center justify-center sm:justify-start gap-1.5">
              <Gift className="w-4 h-4 text-pink-500" />
              <span>{currentItem.name}</span>
            </h4>

            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed bg-amber-50/50 p-2.5 rounded-xl border border-amber-100 mb-3">
              💡 <strong>ハッピーアドバイス:</strong> {currentItem.advice}
            </p>

            {/* Lucky Roll Button */}
            <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2 pt-1 border-t border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-slate-400" />
                {styleName} との相性もバッチリ！
              </span>

              <div className="flex items-center gap-2">
                <button
                  id="draw-lucky-item-btn"
                  onClick={handleRollAgain}
                  disabled={isRolling}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-pink-500 hover:from-amber-500 hover:to-pink-600 text-white text-xs font-black shadow-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Dices className={`w-3.5 h-3.5 ${isRolling ? 'animate-spin' : ''}`} />
                  <span>{isRolling ? '占い中...' : '🎲 100種から別のおみくじを引く'}</span>
                </button>

                {onOpenCollection && (
                  <button
                    id="fortune-card-collection-btn"
                    onClick={onOpenCollection}
                    className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold border border-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>🔮 100種図鑑</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Fortune Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3 relative z-10">
        <div className="p-2.5 rounded-xl bg-white/90 border border-pink-100 text-xs">
          <div className="font-bold text-pink-700 flex items-center gap-1 mb-0.5">
            <span>👗 ファッション運</span>
          </div>
          <p className="text-[11px] text-slate-600 font-medium leading-tight">
            {dailyFortune.fashionLuck}
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-white/90 border border-purple-100 text-xs">
          <div className="font-bold text-purple-700 flex items-center gap-1 mb-0.5">
            <span>🤝 なかよし友情運</span>
          </div>
          <p className="text-[11px] text-slate-600 font-medium leading-tight">
            {dailyFortune.socialLuck}
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-white/90 border border-amber-100 text-xs">
          <div className="font-bold text-amber-700 flex items-center gap-1 mb-0.5">
            <span>📖 まなび・集中運</span>
          </div>
          <p className="text-[11px] text-slate-600 font-medium leading-tight">
            {dailyFortune.studyLuck}
          </p>
        </div>
      </div>
    </div>
  );
};
