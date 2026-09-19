import React, { useState, useEffect, useMemo } from 'react';
import { StyleProfile } from '../domain/models/StyleTypes';
import { generateTotalStyleSvg, convertSvgToPngDataUrl } from '../utils/styleImageGenerator';
import { Download, Sparkles, Image as ImageIcon, ZoomIn, X, Check, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface TotalStyleBoardCardProps {
  profile: StyleProfile;
  aiAdvice?: string;
  luckyItemName?: string;
  luckyItemEmoji?: string;
}

export const TotalStyleBoardCard: React.FC<TotalStyleBoardCardProps> = ({
  profile,
  aiAdvice,
  luckyItemName,
  luckyItemEmoji,
}) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(true);
  const [isZoomOpen, setIsZoomOpen] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // Default fallback advice if not yet requested
  const effectiveAdvice = useMemo(() => {
    if (aiAdvice && aiAdvice.trim().length > 0) {
      return aiAdvice;
    }
    const hair = profile.hairStyles[0]?.name || 'ヘアスタイル';
    const color = profile.recommendedColors[0]?.name || 'お気に入りカラー';
    return `【スタイリストからの提案】\n${profile.typeName}のあなたには、${hair}と${color}を取り入れたコーデが大優勝！清潔感と動きやすさを意識して、今日もとびきりの笑顔で楽しんでね✨`;
  }, [aiAdvice, profile]);

  const svgContent = useMemo(() => {
    return generateTotalStyleSvg({
      profile,
      aiAdvice: effectiveAdvice,
      luckyItemName,
      luckyItemEmoji,
    });
  }, [profile, effectiveAdvice, luckyItemName, luckyItemEmoji]);

  // Convert SVG to PNG for easy download and cross-platform sharing
  useEffect(() => {
    let isMounted = true;
    setIsGenerating(true);

    convertSvgToPngDataUrl(svgContent)
      .then((url) => {
        if (isMounted) {
          setImageUrl(url);
          setIsGenerating(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setImageUrl(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`);
          setIsGenerating(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [svgContent]);

  const handleDownload = () => {
    if (!imageUrl) return;

    try {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `${profile.typeName}_おすすめトータルスタイル.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (e) {
      console.error('Download failed:', e);
    }
  };

  return (
    <section
      id="total-style-board-card"
      className="w-full bg-gradient-to-br from-pink-50/70 via-rose-50/40 to-amber-50/50 rounded-3xl shadow-xl shadow-pink-100/50 border border-pink-200/80 p-5 sm:p-7 relative overflow-hidden"
    >
      {/* Decorative accent light */}
      <div className="absolute top-0 right-0 w-52 h-52 bg-pink-200/30 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-pink-200">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base sm:text-lg font-black text-slate-800">
                提案アイテム着用！トータルコーデイラスト（1枚画像）
              </h3>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-pink-500 text-white shadow-2xs">
                保存OK
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              おすすめカラー・ヘアアレンジ・ラッキーアイテムを女の子が実際に身に着けたスナップ画像！
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            id="zoom-total-style-btn"
            onClick={() => setIsZoomOpen(true)}
            className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="拡大表示"
          >
            <ZoomIn className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">拡大する</span>
          </button>

          <button
            id="download-total-style-btn"
            onClick={handleDownload}
            disabled={!imageUrl || isGenerating}
            className={`px-4 py-2 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer ${
              downloadSuccess
                ? 'bg-emerald-500 text-white shadow-emerald-200'
                : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-pink-200'
            }`}
          >
            {downloadSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>保存完了！</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>画像を保存（PNG）</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 1枚画像 表示エリア */}
      <div className="relative rounded-2xl overflow-hidden bg-white/90 border border-pink-100 shadow-inner p-2 sm:p-4 flex flex-col items-center justify-center min-h-[300px]">
        {isGenerating ? (
          <div className="py-16 flex flex-col items-center gap-3 text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin text-pink-500" />
            <span className="text-xs font-bold text-pink-600">
              おすすめスタイルの1枚画像を生成中...
            </span>
          </div>
        ) : imageUrl ? (
          <div className="w-full flex flex-col items-center">
            {/* The single integrated image */}
            <div className="relative group max-w-lg w-full rounded-xl overflow-hidden shadow-lg border border-pink-100/80 bg-white">
              <img
                id="total-style-result-image"
                src={imageUrl}
                alt={`${profile.typeName} おすすめトータルスタイルシート`}
                className="w-full h-auto block object-contain select-none"
              />

              {/* Hover overlay hint */}
              <div
                onClick={() => setIsZoomOpen(true)}
                className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-sm cursor-pointer backdrop-blur-2xs"
              >
                <ZoomIn className="w-5 h-5" />
                <span>クリックで全体を拡大表示</span>
              </div>
            </div>

            <p className="mt-2.5 text-[11px] text-slate-400 font-medium text-center">
              💡 スマホの場合は画像を長押しして「写真を保存」することもできます
            </p>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 text-xs">
            画像を生成できませんでした
          </div>
        )}
      </div>

      {/* Fullscreen Zoom Modal */}
      {isZoomOpen && (
        <div
          id="total-style-zoom-modal"
          className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
          onClick={() => setIsZoomOpen(false)}
        >
          <div
            className="relative max-w-2xl w-full max-h-[95vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-3.5 sm:p-4 bg-pink-50 border-b border-pink-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">📸</span>
                <span className="text-xs sm:text-sm font-black text-slate-800">
                  {profile.typeName} - おすすめトータルスタイルシート
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownload}
                  className="px-3 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>保存する</span>
                </button>
                <button
                  onClick={() => setIsZoomOpen(false)}
                  className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-slate-500 flex items-center justify-center border border-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Image Body */}
            <div className="p-3 overflow-y-auto flex-1 flex items-center justify-center bg-slate-100/70">
              <img
                src={imageUrl}
                alt="拡大表示"
                className="max-w-full max-h-[80vh] h-auto rounded-xl shadow-md"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
