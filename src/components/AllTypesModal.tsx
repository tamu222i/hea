import React, { useState, useMemo } from 'react';
import { StyleProfile, StyleTypeId } from '../domain/models/StyleTypes';
import { StyleIllustration } from './illustrations/StyleIllustrations';
import { X, Check, Search, Sparkles, Lock, Unlock, Flame, HelpCircle } from 'lucide-react';

interface AllTypesModalProps {
  isOpen: boolean;
  onClose: () => void;
  allStyles: Record<StyleTypeId, StyleProfile>;
  currentTypeId?: StyleTypeId;
  onSelectType: (typeId: StyleTypeId) => void;
  unlockedSecretIds?: string[];
  nearMissSecrets?: Record<string, { message: string; hint: string }>;
}

export const AllTypesModal: React.FC<AllTypesModalProps> = ({
  isOpen,
  onClose,
  allStyles,
  currentTypeId,
  onSelectType,
  unlockedSecretIds = [],
  nearMissSecrets = {},
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [revealedSecrets, setRevealedSecrets] = useState<Record<string, boolean>>({});

  const styleList: StyleProfile[] = useMemo(() => {
    return allStyles ? Object.values(allStyles) : [];
  }, [allStyles]);

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

  const secretCount = useMemo(() => {
    return styleList.filter((s) => s.isSecret).length;
  }, [styleList]);

  const unlockedCount = useMemo(() => {
    return styleList.filter((s) => s.isSecret && unlockedSecretIds.includes(s.typeId)).length;
  }, [styleList, unlockedSecretIds]);

  // Early return after all hooks are called
  if (!isOpen) return null;

  const toggleSecretHint = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRevealedSecrets((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div
      id="all-types-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="all-types-modal-dialog"
        className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-pink-500 text-white flex items-center justify-center shadow-sm shadow-pink-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-800">
                  スタイル大図鑑
                </h3>
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-pink-100 text-pink-700">
                  全{styleList.length}種
                </span>
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  シークレット{secretCount}種 (解禁: {unlockedCount}/{secretCount})
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                気になるスタイルをタップすると詳細コーデ＆ヘアアレンジを見られるよ！
              </p>
            </div>
          </div>

          <button
            id="close-all-types-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors shadow-xs border border-slate-200"
          >
            <X className="w-4 h-4" />
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
              id="category-tab-secret"
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
        <div id="modal-styles-grid" className="p-3 sm:p-5 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredStyles.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 font-medium">
              見つかりませんでした。別の言葉で検索してみてね！
            </div>
          ) : (
            filteredStyles.map((style) => {
              const isSelected = style.typeId === currentTypeId;
              const isSecret = !!style.isSecret;
              const isUnlocked = !isSecret || unlockedSecretIds.includes(style.typeId);
              const isHintRevealed = revealedSecrets[style.typeId];
              const nearMiss = nearMissSecrets[style.typeId];

              // If secret and not yet unlocked by user in diagnosis, show hidden mystery card
              const displayName = isUnlocked ? style.typeName : '🔒 ？？？（シークレット）';
              const displayCatchphrase = isUnlocked
                ? style.catchphrase
                : nearMiss
                ? '🔥 おしい！ニアミス発生中！'
                : '？？？（未解放の伝説スタイル）';
              const displayDesc = isUnlocked
                ? style.description
                : nearMiss
                ? nearMiss.message
                : '診断で特別な組み合わせを選ぶと目覚める伝説のスタイル！';

              return (
                <div
                  key={style.typeId}
                  id={`style-card-${style.typeId}`}
                  onClick={() => {
                    onSelectType(style.typeId);
                    onClose();
                  }}
                  className={`p-3.5 rounded-2xl border-2 transition-all flex items-start gap-3 cursor-pointer group relative ${
                    isSecret
                      ? isSelected
                        ? 'border-amber-400 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-md ring-2 ring-amber-300'
                        : isUnlocked
                        ? 'border-amber-200 bg-gradient-to-br from-amber-50/50 via-yellow-50/30 to-purple-50/30 hover:border-amber-400 hover:shadow-md'
                        : 'border-dashed border-amber-300 bg-slate-50/80 hover:border-amber-400 hover:bg-amber-50/40'
                      : isSelected
                      ? 'border-pink-500 bg-pink-50/60 shadow-sm ring-2 ring-pink-300'
                      : 'border-slate-100 hover:border-pink-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="shrink-0 relative">
                    {isUnlocked ? (
                      <StyleIllustration typeId={style.typeId} className="w-16 h-16 sm:w-20 sm:h-20" />
                    ) : (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-100 to-slate-200 border border-amber-300 flex flex-col items-center justify-center text-amber-700 shadow-inner">
                        <Lock className="w-6 h-6 animate-pulse text-amber-600 mb-1" />
                        <span className="text-[9px] font-black text-amber-800">LOCKED</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      {isSecret && (
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm ${
                          isUnlocked
                            ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950'
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          {isUnlocked ? <Sparkles className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
                          {isUnlocked ? 'SECRET 解禁済' : 'SECRET 未解禁'}
                        </span>
                      )}
                      {nearMiss && (
                        <span className="text-[10px] font-black bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-0.5 rounded-full flex items-center gap-0.5 animate-pulse shadow-xs">
                          <Flame className="w-2.5 h-2.5" />
                          おしいｗ
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
                          選択中
                        </span>
                      )}
                    </div>

                    <h4 className={`text-xs sm:text-sm font-black truncate ${
                      isSecret ? (isUnlocked ? 'text-amber-900 group-hover:text-amber-600' : 'text-slate-600') : 'text-slate-800 group-hover:text-pink-600'
                    }`}>
                      {displayName}
                    </h4>

                    <p className={`text-[11px] font-bold truncate mb-1 ${
                      nearMiss ? 'text-orange-600' : isSecret ? (isUnlocked ? 'text-amber-700' : 'text-slate-400') : 'text-pink-600'
                    }`}>
                      {displayCatchphrase}
                    </p>

                    <p className="text-[11px] text-slate-500 font-medium line-clamp-2 leading-relaxed">
                      {displayDesc}
                    </p>

                    {/* Near Miss Hint or Secret Hint */}
                    {isSecret && (
                      <div className="mt-2 pt-1.5 border-t border-amber-200/60">
                        {nearMiss ? (
                          <div className="text-[10px] font-bold text-orange-900 bg-orange-100/70 p-1.5 rounded-lg border border-orange-200">
                            🔥 <span className="font-black">おしいヒント：</span>{nearMiss.hint}
                          </div>
                        ) : style.secretHint ? (
                          <>
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
                          </>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
