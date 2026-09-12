import React from 'react';
import { StyleProfile } from '../domain/models/StyleTypes';
import { StyleIllustration } from './illustrations/StyleIllustrations';
import { Sparkles, Heart, Utensils, Gift, Share2, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface ResultHeaderProps {
  profile: StyleProfile;
}

export const ResultHeader: React.FC<ResultHeaderProps> = ({ profile }) => {
  const [copied, setCopied] = React.useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `【小学生スタイル診断】私のタイプは「${profile.typeName}」だったよ！似合う色は「${profile.recommendedColors[0]?.name}」✨ #小学生ヘアアレンジ #小学生ファッション`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      className="w-full bg-white rounded-3xl shadow-xl shadow-pink-100/50 border border-pink-100 p-6 sm:p-8 relative overflow-hidden"
      id="diagnosis-result-header"
    >
      {/* Decorative Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-200/30 to-amber-200/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 sm:gap-8">
        {/* Cute Visual Illustration */}
        <div className="shrink-0 flex flex-col items-center">
          <StyleIllustration typeId={profile.typeId} className="w-44 h-44 sm:w-52 sm:h-52" />
          <span className="mt-2.5 text-xs font-bold text-pink-600 bg-pink-50 px-3 py-1 rounded-full border border-pink-200/60 inline-flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
            あなたに似合うスタイル
          </span>
        </div>

        {/* Profile Information */}
        <div className="flex-1 text-center md:text-left min-w-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-pink-100 to-amber-100 text-pink-800 text-xs font-black tracking-wider uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            診断結果発表！
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-snug">
            {profile.typeName}
          </h2>

          <p className="text-sm sm:text-base font-bold text-pink-600 mt-1 mb-3">
            「{profile.catchphrase}」
          </p>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium mb-4">
            {profile.description}
          </p>

          {/* Personality Badges */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 mb-5">
            {profile.personalityTraits.map((trait, i) => (
              <span
                key={i}
                className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-pink-50 px-2.5 py-1 rounded-xl"
              >
                #{trait}
              </span>
            ))}
          </div>

          {/* Lucky Info Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60">
              <div className="w-9 h-9 rounded-xl bg-amber-200 flex items-center justify-center text-amber-800 shrink-0">
                <Utensils className="w-4 h-4" />
              </div>
              <div className="min-w-0 text-left">
                <div className="text-[11px] font-bold text-amber-700">ラッキーフード</div>
                <div className="text-xs font-bold text-slate-800 truncate">{profile.luckyFood}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-pink-50/70 border border-pink-200/60">
              <div className="w-9 h-9 rounded-xl bg-pink-200 flex items-center justify-center text-pink-800 shrink-0">
                <Gift className="w-4 h-4" />
              </div>
              <div className="min-w-0 text-left">
                <div className="text-[11px] font-bold text-pink-700">ラッキーアイテム</div>
                <div className="text-xs font-bold text-slate-800 truncate">{profile.luckyItem}</div>
              </div>
            </div>
          </div>

          {/* Copy / Share Button */}
          <div className="mt-4 flex justify-center md:justify-start">
            <button
              id="share-result-btn"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:text-pink-600 bg-slate-50 hover:bg-pink-50 rounded-xl transition-colors border border-slate-200"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">結果テキストをコピーしました！</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>診断結果をコピーしてお友達にシェア</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
