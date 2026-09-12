import React from 'react';
import { StyleProfile, StyleTypeId } from '../domain/models/StyleTypes';
import { StyleIllustration } from './illustrations/StyleIllustrations';
import { X, Check } from 'lucide-react';

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
  if (!isOpen) return null;

  const styleList: StyleProfile[] = Object.values(allStyles);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl border border-pink-100 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-pink-50/50">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-800">
              全5つのスタイルタイプ一覧
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              気になるタイプをタップしてコーディネートをチェックできるよ
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-400 hover:text-slate-700 shadow-sm border border-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3">
          {styleList.map((style) => {
            const isSelected = style.typeId === currentTypeId;
            return (
              <div
                key={style.typeId}
                onClick={() => {
                  onSelectType(style.typeId);
                  onClose();
                }}
                className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-4 cursor-pointer group ${
                  isSelected
                    ? 'border-pink-500 bg-pink-50/60 shadow-sm'
                    : 'border-slate-100 hover:border-pink-300 hover:bg-slate-50'
                }`}
              >
                <div className="shrink-0">
                  <StyleIllustration typeId={style.typeId} className="w-20 h-20" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black text-slate-800 group-hover:text-pink-600">
                      {style.typeName}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <Check className="w-3 h-3" />
                        現在の結果
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-pink-600 font-bold mb-1 truncate">
                    {style.catchphrase}
                  </p>
                  <p className="text-xs text-slate-500 font-medium line-clamp-2">
                    {style.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
