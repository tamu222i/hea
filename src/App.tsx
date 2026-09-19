/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { DiagnosisQuestionCard } from './components/DiagnosisQuestionCard';
import { ResultHeader } from './components/ResultHeader';
import { ColorPaletteView } from './components/ColorPaletteView';
import { HairArrangementCard } from './components/HairArrangementCard';
import { FashionCoordCard } from './components/FashionCoordCard';
import { AiStylistConsultant } from './components/AiStylistConsultant';
import { AllTypesModal } from './components/AllTypesModal';
import { FortuneModal } from './components/FortuneModal';
import { FortuneCard } from './components/FortuneCard';
import { TotalStyleBoardCard } from './components/TotalStyleBoardCard';
import { NearMissAlert } from './components/NearMissAlert';
import { selectFiveQuestions, PoolQuestion, QuestionOption } from './domain/models/QuestionPool';
import { DiagnosisDomainService, DynamicSelectedOption } from './domain/services/DiagnosisDomainService';
import { UserAnswers } from './domain/schemas/diagnosisSchema';
import { StyleProfile, StyleTypeId } from './domain/models/StyleTypes';
import { PRESET_STYLES } from './infrastructure/repositories/presetStyles';
import { Sparkles, ArrowRight, Heart, Star, Dices, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const STORAGE_UNLOCKED_KEY = 'kids_style_unlocked_secrets_v1';
const STORAGE_NEARMISS_KEY = 'kids_style_nearmiss_secrets_v1';
const STORAGE_DISCOVERED_KEY = 'kids_style_discovered_styles_v1';
const STORAGE_LUCKY_ITEMS_KEY = 'kids_style_collected_lucky_items_v1';

export default function App() {
  const [questions, setQuestions] = useState<PoolQuestion[]>(() => selectFiveQuestions());
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [selectedPoolOptions, setSelectedPoolOptions] = useState<DynamicSelectedOption[]>([]);
  const [answers, setAnswers] = useState<Partial<UserAnswers>>({});
  const [resultProfile, setResultProfile] = useState<StyleProfile | null>(null);
  const [currentAiAdvice, setCurrentAiAdvice] = useState<string>('');
  const [isAllTypesModalOpen, setIsAllTypesModalOpen] = useState<boolean>(false);
  const [isFortuneModalOpen, setIsFortuneModalOpen] = useState<boolean>(false);

  // Discovered styles (all diagnosed styles saved forever!)
  const [discoveredStyleIds, setDiscoveredStyleIds] = useState<string[]>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem(STORAGE_DISCOVERED_KEY);
        return saved ? JSON.parse(saved) : [];
      }
      return [];
    } catch {
      return [];
    }
  });

  // Collected lucky items (out of 100)
  const [collectedLuckyItemIds, setCollectedLuckyItemIds] = useState<number[]>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem(STORAGE_LUCKY_ITEMS_KEY);
        return saved ? JSON.parse(saved) : [];
      }
      return [];
    } catch {
      return [];
    }
  });

  // Unlocked secret styles & near-miss history
  const [unlockedSecretIds, setUnlockedSecretIds] = useState<string[]>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem(STORAGE_UNLOCKED_KEY);
        return saved ? JSON.parse(saved) : [];
      }
      return [];
    } catch {
      return [];
    }
  });

  const [nearMissSecrets, setNearMissSecrets] = useState<Record<string, { message: string; hint: string }>>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem(STORAGE_NEARMISS_KEY);
        return saved ? JSON.parse(saved) : {};
      }
      return {};
    } catch {
      return {};
    }
  });

  // Save to localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_DISCOVERED_KEY, JSON.stringify(discoveredStyleIds));
      }
    } catch {
      // ignore
    }
  }, [discoveredStyleIds]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_LUCKY_ITEMS_KEY, JSON.stringify(collectedLuckyItemIds));
      }
    } catch {
      // ignore
    }
  }, [collectedLuckyItemIds]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_UNLOCKED_KEY, JSON.stringify(unlockedSecretIds));
      }
    } catch {
      // ignore
    }
  }, [unlockedSecretIds]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_NEARMISS_KEY, JSON.stringify(nearMissSecrets));
      }
    } catch {
      // ignore
    }
  }, [nearMissSecrets]);

  const diagnosisService = useMemo(() => new DiagnosisDomainService(), []);

  // Collect a lucky item
  const handleCollectItem = (id: number) => {
    setCollectedLuckyItemIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  // Current Question
  const currentQuestion = questions[currentStepIndex];

  // Handle Option Select
  const handleSelectOption = (optionId: string) => {
    if (!currentQuestion) return;

    const opt = currentQuestion.options.find((o) => o.id === optionId);
    if (!opt) return;

    const dynamicOpt: DynamicSelectedOption = {
      questionId: currentQuestion.id,
      optionId: opt.id,
      categoryWeights: opt.categoryWeights,
      secretTag: opt.secretTag,
      hairLength: opt.hairLength,
    };

    const newSelected = [...selectedPoolOptions.filter((s) => s.questionId !== currentQuestion.id), dynamicOpt];
    setSelectedPoolOptions(newSelected);

    // Save hair length if option provides one
    if (opt.hairLength) {
      setAnswers((prev) => ({ ...prev, hairLength: opt.hairLength }));
    }

    // Advance or diagnose
    if (currentStepIndex < questions.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Completed all 5 questions! Diagnose using dynamic answers
      const result = diagnosisService.diagnoseDynamic({ selectedOptions: newSelected });

      // Save to discovered styles (forever remembered even after reload!)
      setDiscoveredStyleIds((prev) => (prev.includes(result.typeId) ? prev : [...prev, result.typeId]));

      // Unlock secret if diagnosed
      if (result.isSecret) {
        setUnlockedSecretIds((prev) => (prev.includes(result.typeId) ? prev : [...prev, result.typeId]));
      }

      // Record near-miss if close
      if (result.nearMiss) {
        setNearMissSecrets((prev) => ({
          ...prev,
          [result.nearMiss!.secretTypeId]: {
            message: result.nearMiss!.message,
            hint: result.nearMiss!.hint,
          },
        }));
      }

      setResultProfile(result);
    }
  };

  // Previous Question
  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    } else {
      setIsStarted(false);
    }
  };

  // Reset Diagnosis with a FRESH pool of 5 questions!
  const handleReset = () => {
    setQuestions(selectFiveQuestions());
    setIsStarted(false);
    setCurrentStepIndex(0);
    setSelectedPoolOptions([]);
    setAnswers({});
    setResultProfile(null);
    setCurrentAiAdvice('');
  };

  // Direct Type Selection from Modal
  const handleSelectTypeFromModal = (typeId: StyleTypeId) => {
    const profile = PRESET_STYLES[typeId];
    if (profile.isSecret) {
      setUnlockedSecretIds((prev) => (prev.includes(typeId) ? prev : [...prev, typeId]));
    }
    setDiscoveredStyleIds((prev) => (prev.includes(typeId) ? prev : [...prev, typeId]));
    setResultProfile(profile);
    setIsStarted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50/50 via-rose-50/30 to-amber-50/40 text-slate-800 flex flex-col font-sans">
      <Header
        onReset={handleReset}
        onOpenTypesList={() => setIsAllTypesModalOpen(true)}
        isResultView={!!resultProfile}
      />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 flex flex-col items-center">
        <AnimatePresence mode="wait">
          {/* 1. Welcome / Start Screen */}
          {!isStarted && !resultProfile && (
            <motion.div
              key="start-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full max-w-xl mx-auto text-center bg-white rounded-3xl shadow-xl shadow-pink-100/60 border border-pink-100 p-6 sm:p-10 my-auto"
            >
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-pink-400 via-rose-400 to-amber-300 flex items-center justify-center text-white mx-auto shadow-md shadow-pink-200 mb-5">
                <Sparkles className="w-8 h-8 animate-spin-slow" />
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-pink-600 text-xs font-black tracking-wider uppercase mb-3">
                <Star className="w-3.5 h-3.5 fill-pink-500" />
                小学生向け・かんたん5問クイズ
              </span>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-snug mb-3">
                あなたに一番似合う
                <br />
                <span className="bg-gradient-to-r from-pink-500 to-amber-500 bg-clip-text text-transparent">
                  ヘアアレンジ＆ファッション
                </span>
                を診断！
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium mb-6">
                すきな色や食べもの、今日の気分を選ぶだけで、
                あなたの魅力を引き出すスタイルタイプがわかるよ！
                <br className="hidden sm:inline" />
                全100問の質問から<strong className="text-pink-600 font-black">毎回ちがう5問</strong>をランダム出題♪
                めったに出ない<strong className="text-amber-600 font-black">伝説＆増量シークレット</strong>も見つけてね！
              </p>

              {/* Feature Highlights */}
              <div className="grid grid-cols-3 gap-2.5 mb-6 text-left">
                <div className="p-3 rounded-2xl bg-pink-50/70 border border-pink-100">
                  <div className="text-lg mb-0.5">🎀</div>
                  <div className="text-xs font-bold text-slate-800">ヘアアレンジ</div>
                  <div className="text-[10px] text-slate-500">学校OKな図解つき</div>
                </div>
                <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-100">
                  <div className="text-lg mb-0.5">🔮</div>
                  <div className="text-xs font-bold text-slate-800">10段階おみくじ</div>
                  <div className="text-[10px] text-slate-500">5問回答で発表！</div>
                </div>
                <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-100">
                  <div className="text-lg mb-0.5">✨</div>
                  <div className="text-xs font-bold text-slate-800">205スタイル</div>
                  <div className="text-[10px] text-slate-500">記憶＆保存対応</div>
                </div>
              </div>

              {/* Progress Counters (Styles & Lucky Items) */}
              <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
                <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <span>📖 図鑑GET:</span>
                  <span className="font-black text-emerald-950">{discoveredStyleIds.length} / 205種</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800 flex items-center gap-1.5">
                  <span>🔮 アイテム収集:</span>
                  <span className="font-black text-amber-950">{collectedLuckyItemIds.length} / 100種</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  id="start-diagnosis-btn"
                  onClick={() => setIsStarted(true)}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 hover:from-pink-600 hover:to-amber-500 text-white font-black text-base shadow-lg shadow-pink-200 flex items-center justify-center gap-2 group transition-all cursor-pointer"
                >
                  <Dices className="w-5 h-5 animate-pulse" />
                  <span>5問クイズをはじめる！（100問から選出）</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    id="browse-all-styles-start-btn"
                    onClick={() => setIsAllTypesModalOpen(true)}
                    className="py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-pink-50 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>📖 全205種スタイル図鑑</span>
                  </button>

                  <button
                    id="browse-all-items-start-btn"
                    onClick={() => setIsFortuneModalOpen(true)}
                    className="py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>🎁 全100種アイテム一覧</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. Questions Stepper */}
          {isStarted && !resultProfile && currentQuestion && (
            <DiagnosisQuestionCard
              question={currentQuestion}
              currentStep={currentStepIndex + 1}
              totalSteps={questions.length}
              selectedOptionId={selectedPoolOptions.find((o) => o.questionId === currentQuestion.id)?.optionId}
              onSelectOption={handleSelectOption}
              onPrevStep={handlePrevStep}
            />
          )}

          {/* 3. Diagnosis Result View */}
          {resultProfile && (
            <motion.div
              key="result-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="w-full space-y-6"
            >
              {/* Secret Near Miss Alert (おしいｗ notification) */}
              {resultProfile.nearMiss && (
                <NearMissAlert nearMiss={resultProfile.nearMiss} />
              )}

              {/* Result Header & Illustration (スタイル決定) */}
              <ResultHeader profile={resultProfile} />

              {/* 提案アイテム着用！トータルコーデイラスト（1枚画像）スナップカード - 結果の最上部に配置 */}
              <TotalStyleBoardCard
                profile={resultProfile}
                aiAdvice={currentAiAdvice}
                luckyItemName={resultProfile.luckyItem}
              />

              {/* おみくじ10段階評価＆ラッキーアイテムカード */}
              <FortuneCard
                typeId={resultProfile.typeId}
                styleName={resultProfile.typeName}
                category={resultProfile.category}
                answeredOptions={selectedPoolOptions}
                onOpenCollection={() => setIsFortuneModalOpen(true)}
                onCollectItem={handleCollectItem}
              />

              {/* Recommended Color Palette */}
              <ColorPaletteView colors={resultProfile.recommendedColors} />

              {/* Hair Arrangement Steps */}
              <HairArrangementCard
                hairStyles={resultProfile.hairStyles}
                userLength={answers.hairLength || 'medium'}
              />

              {/* Fashion Coordinates */}
              <FashionCoordCard
                schoolFashion={resultProfile.schoolFashion}
                weekendFashion={resultProfile.weekendFashion}
              />

              {/* AI Stylist Consultant (Gemini powered) */}
              <AiStylistConsultant
                profile={resultProfile}
                hairLength={answers.hairLength || 'medium'}
                onAdviceGenerated={setCurrentAiAdvice}
              />

              {/* Bottom Action Cards */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 pb-8">
                <button
                  id="bottom-retry-btn"
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white hover:bg-pink-50 text-pink-600 font-bold text-sm border-2 border-pink-200 shadow-sm transition-colors cursor-pointer"
                >
                  もう一度ちがう5問で診断する
                </button>
                <button
                  id="bottom-all-types-btn"
                  onClick={() => setIsAllTypesModalOpen(true)}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-sm shadow-md shadow-pink-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>全205タイプ大図鑑</span>
                </button>
                <button
                  id="bottom-all-items-btn"
                  onClick={() => setIsFortuneModalOpen(true)}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-sm border border-amber-300 shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>🎁 全100種アイテム一覧</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* All Types Modal */}
      <AllTypesModal
        isOpen={isAllTypesModalOpen}
        onClose={() => setIsAllTypesModalOpen(false)}
        allStyles={PRESET_STYLES}
        currentTypeId={resultProfile?.typeId}
        onSelectType={handleSelectTypeFromModal}
        unlockedSecretIds={unlockedSecretIds}
        nearMissSecrets={nearMissSecrets}
        discoveredStyleIds={discoveredStyleIds}
      />

      {/* 100 Lucky Items Fortune Modal */}
      <FortuneModal
        isOpen={isFortuneModalOpen}
        onClose={() => setIsFortuneModalOpen(false)}
        collectedItemIds={collectedLuckyItemIds}
        onCollectItem={handleCollectItem}
      />

      <footer className="w-full py-4 text-center text-xs text-slate-400 border-t border-pink-100 bg-white/50">
        小学生ヘア＆ファッションスタイル診断 • 全205スタイル＆100種ラッキーアイテム占い
      </footer>
    </div>
  );
}
