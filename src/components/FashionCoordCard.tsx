import React, { useState } from 'react';
import { FashionCoord } from '../domain/models/StyleTypes';
import { Shirt, Sparkles, School, Compass } from 'lucide-react';

interface FashionCoordCardProps {
  schoolFashion: FashionCoord;
  weekendFashion: FashionCoord;
}

export const FashionCoordCard: React.FC<FashionCoordCardProps> = ({ schoolFashion, weekendFashion }) => {
  const [activeScene, setActiveScene] = useState<'school' | 'weekend'>('school');
  const currentCoord = activeScene === 'school' ? schoolFashion : weekendFashion;

  return (
    <section id="fashion-coord-section" className="w-full bg-white rounded-3xl shadow-xl shadow-pink-100/50 border border-pink-100 p-6 sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
            <Shirt className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight">
              おすすめファッションコーディネート
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              学校での通学用と、休日のおでかけ用をチェック！
            </p>
          </div>
        </div>

        {/* Scene Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl self-start sm:self-auto">
          <button
            id="fashion-tab-school"
            onClick={() => setActiveScene('school')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeScene === 'school'
                ? 'bg-white text-pink-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <School className="w-3.5 h-3.5" />
            <span>通学・学校コーデ</span>
          </button>
          <button
            id="fashion-tab-weekend"
            onClick={() => setActiveScene('weekend')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeScene === 'weekend'
                ? 'bg-white text-pink-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>休日・おでかけコーデ</span>
          </button>
        </div>
      </div>

      {/* Coord Details Container */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50/40 via-pink-50/20 to-white border border-purple-100">
        <div className="mb-4">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-purple-700 bg-purple-100 mb-1.5">
            <Sparkles className="w-3 h-3" />
            {currentCoord.scene}
          </div>
          <h4 className="text-base sm:text-lg font-black text-slate-800 leading-snug">
            {currentCoord.title}
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            {currentCoord.summary}
          </p>
        </div>

        {/* Fashion Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {currentCoord.items.map((item, index) => (
            <div
              key={index}
              className="p-3.5 rounded-xl bg-white border border-slate-100 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                    {item.category}
                  </span>
                  <span className="text-[11px] font-semibold text-pink-600">
                    おすすめ: {item.colorSuggestion}
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-800 mb-0.5">
                  {item.name}
                </div>
                <div className="text-[11px] text-slate-500 font-medium leading-normal">
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Styling Point Box */}
        <div className="p-3.5 rounded-xl bg-white/90 border border-purple-200/60 flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 text-xs font-black">
            POINT
          </div>
          <div className="text-xs text-slate-700 font-medium leading-relaxed">
            <span className="font-bold text-purple-900">着こなしアドバイス：</span>
            {currentCoord.point}
          </div>
        </div>
      </div>
    </section>
  );
};
