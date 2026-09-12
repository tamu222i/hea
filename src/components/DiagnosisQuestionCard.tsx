import React from 'react';
import { motion } from 'motion/react';
import { DiagnosisQuestion, QuestionOption } from '../infrastructure/repositories/QuestionRepository';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

interface DiagnosisQuestionCardProps {
  question: DiagnosisQuestion;
  currentStep: number;
  totalSteps: number;
  selectedOptionId?: string;
  onSelectOption: (optionId: string) => void;
  onPrevStep?: () => void;
}

export const DiagnosisQuestionCard: React.FC<DiagnosisQuestionCardProps> = ({
  question,
  currentStep,
  totalSteps,
  selectedOptionId,
  onSelectOption,
  onPrevStep,
}) => {
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-xl mx-auto bg-white rounded-3xl shadow-xl shadow-pink-100/60 border border-pink-100/80 p-5 sm:p-8"
      id={`question-card-${question.id}`}
    >
      {/* Step Indicator & Back Button */}
      <div className="flex items-center justify-between gap-4 mb-4">
        {onPrevStep ? (
          <button
            id="prev-step-btn"
            onClick={onPrevStep}
            className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors p-1 -ml-1 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>まえの質問へ</span>
          </button>
        ) : (
          <div className="text-xs font-bold text-pink-500 tracking-wider">
            ★ クイズで診断中 ★
          </div>
        )}

        <span className="text-xs font-black px-3 py-1 bg-pink-100/70 text-pink-700 rounded-full">
          Q{currentStep} / {totalSteps}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-pink-50 h-2.5 rounded-full overflow-hidden mb-6 border border-pink-100">
        <motion.div
          className="bg-gradient-to-r from-pink-400 to-amber-300 h-full rounded-full"
          initial={{ width: `${((currentStep - 1) / totalSteps) * 100}%` }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Question Headline */}
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight mb-1.5">
          {question.questionText}
        </h2>
        <p className="text-sm text-slate-500 font-medium">
          {question.description}
        </p>
      </div>

      {/* Options List */}
      <div className="space-y-3">
        {question.options.map((option: QuestionOption, index: number) => {
          const isSelected = selectedOptionId === option.id;
          return (
            <button
              key={option.id}
              id={`option-${question.id}-${option.id}`}
              onClick={() => onSelectOption(option.id)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between group cursor-pointer ${
                isSelected
                  ? 'border-pink-500 bg-pink-50/70 shadow-md shadow-pink-100'
                  : 'border-slate-100 hover:border-pink-300 hover:bg-pink-50/30 bg-slate-50/50'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Emoji / Color Avatar */}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-sm transition-transform group-hover:scale-110"
                  style={{
                    backgroundColor: option.colorCode ? `${option.colorCode}20` : '#FDF2F8',
                    border: option.colorCode ? `2px solid ${option.colorCode}` : 'none',
                  }}
                >
                  <span>{option.emoji}</span>
                </div>

                <div className="min-w-0">
                  <div className="text-base font-bold text-slate-800 group-hover:text-pink-600 transition-colors">
                    {option.label}
                  </div>
                  {option.subtitle && (
                    <div className="text-xs text-slate-500 font-medium truncate mt-0.5">
                      {option.subtitle}
                    </div>
                  )}
                </div>
              </div>

              <div className="shrink-0 ml-3">
                {isSelected ? (
                  <CheckCircle2 className="w-6 h-6 text-pink-500" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-pink-400" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};
