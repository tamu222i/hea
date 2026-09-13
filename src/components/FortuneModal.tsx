import React, { useState, useMemo } from 'react';
import { LuckyItem, DailyFortune, LuckyItemCategory } from '../domain/models/FortuneTypes';
import { FortuneService } from '../domain/services/FortuneService';
import { Sparkles, X, Star, Dices, Gift, Search, Award } from 'lucide-react';

interface FortuneModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectedItemIds: number[];
  onCollectItem: (id: number) => void;
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
  onCollectItem,
}) => {
  const fortuneService = useMemo(() => new FortuneService(), []);
  const allItems = useMemo(() => fortuneService.getAllLuckyItems(), [fortuneService]);
  const dailyFortune: DailyFortune = useMemo(
    () => fortuneService.getDailyFortune(),
    [fortuneService]
  );

  const [activeTab, setActiveTab] = useState<'fortune' | 'collection'>('fortune');
  const [selectedCategory, setSelectedCategory] = useState<'all' | LuckyItemCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItem, setActiveItem] = useState<LuckyItem>(dailyFortune.luckyItem);
  const [isDrawing, setIsDrawing] = useState(false);

  // 初回表示時に今日のアイテムをコレクションに追加
  React.useEffect(() => {
    if (isOpen && dailyFortune.luckyItem) {
      onCollectItem(dailyFortune.luckyItem.id);
    }
  }, [isOpen, dailyFortune.luckyItem, onCollectItem]);

  // ガチャ・おみくじを引く
  const handleDrawGacha = () => {
    setIsDrawing(true);
    let count = 0;
    const interval = setInterval(() => {
      const item = fortuneService.drawRandomLuckyItem();
      setActiveItem(item);
      count++;
      if (count > 7) {
        clearInterval(interval);
        const finalItem = fortuneService.drawRandomLuckyItem();
        setActiveItem(finalItem);
        setIsDrawing(false);
        onCollectItem(finalItem.id);
      }
    }, 70);
  };

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
    () => new Set(collectedItemIds).size,
    [collectedItemIds]
  );

  if (!isOpen) return null;

  return (
    <div
      id="fortune-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="fortune-modal-dialog"
        className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-amber-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-amber-100 flex items-center justify-between bg-gradient-to-r from-amber-50 via-rose-50 to-purple-50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-pink-500 text-white flex items-center justify-center shadow-md shadow-amber-300">
              <Sparkles className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-800">
                  スタイル占い＆ラッキーアイテム100
                </h3>
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 text-white shadow-xs">
                  全100種
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                集めたラッキーアイテム: <strong>{collectedCount}</strong> / 100種類
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

        {/* Navigation Tabs */}
        <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/70 flex items-center gap-2">
          <button
            id="tab-fortune-view"
            onClick={() => setActiveTab('fortune')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'fortune'
                ? 'bg-white text-pink-600 shadow-xs border border-pink-200'
                : 'text-slate-600 hover:bg-white/80'
            }`}
          >
            <span>🔮 今日の運勢＆おみくじ</span>
          </button>

          <button
            id="tab-collection-view"
            onClick={() => setActiveTab('collection')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'collection'
                ? 'bg-white text-pink-600 shadow-xs border border-pink-200'
                : 'text-slate-600 hover:bg-white/80'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>全100種アイテム図鑑 ({collectedCount}/100)</span>
          </button>
        </div>

        {/* Tab 1: Today's Fortune & Gacha */}
        {activeTab === 'fortune' && (
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
            {/* Daily Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50/60 via-pink-50/40 to-purple-50/60 border border-amber-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  📅 {dailyFortune.dateString} の運勢
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-500">ラッキー度:</span>
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < dailyFortune.overallStars
                            ? 'fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Active lucky item showcase */}
              <div className="bg-white rounded-2xl p-4 border border-amber-200/80 shadow-sm flex flex-col sm:flex-row items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-100 via-pink-100 to-purple-100 border border-amber-300 flex flex-col items-center justify-center shrink-0">
                  <span className="text-4xl">{activeItem.emoji}</span>
                  <span className="text-[9px] font-black text-amber-800">
                    No.{activeItem.id}
                  </span>
                </div>

                <div className="flex-1 text-center sm:text-left min-w-0">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-pink-100 text-pink-700">
                      {activeItem.categoryLabel}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      ラッキーカラー: {activeItem.luckyColor}
                    </span>
                  </div>

                  <h4 className="text-lg font-black text-slate-800 flex items-center justify-center sm:justify-start gap-1 mb-1">
                    <Gift className="w-4 h-4 text-pink-500" />
                    <span>{activeItem.name}</span>
                  </h4>

                  <p className="text-xs text-slate-600 font-medium bg-amber-50/50 p-2 rounded-xl border border-amber-100">
                    {activeItem.advice}
                  </p>
                </div>
              </div>

              {/* Gacha draw button */}
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <p className="text-xs text-slate-500 font-medium">
                  🎲 おみくじを引くと全100種類のアイテムをコレクションできるよ！
                </p>
                <button
                  id="modal-gacha-btn"
                  onClick={handleDrawGacha}
                  disabled={isDrawing}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-pink-500 hover:from-amber-500 hover:to-pink-600 text-white text-xs font-black shadow-md shadow-pink-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Dices className={`w-4 h-4 ${isDrawing ? 'animate-spin' : ''}`} />
                  <span>{isDrawing ? 'おみくじを振っています...' : '🎲 100種からおみくじを引く！'}</span>
                </button>
              </div>
            </div>

            {/* Detailed Fortune Categories */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-pink-50/50 border border-pink-100">
                <div className="text-xs font-black text-pink-700 mb-1">👗 ファッション運</div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {dailyFortune.fashionLuck}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100">
                <div className="text-xs font-black text-purple-700 mb-1">🤝 友情・なかよし運</div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {dailyFortune.socialLuck}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100">
                <div className="text-xs font-black text-amber-700 mb-1">✏️ 勉強・集中運</div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {dailyFortune.studyLuck}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: 100 Lucky Items Encyclopedia */}
        {activeTab === 'collection' && (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Search and Category Filter */}
            <div className="p-3 sm:p-4 border-b border-slate-100 bg-white space-y-2.5">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="アイテム名、カテゴリ、カラーで検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {CATEGORY_TABS.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                      selectedCategory === cat.key
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Grid of 100 items */}
            <div
              id="lucky-items-grid"
              className="p-3 sm:p-4 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 gap-2.5"
            >
              {filteredItems.map((item) => {
                const isCollected = collectedItemIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    id={`lucky-item-${item.id}`}
                    onClick={() => {
                      setActiveItem(item);
                      setActiveTab('fortune');
                    }}
                    className={`p-2.5 rounded-2xl border transition-all text-left flex items-start gap-2 cursor-pointer ${
                      isCollected
                        ? 'bg-white border-amber-200 hover:border-amber-400 hover:shadow-sm'
                        : 'bg-slate-50/70 border-dashed border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex flex-col items-center justify-center shrink-0">
                      <span className="text-xl">{item.emoji}</span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[9px] font-black text-amber-800 bg-amber-100/80 px-1.5 py-0.2 rounded-full">
                          No.{item.id}
                        </span>
                        {isCollected ? (
                          <span className="text-[9px] font-black text-pink-600">
                            GET!
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-slate-400">
                            未獲得
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-black text-slate-800 truncate">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {item.categoryLabel} • {item.luckyColor}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
