import React, { useState } from 'react';
import { HairStyle } from '../domain/models/StyleTypes';
import { HairStepIllustration } from './illustrations/HairStepIllustration';
import { Clock, Scissors, Sparkles, CheckCircle, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

interface HairArrangementCardProps {
  hairStyles: HairStyle[];
  userLength: 'short' | 'medium' | 'long';
}

export const HairArrangementCard: React.FC<HairArrangementCardProps> = ({ hairStyles, userLength }) => {
  const [selectedStyleId, setSelectedStyleId] = useState<string>(hairStyles[0]?.id || '');
  const currentStyle = hairStyles.find((s) => s.id === selectedStyleId) || hairStyles[0];
  const [expandedSteps, setExpandedSteps] = useState<boolean>(true);

  if (!currentStyle) return null;

  return (
    <section id="hair-arrangement-section" className="w-full bg-white rounded-3xl shadow-xl shadow-pink-100/50 border border-pink-100 p-6 sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
            <Scissors className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight">
              おすすめヘアアレンジ集
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              あなたの髪の長さ（{userLength === 'short' ? 'ショート・ボブ' : userLength === 'medium' ? 'ミディアム' : 'ロング'}）におすすめ！
            </p>
          </div>
        </div>

        {/* Tab Buttons for Multiple Hair Styles */}
        {hairStyles.length > 1 && (
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl self-start sm:self-auto">
            {hairStyles.map((style, idx) => {
              const isActive = style.id === currentStyle.id;
              return (
                <button
                  key={style.id}
                  id={`hair-tab-${style.id}`}
                  onClick={() => setSelectedStyleId(style.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-pink-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  アレンジ {idx + 1}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Selected Hair Card */}
      <div className="rounded-2xl bg-gradient-to-br from-amber-50/50 via-pink-50/30 to-white border border-amber-100/80 p-5 mb-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <h4 className="text-base sm:text-lg font-black text-slate-800 flex items-center gap-2">
            <span>{currentStyle.name}</span>
          </h4>

          <div className="flex items-center gap-2">
            {currentStyle.isSchoolOk ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                <CheckCircle className="w-3 h-3" />
                学校・体育OK
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-black text-pink-700 bg-pink-100/80 px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3" />
                休日・おでかけ用
              </span>
            )}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-amber-900/80 font-bold mb-3">
          {currentStyle.tagline}
        </p>

        {/* Specs Pill List */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-white/90 border border-slate-200 px-2.5 py-1 rounded-xl">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            約{currentStyle.durationMinutes}分で完成
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-white/90 border border-slate-200 px-2.5 py-1 rounded-xl">
            難易度: {currentStyle.difficulty}
          </span>
        </div>

        {/* Items Needed */}
        <div className="p-3 bg-white/80 rounded-xl border border-amber-200/50 mb-4">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
            🎒 用意するもの
          </span>
          <div className="flex flex-wrap gap-1.5">
            {currentStyle.itemsNeeded.map((item, i) => (
              <span key={i} className="text-xs font-medium text-slate-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                • {item}
              </span>
            ))}
          </div>
        </div>

        {/* Steps Toggle */}
        <div className="border-t border-amber-100/80 pt-3">
          <button
            onClick={() => setExpandedSteps(!expandedSteps)}
            className="flex items-center justify-between w-full text-xs font-bold text-slate-700 hover:text-pink-600 py-1"
          >
            <span>やり方・ステップ解説（全{currentStyle.steps.length}工程）</span>
            {expandedSteps ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {expandedSteps && (
            <div className="space-y-3 mt-3">
              {currentStyle.steps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="flex items-start gap-3.5 p-3 rounded-2xl bg-white border border-slate-100 shadow-sm"
                >
                  <HairStepIllustration
                    stepNumber={step.stepNumber}
                    styleId={currentStyle.id}
                    className="w-14 h-14 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-black text-slate-800 mb-0.5">
                      STEP {step.stepNumber}: {step.title}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {step.instruction}
                    </p>
                    {step.tip && (
                      <div className="mt-1 text-[11px] text-pink-600 font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        コツ: {step.tip}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* School Hair Tip Callout */}
      <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-100 flex items-start gap-2.5 text-xs text-sky-900 font-medium">
        <AlertCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">学校ヘアアレンジの安心ポイント：</span>
          校則や体育の授業がある日は、飾りピンの代わりに「黒や茶色のシンプルなゴム」や「髪色になじむアメピン」を使うと先生からも花丸です！
        </div>
      </div>
    </section>
  );
};
