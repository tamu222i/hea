import React, { useState } from 'react';
import { ColorPaletteItem } from '../domain/models/StyleTypes';
import { Palette, Sparkles, Check } from 'lucide-react';

interface ColorPaletteViewProps {
  colors: ColorPaletteItem[];
}

export const ColorPaletteView: React.FC<ColorPaletteViewProps> = ({ colors }) => {
  const [selectedColor, setSelectedColor] = useState<ColorPaletteItem>(colors[0] || null);

  return (
    <section id="color-palette-section" className="w-full bg-white rounded-3xl shadow-xl shadow-pink-100/50 border border-pink-100 p-6 sm:p-7">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight">
              あなたに似合う！ラッキーカラーパレット
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              お洋服やヘアゴム、文房具選びのヒントにしてみてね！
            </p>
          </div>
        </div>
      </div>

      {/* Color Swatches Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {colors.map((color) => {
          const isSelected = selectedColor?.id === color.id;
          return (
            <button
              key={color.id}
              id={`color-swatch-${color.id}`}
              onClick={() => setSelectedColor(color)}
              className={`p-3.5 rounded-2xl text-left transition-all border-2 flex flex-col gap-2 relative group cursor-pointer ${
                isSelected
                  ? 'border-pink-500 bg-pink-50/50 shadow-sm'
                  : 'border-slate-100 hover:border-pink-200 bg-slate-50/50'
              }`}
            >
              {color.isLuckyColor && (
                <span className="absolute -top-2 -right-1 bg-amber-400 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" />
                  大本命
                </span>
              )}

              {/* Color Circle preview */}
              <div
                className="w-full h-12 rounded-xl shadow-inner border border-black/10 flex items-center justify-end p-2 transition-transform group-hover:scale-[1.02]"
                style={{ backgroundColor: color.hex }}
              >
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-pink-600">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              <div>
                <div className="text-xs font-bold text-slate-800 truncate group-hover:text-pink-600">
                  {color.name}
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  {color.hex}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Color Explanation Box */}
      {selectedColor && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50/70 to-amber-50/50 border border-pink-100 flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-xl shrink-0 shadow-sm border border-black/10"
            style={{ backgroundColor: selectedColor.hex }}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">
                {selectedColor.name} のパワー
              </span>
              {selectedColor.isLuckyColor && (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                  今日のベストカラー
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5 leading-relaxed">
              {selectedColor.description}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
