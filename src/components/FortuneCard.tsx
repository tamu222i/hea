import React from 'react';
import { LuckyItem, DailyFortune } from '../domain/models/FortuneTypes';
import { FortuneService } from '../domain/services/FortuneService';
import { Sparkles, Gift, Compass, Award, Star } from 'lucide-react';

interface FortuneCardProps {
  styleTypeId?: string;
  typeId?: string;
  styleName: string;
  styleCategory?: string;
  category?: string;
  answeredOptions?: { questionId: string; optionId: string }[];
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
  answeredOptions,
  onItemCollected,
  onCollectItem,
  onOpenCollection,
}) => {
  const actualTypeId = styleTypeId || typeId || 'default-style';
  const actualCategory = styleCategory || category;
  const fortuneService = React.useMemo(() => new FortuneService(), []);

  // 5問回答の内容から、10段階評価おみくじとスタイル連動ラッキーアイテムを導出
  const fortune: DailyFortune = React.useMemo(() => {
    return fortuneService.getOmikujiForAnswers(
      answeredOptions,
      actualTypeId,
      actualCategory
    );
  }, [fortuneService, answeredOptions, actualTypeId, actualCategory]);

  const { omikuji, luckyItem } = fortune;

  // アイテム獲得を通知
  React.useEffect(() => {
    if (onItemCollected) {
      onItemCollected(luckyItem);
    }
    if (onCollectItem) {
      onCollectItem(luckyItem.id);
    }
  }, [luckyItem, onItemCollected, onCollectItem]);

  return (
    <div
      id="fortune-result-card"
      className="w-full bg-gradient-to-br from-amber-50/80 via-rose-50/60 to-purple-50/80 rounded-3xl p-5 sm:p-7 border-2 border-amber-300/80 shadow-lg relative overflow-hidden my-6"
    >
      {/* Decorative background blurs */}
      <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-amber-200/40 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-8 -top-8 w-40 h-40 bg-pink-200/40 rounded-full blur-2xl pointer-events-none" />

      {/* Top Banner: 5問回答のおみくじ発表 */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5 relative z-10 pb-4 border-b border-amber-200/70">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-400 to-pink-500 text-white flex items-center justify-center shadow-md shadow-pink-200 shrink-0">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-amber-200/80 text-amber-900">
                5問クイズ回答特典
              </span>
              <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700">
                おみくじ10段階評価
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-800 mt-1">
              今日のスタイルおみくじ結果
            </h3>
          </div>
        </div>

        <div className="text-right text-xs text-slate-500 font-bold bg-white/80 px-3 py-1.5 rounded-xl border border-amber-100 shadow-xs">
          📅 {fortune.dateString}
        </div>
      </div>

      {/* 10段階おみくじ評価 メインバナー */}
      <div
        id="omikuji-grade-box"
        className={`bg-white rounded-3xl p-5 sm:p-6 border-2 ${omikuji.glowColor} shadow-md relative z-10 mb-5 overflow-hidden`}
      >
        {/* Background Stamp Effect */}
        <div className="absolute right-4 -bottom-4 select-none opacity-10 text-8xl font-black text-slate-900 pointer-events-none">
          {omikuji.name}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Omikuji Plaque Badge */}
            <div
              className={`w-20 h-24 sm:w-24 sm:h-28 rounded-2xl ${omikuji.badgeColor} flex flex-col items-center justify-center shadow-md shrink-0 border-2 border-white/60`}
            >
              <span className="text-[10px] tracking-widest text-white/90 font-medium">
                {omikuji.reading}
              </span>
              <span className="text-3xl sm:text-4xl font-black tracking-wider text-white">
                {omikuji.name}
              </span>
              <span className="text-[9px] font-bold bg-black/20 text-white px-2 py-0.5 rounded-full mt-1">
                Lv.{omikuji.level}/10
              </span>
            </div>

            {/* Omikuji text & catchphrase */}
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-1.5">
                <span>10段階中: 第 {11 - omikuji.level} 位</span>
                <span>•</span>
                <span>運気スコア {omikuji.score}点</span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                {omikuji.catchphrase}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 leading-relaxed">
                {omikuji.description}
              </p>
            </div>
          </div>

          {/* 10-tier visual gauge */}
          <div className="w-full sm:w-44 bg-slate-50 p-3 rounded-2xl border border-slate-200 shrink-0">
            <div className="flex justify-between items-center text-[11px] font-bold text-slate-600 mb-1">
              <span>おみくじ10段階</span>
              <span className="text-amber-700 font-black">{omikuji.level} / 10</span>
            </div>
            <div className="grid grid-cols-10 gap-0.5 h-3 bg-slate-200 rounded-full p-0.5">
              {Array.from({ length: 10 }).map((_, idx) => {
                const stepLevel = idx + 1;
                const isFilled = stepLevel <= omikuji.level;
                return (
                  <div
                    key={idx}
                    className={`h-full rounded-xs transition-all ${
                      isFilled
                        ? stepLevel >= 8
                          ? 'bg-rose-500'
                          : stepLevel >= 5
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                        : 'bg-transparent'
                    }`}
                  />
                );
              })}
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-bold">
              <span>1(大凶)</span>
              <span>5(末吉)</span>
              <span>10(大吉)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Lucky Item Display (全100種から診断された1点) */}
      <div
        id="lucky-item-box"
        className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-200 shadow-sm relative z-10"
      >
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Gift className="w-3.5 h-3.5" />
              本日あなたのラッキーアイテム（全100種類中）
            </span>
          </div>

          {onOpenCollection && (
            <button
              id="fortune-card-collection-btn"
              onClick={onOpenCollection}
              className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1 bg-pink-50 hover:bg-pink-100 px-3 py-1 rounded-xl transition-colors cursor-pointer border border-pink-200"
            >
              <Award className="w-3.5 h-3.5" />
              <span>集めたアイテム図鑑</span>
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          {/* Emoji & ID avatar */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-amber-100 via-pink-100 to-purple-100 border-2 border-amber-300 flex flex-col items-center justify-center shadow-inner shrink-0 relative">
            <span className="text-3xl sm:text-4xl select-none animate-bounce-short">
              {luckyItem.emoji}
            </span>
            <span className="absolute bottom-1 right-2 text-[9px] font-black text-amber-800 bg-white/90 px-1.5 py-0.2 rounded-full border border-amber-200">
              No.{luckyItem.id}/100
            </span>
          </div>

          {/* Item details */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700">
                {luckyItem.categoryLabel}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                ラッキーカラー: <strong>{luckyItem.luckyColor}</strong>
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                ラッキーナンバー: <strong>{fortune.luckyNumber}</strong>
              </span>
            </div>

            <h4 className="text-lg sm:text-xl font-black text-slate-800 mb-1.5 flex items-center justify-center sm:justify-start gap-1.5">
              <span>{luckyItem.name}</span>
            </h4>

            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed bg-amber-50/60 p-3 rounded-2xl border border-amber-200/60">
              💡 <strong>開運ハッピーアドバイス:</strong> {luckyItem.advice}
            </p>

            <div className="mt-2 text-[11px] text-slate-500 font-medium flex items-center justify-center sm:justify-start gap-1">
              <Compass className="w-3.5 h-3.5 text-slate-400" />
              <span>「{styleName}」との相性もバッチリ！学校やお出かけで身につけてみてね♪</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Fortune Pillars (運勢詳細) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4 relative z-10">
        <div className="p-3 rounded-2xl bg-white/90 border border-pink-200 text-xs shadow-2xs">
          <div className="font-black text-pink-700 flex items-center gap-1 mb-1">
            <span>👗 ファッション運</span>
          </div>
          <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
            {fortune.fashionLuck}
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-white/90 border border-purple-200 text-xs shadow-2xs">
          <div className="font-black text-purple-700 flex items-center gap-1 mb-1">
            <span>🤝 なかよし友情運</span>
          </div>
          <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
            {fortune.socialLuck}
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-white/90 border border-amber-200 text-xs shadow-2xs">
          <div className="font-black text-amber-700 flex items-center gap-1 mb-1">
            <span>📖 まなび・集中運</span>
          </div>
          <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
            {fortune.studyLuck}
          </p>
        </div>
      </div>
    </div>
  );
};
