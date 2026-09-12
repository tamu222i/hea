import React, { useState, useMemo } from 'react';
import { StyleProfile, StyleTypeId } from '../domain/models/StyleTypes';
import { StyleIllustration } from './illustrations/StyleIllustrations';
import { X, Check, Search, Sparkles, Lock, Unlock } from 'lucide-react';

interface AllTypesModalProps {
  isOpen: boolean;
  onClose: () => void;
  allStyles: Record<StyleTypeId, StyleProfile>;
  currentTypeId?: StyleTypeId;
  onSelectType: (typeId: StyleTypeId) => void;
}

export const AllTypesModal: React.FC<AllTypesModalProps> = ({
  isOpen,
  onClose,
  allStyles,
  currentTypeId,
  onSelectType,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [revealedSecrets, setRevealedSecrets] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const styleList: StyleProfile[] = Object.values(allStyles);

  // Extract unique categories in order
  const categories = useMemo(() => {
    const set = new Set<string>();
    styleList.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return Array.from(set);
  }, [styleList]);

  // Filter styles based on category & search query
  const filteredStyles = useMemo(() => {
    return styleList.filter((style) => {
      // Category check
      if (selectedCategory === 'secret') {
        if (!style.isSecret) return false;
      } else if (selectedCategory !== 'all') {
        if (style.category !== selectedCategory) return false;
      }

      // Search query check
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchName = style.typeName.toLowerCase().includes(query);
        const matchCatch = style.catchphrase.toLowerCase().includes(query);
        const matchDesc = style.description.toLowerCase().includes(query);
        const matchCategory = style.category?.toLowerCase().includes(query);
        return matchName || matchCatch || matchDesc || matchCategory;
      }

      return true;
    });
  }, [styleList, selectedCategory, searchQuery]);

  const toggleSecretHint = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRevealedSecrets((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const secretCount = styleList.filter((s) => s.isSecret).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl border border-pink-100 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-pink-50 via-purple-50 to-sky-50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-800 flex items-center gap-1.5">
                <span>📖 スタイル大図鑑</span>
                <span className="text-xs bg-pink-500 text-white font-bold px-2 py-0.5 rounded-full">
                  全{styleList.length}種
                </span>
                <span className="text-xs bg-amber-400 text-amber-950 font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <Sparkles className="w-3 h-3" />
                  シークレット{secretCount}種
                </span>
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              タップしてフルコーディネートやヘアアレンジを自由に見られるよ！
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-slate-400 hover:text-slate-700 shadow-sm border border-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-3 sm:p-4 border-b border-slate-100 bg-white space-y-2.5">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="スタイル名、キーワード、好きな色で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                クリア
              </button>
            )}
          </div>

          {/* Category Chips Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`shrink-0 px-3 py-1.5 rounded-full font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              すべて ({styleList.length})
            </button>

            <button
              onClick={() => setSelectedCategory('secret')}
              className={`shrink-0 px-3 py-1.5 rounded-full font-bold flex items-center gap-1 transition-all ${
                selectedCategory === 'secret'
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 shadow-sm'
                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              🌟 シークレット ({secretCount})
            </button>

            {categories
              .filter((c) => !c.includes('シークレット'))
              .map((cat) => {
                const count = styleList.filter((s) => s.category === cat).length;
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`shrink-0 px-3 py-1.5 rounded-full font-bold transition-all ${
                      isSelected
                        ? 'bg-pink-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
          </div>
        </div>

        {/* Content Grid */}
        <div className="p-3 sm:p-5 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredStyles.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 font-medium">
              見つかりませんでした。別の言葉で検索してみてね！
            </div>
          ) : (
            filteredStyles.map((style) => {
              const isSelected = style.typeId === currentTypeId;
              const isSecret = !!style.isSecret;
              const isHintRevealed = revealedSecrets[style.typeId];

              return (
                <div
                  key={style.typeId}
                  onClick={() => {
                    onSelectType(style.typeId);
                    onClose();
                  }}
                  className={`p-3.5 rounded-2xl border-2 transition-all flex items-start gap-3 cursor-pointer group relative ${
                    isSecret
                      ? isSelected
                        ? 'border-amber-400 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-md ring-2 ring-amber-300'
                        : 'border-amber-200 bg-gradient-to-br from-amber-50/50 via-yellow-50/30 to-purple-50/30 hover:border-amber-400 hover:shadow-md'
                      : isSelected
                      ? 'border-pink-500 bg-pink-50/60 shadow-sm ring-2 ring-pink-300'
                      : 'border-slate-100 hover:border-pink-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="shrink-0">
                    <StyleIllustration typeId={style.typeId} className="w-16 h-16 sm:w-20 sm:h-20" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      {isSecret && (
                        <span className="text-[10px] font-black bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                          <Sparkles className="w-2.5 h-2.5" />
                          SECRET
                        </span>
                      )}
                      {style.category && !isSecret && (
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md">
                          {style.category}
                        </span>
                      )}
                      {isSelected && (
                        <span className="text-[10px] font-bold text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <Check className="w-3 h-3" />
                          診断結果
                        </span>
                      )}
                    </div>

                    <h4 className={`text-xs sm:text-sm font-black truncate ${
                      isSecret ? 'text-amber-900 group-hover:text-amber-600' : 'text-slate-800 group-hover:text-pink-600'
                    }`}>
                      {style.typeName}
                    </h4>

                    <p className={`text-[11px] font-bold truncate mb-1 ${
                      isSecret ? 'text-amber-700' : 'text-pink-600'
                    }`}>
                      {style.catchphrase}
                    </p>

                    <p className="text-[11px] text-slate-500 font-medium line-clamp-2 leading-relaxed">
                      {style.description}
                    </p>

                    {/* Secret Hint Toggle */}
                    {isSecret && style.secretHint && (
                      <div className="mt-2 pt-1.5 border-t border-amber-200/60">
                        <button
                          type="button"
                          onClick={(e) => toggleSecretHint(style.typeId, e)}
                          className="text-[10px] font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 bg-amber-100/80 px-2 py-0.5 rounded-full transition-colors"
                        >
                          {isHintRevealed ? <Unlock className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
                          {isHintRevealed ? '出現ヒントを隠す' : '出現ヒントを見る'}
                        </button>
                        {isHintRevealed && (
                          <p className="mt-1 text-[10px] font-bold text-amber-900 bg-amber-100/50 p-1.5 rounded-lg">
                            💡 {style.secretHint}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>表示中: {filteredStyles.length} / {styleList.length}スタイル</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition-colors shadow-sm"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
