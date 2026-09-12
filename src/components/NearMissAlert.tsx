import React from 'react';
import { NearMissInfo } from '../domain/models/StyleTypes';
import { Flame, Sparkles, Lightbulb } from 'lucide-react';
import { motion } from 'motion/react';

interface NearMissAlertProps {
  nearMiss: NearMissInfo;
}

export const NearMissAlert: React.FC<NearMissAlertProps> = ({ nearMiss }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      id="near-miss-alert"
      className="w-full bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-pink-500/15 border-2 border-amber-400 rounded-3xl p-4 sm:p-5 shadow-lg shadow-amber-200/50 mb-6 relative overflow-hidden"
    >
      {/* Background Decorative Sparkles */}
      <div className="absolute top-2 right-3 text-amber-300/40 pointer-events-none">
        <Sparkles className="w-16 h-16 animate-pulse" />
      </div>

      <div className="flex items-start gap-3.5 relative z-10">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-300">
          <Flame className="w-6 h-6 animate-bounce" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2.5 py-0.5 rounded-full shadow-xs">
              惜しいｗ ニアミス検知！
            </span>
            <span className="text-xs font-bold text-amber-900">
              シークレットスタイルまであと一歩！
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-black text-amber-950 mb-1">
            {nearMiss.message}
          </h3>

          <div className="mt-2.5 bg-white/85 backdrop-blur-sm rounded-2xl p-2.5 sm:p-3 border border-amber-200/80 flex items-start gap-2 text-xs sm:text-sm text-amber-900">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-black text-amber-950">出現ヒント：</span>
              <span className="font-semibold text-slate-700 ml-1">{nearMiss.hint}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
