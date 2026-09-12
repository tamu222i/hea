import React, { useState } from 'react';
import { StyleProfile } from '../domain/models/StyleTypes';
import { getStylistAdvice } from '../domain/services/StylistAdviceService';
import { Sparkles, Bot, Loader2, Send } from 'lucide-react';

interface AiStylistConsultantProps {
  profile: StyleProfile;
  hairLength: 'short' | 'medium' | 'long';
}

const EVENT_OPTIONS = [
  { label: '学校・授業の日', emoji: '🏫' },
  { label: '体育・運動会', emoji: '🏃‍♀️' },
  { label: '遠足・校外学習', emoji: '🎒' },
  { label: 'お友達とおでかけ', emoji: '🎠' },
  { label: '発表会・おめかし', emoji: '🎹' },
  { label: '雨の日・室内あそび', emoji: '☔' },
];

const WEATHER_OPTIONS = [
  { label: 'ぽかぽか晴れ', emoji: '☀️' },
  { label: 'あつ〜い夏日', emoji: '🌻' },
  { label: '雨・くもり', emoji: '🌧️' },
  { label: '風がつよい日', emoji: '🍃' },
  { label: 'ひんやり寒い日', emoji: '🧣' },
];

export const AiStylistConsultant: React.FC<AiStylistConsultantProps> = ({ profile, hairLength }) => {
  const [selectedEvent, setSelectedEvent] = useState<string>('学校・授業の日');
  const [selectedWeather, setSelectedWeather] = useState<string>('ぽかぽか晴れ');
  const [adviceText, setAdviceText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchAiAdvice = async () => {
    setIsLoading(true);
    try {
      const advice = await getStylistAdvice({
        profile,
        event: selectedEvent,
        weather: selectedWeather,
        hairLength,
      });
      setAdviceText(advice);
    } catch (err) {
      console.error(err);
      setAdviceText('いつも笑顔で元気いっぱいなあなたに、今日のスタイルはとってもお似合いだよ！いってらっしゃい✨');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="ai-stylist-section" className="w-full bg-gradient-to-br from-pink-50/60 via-purple-50/40 to-amber-50/40 rounded-3xl shadow-xl shadow-pink-100/50 border border-pink-100 p-6 sm:p-7">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-amber-400 flex items-center justify-center text-white shadow-sm">
          <Bot className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-1.5">
            <span>AIスタイリストに今日の相談をする</span>
            <span className="text-[10px] font-bold text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full">
              Gemini搭載
            </span>
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            今日の予定とお天気を選んで「アドバイスをもらう」を押してね！
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Event Select */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            ① 今日の予定は？
          </label>
          <div className="flex flex-wrap gap-2">
            {EVENT_OPTIONS.map((opt) => (
              <button
                key={opt.label}
                id={`event-opt-${opt.label}`}
                onClick={() => setSelectedEvent(opt.label)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedEvent === opt.label
                    ? 'bg-pink-500 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-pink-100/50 border border-slate-200/80'
                }`}
              >
                <span>{opt.emoji}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Weather Select */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            ② 今日の天気や気温は？
          </label>
          <div className="flex flex-wrap gap-2">
            {WEATHER_OPTIONS.map((opt) => (
              <button
                key={opt.label}
                id={`weather-opt-${opt.label}`}
                onClick={() => setSelectedWeather(opt.label)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedWeather === opt.label
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-purple-100/50 border border-slate-200/80'
                }`}
              >
                <span>{opt.emoji}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Request Button */}
        <div>
          <button
            id="get-ai-advice-btn"
            onClick={fetchAiAdvice}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-amber-400 hover:from-pink-600 hover:to-amber-500 text-white font-bold text-sm shadow-md shadow-pink-200 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>スタイリストが考え中...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>「{selectedEvent} × {selectedWeather}」のアドバイスを聞く</span>
                <Send className="w-3.5 h-3.5 ml-1" />
              </>
            )}
          </button>
        </div>

        {/* Advice Output Box */}
        {adviceText && (
          <div
            id="ai-advice-result-box"
            className="p-4 rounded-2xl bg-white border border-pink-200 shadow-sm transition-all"
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-pink-600 mb-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              スタイリストからのメッセージ
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-line">
              {adviceText}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
