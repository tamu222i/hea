import React, { useState, useMemo } from 'react';
import { LuckyItem, LuckyItemCategory } from '../domain/models/FortuneTypes';
import { FortuneService } from '../domain/services/FortuneService';
import { Sparkles, X, Gift, Search, Award, CheckCircle2, Lock } from 'lucide-react';

interface FortuneModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectedItemIds: number[];
  onCollectItem?: (id: number) => void;
}

const CATEGORY_TABS: { key: 'all' | LuckyItemCategory; label: string; icon: string }[] = [
  { key: 'all', label: 'すべて (100)', icon: '✨' },
  { key: 'stationery', label: '文房具 (20)', icon: '✏️' },
  { key: 'accessory', label: 'アクセ・ヘア (20)', icon: '🎀' },
  { key: 'sweets', label: 'おやつ (15)', icon: '🍰' },
  { key: 'goods', label: '持ち物 (15)', icon: '👝' },
  { key: 'motif', label: 'シンボル (15)', icon: '🍀' },
  { key: 'action', label: 'アクション (15)', icon: '💖' },
];

export const FortuneModal: React.FC<FortuneModalProps> = ({
  isOpen,
  onClose,
  collectedItemIds,
}) => {
  const fortuneService = useMemo(() => new FortuneService(), []);
  const allItems = useMemo(() => fortuneService.getAllLuckyItems(), [fortuneService]);

  const [selectedCategory, setSelectedCategory] = useState<'all' | LuckyItemCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<LuckyItem | null>(null);

  // 100種類のフィルタリング
  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.luckyColor.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [allItems, selectedCategory, searchQuery]);

  const collectedCount = useMemo(
    () => collectedItemIds.length,
    [collectedItemIds]
  );

  if (!isOpen) return null;

  return (
    <div
      id="fortune-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="fortune-modal-content"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-amber-200 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-50 via-rose-50 to-pink-50 border-b border-amber-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-pink-500 text-white flex items-center justify-center shadow-md shadow-amber-300">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-800">
                  ラッキーアイテム図鑑（全100種）
                </h3>
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 text-white shadow-xs">
                  {collectedCount} / 100 獲得
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                5問クイズに答えると、あなた専用の10段階おみくじ＆アイテムが届くよ！
              </p>
            </div>
          </div>

          <button
            id="close-fortune-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors shadow-xs border border-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex flex-col gap-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedCategory(tab.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 shrink-0 ${
                  selectedCategory === tab.key
                    ? 'bg-amber-400 text-amber-950 shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="アイテム名、カテゴリ、色で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>
        </div>

        {/* Item Grid */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {filteredItems.map((item) => {
              const isCollected = collectedItemIds.includes(item.id);
              const isSelected = selectedItem?.id === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer relative flex flex-col items-center text-center ${
                    isSelected
                      ? 'border-amber-400 bg-amber-50/80 shadow-sm scale-[1.02]'
                      : isCollected
                      ? 'border-pink-200 bg-white hover:border-pink-300 hover:shadow-2xs'
                      : 'border-slate-200 bg-slate-50/70 opacity-60 hover:opacity-80'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-white border border-amber-100 flex items-center justify-center text-2xl mb-1.5 shadow-2xs relative">
                    {isCollected ? (
                      <span>{item.emoji}</span>
                    ) : (
                      <Lock className="w-4 h-4 text-slate-300" />
                    )}
                    {isCollected && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 absolute -top-1 -right-1 bg-white rounded-full" />
                    )}
                  </div>

                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded-full mb-1">
                    No.{item.id}
                  </span>

                  <h5 className="text-xs font-black text-slate-800 line-clamp-1">
                    {isCollected ? item.name : '？？？？'}
                  </h5>

                  <span className="text-[10px] text-slate-500 mt-0.5">
                    {item.categoryLabel}
                  </span>
                </div>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-xs">
              該当するアイテムが見つかりませんでした
            </div>
          )}
        </div>

        {/* Selected Item Detail Drawer */}
        {selectedItem && (
          <div className="p-4 bg-amber-50/70 border-t border-amber-200 flex flex-col sm:flex-row items-center gap-3">
            <div className="text-3xl p-2 bg-white rounded-xl border border-amber-200 shrink-0">
              {collectedItemIds.includes(selectedItem.id) ? selectedItem.emoji : '🔒'}
            </div>
            <div className="flex-1 text-center sm:text-left min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-0.5">
                <span className="text-xs font-black text-slate-800">
                  No.{selectedItem.id} {collectedItemIds.includes(selectedItem.id) ? selectedItem.name : '未獲得アイテム'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-pink-100 text-pink-700">
                  {selectedItem.categoryLabel}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-100 text-amber-800">
                  ラッキーカラー: {selectedItem.luckyColor}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {collectedItemIds.includes(selectedItem.id)
                  ? selectedItem.advice
                  : '5問クイズに答えると、運勢に合わせてこのアイテムが解禁されるよ！'}
              </p>
            </div>
            <button
              onClick={() => setSelectedItem(null)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 px-2 py-1 cursor-pointer shrink-0"
            >
              とじる
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
