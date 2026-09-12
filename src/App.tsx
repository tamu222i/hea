/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { DiagnosisQuestionCard } from './components/DiagnosisQuestionCard';
import { ResultHeader } from './components/ResultHeader';
import { ColorPaletteView } from './components/ColorPaletteView';
import { HairArrangementCard } from './components/HairArrangementCard';
import { FashionCoordCard } from './components/FashionCoordCard';
import { AiStylistConsultant } from './components/AiStylistConsultant';
import { AllTypesModal } from './components/AllTypesModal';
import { DIAGNOSIS_QUESTIONS } from './infrastructure/repositories/QuestionRepository';
import { DiagnosisDomainService } from './domain/services/DiagnosisDomainService';
import { UserAnswers, UserAnswersSchema } from './domain/schemas/diagnosisSchema';
import { StyleProfile, StyleTypeId } from './domain/models/StyleTypes';
import { PRESET_STYLES } from './infrastructure/repositories/presetStyles';
import { Sparkles, ArrowRight, Heart, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [answers, setAnswers] = useState<Partial<UserAnswers>>({});
  const [resultProfile, setResultProfile] = useState<StyleProfile | null>(null);
  const [isAllTypesModalOpen, setIsAllTypesModalOpen] = useState<boolean>(false);

  const diagnosisService = React.useMemo(() => new DiagnosisDomainService(), []);

  // Current Question
  const currentQuestion = DIAGNOSIS_QUESTIONS[currentStepIndex];

  // Handle Option Select
  const handleSelectOption = (optionId: string) => {
    if (!currentQuestion) return;

    const newAnswers = {
      ...answers,
      [currentQuestion.id]: optionId,
    };
    setAnswers(newAnswers);

    // If there is next question, go forward
    if (currentStepIndex < DIAGNOSIS_QUESTIONS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Completed all questions! Run Diagnosis
      try {
        const validated = UserAnswersSchema.parse(newAnswers);
        const result = diagnosisService.diagnose(validated);
        setResultProfile(result);
      } catch (err) {
        console.error('Validation error:', err);
      }
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

  // Reset Diagnosis
  const handleReset = () => {
    setIsStarted(false);
    setCurrentStepIndex(0);
    setAnswers({});
    setResultProfile(null);
  };

  // Direct Type Selection from Modal
  const handleSelectTypeFromModal = (typeId: StyleTypeId) => {
    const profile = PRESET_STYLES[typeId];
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
                学校OKのヘアアレンジや通学＆おでかけコーデもたっぷり紹介♪
              </p>

              {/* Feature Highlights */}
              <div className="grid grid-cols-3 gap-2.5 mb-8 text-left">
                <div className="p-3 rounded-2xl bg-pink-50/70 border border-pink-100">
                  <div className="text-lg mb-0.5">🎀</div>
                  <div className="text-xs font-bold text-slate-800">ヘアアレンジ</div>
                  <div className="text-[10px] text-slate-500">学校OKな図解つき</div>
                </div>
                <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-100">
                  <div className="text-lg mb-0.5">🎨</div>
                  <div className="text-xs font-bold text-slate-800">似合う色</div>
                  <div className="text-[10px] text-slate-500">ラッキーカラー</div>
                </div>
                <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-100">
                  <div className="text-lg mb-0.5">👗</div>
                  <div className="text-xs font-bold text-slate-800">通学＆休日服</div>
                  <div className="text-[10px] text-slate-500">かわいいコーデ</div>
                </div>
              </div>

              <button
                id="start-diagnosis-btn"
                onClick={() => setIsStarted(true)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 hover:from-pink-600 hover:to-amber-500 text-white font-black text-base shadow-lg shadow-pink-200 flex items-center justify-center gap-2 group transition-all cursor-pointer"
              >
                <span>診断をスタートする（約1分）</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {/* 2. Questions Stepper */}
          {isStarted && !resultProfile && currentQuestion && (
            <DiagnosisQuestionCard
              question={currentQuestion}
              currentStep={currentStepIndex + 1}
              totalSteps={DIAGNOSIS_QUESTIONS.length}
              selectedOptionId={answers[currentQuestion.id]}
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
              {/* Result Header & Illustration */}
              <ResultHeader profile={resultProfile} />

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
              />

              {/* Bottom Action Cards */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 pb-8">
                <button
                  id="bottom-retry-btn"
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white hover:bg-pink-50 text-pink-600 font-bold text-sm border-2 border-pink-200 shadow-sm transition-colors cursor-pointer"
                >
                  もう一度ちがう答えで診断する
                </button>
                <button
                  id="bottom-all-types-btn"
                  onClick={() => setIsAllTypesModalOpen(true)}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-sm shadow-md shadow-pink-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>ほかの全タイプも見てみる</span>
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
      />

      <footer className="w-full py-4 text-center text-xs text-slate-400 border-t border-pink-100 bg-white/50">
        小学生ヘア＆ファッションスタイル診断 • お友達と楽しく試してみてね
      </footer>
    </div>
  );
}
