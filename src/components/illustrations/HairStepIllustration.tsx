import React from 'react';

interface HairStepIllustrationProps {
  stepNumber: number;
  styleId: string;
  className?: string;
}

export const HairStepIllustration: React.FC<HairStepIllustrationProps> = ({ stepNumber, styleId, className = 'w-16 h-16' }) => {
  return (
    <div className={`flex items-center justify-center rounded-2xl bg-amber-50 border border-amber-200/80 p-2 shadow-sm text-amber-900 ${className}`}>
      <svg viewBox="0 0 80 80" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Step indicator badge */}
        <circle cx="20" cy="20" r="14" fill="#F59E0B" fillOpacity="0.2" />
        <circle cx="20" cy="20" r="10" fill="#F59E0B" />
        <text x="20" y="24" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">
          {stepNumber}
        </text>

        {/* Step Graphic based on stepNumber or style */}
        {stepNumber === 1 && (
          <g>
            {/* Comb / Gather Hair */}
            <path d="M40 30 Q55 25 65 35" stroke="#92400E" strokeWidth="4" strokeLinecap="round" />
            <path d="M42 38 Q56 32 66 42" stroke="#92400E" strokeWidth="4" strokeLinecap="round" />
            <path d="M44 46 Q58 40 68 50" stroke="#92400E" strokeWidth="4" strokeLinecap="round" />
            <circle cx="65" cy="40" r="4" fill="#0284C7" />
          </g>
        )}

        {stepNumber === 2 && (
          <g>
            {/* Band / Twist */}
            <ellipse cx="50" cy="42" rx="14" ry="8" stroke="#D97706" strokeWidth="3" fill="#FEF3C7" />
            <ellipse cx="50" cy="42" rx="6" ry="12" fill="#F59E0B" />
            {/* Band indicator */}
            <rect x="46" y="32" width="8" height="20" rx="3" fill="#EC4899" />
          </g>
        )}

        {stepNumber === 3 && (
          <g>
            {/* Fluffing / Pulling out strands */}
            <path d="M38 45 Q50 35 62 45" stroke="#B45309" strokeWidth="3" strokeLinecap="round" />
            <path d="M42 52 Q50 42 58 52" stroke="#B45309" strokeWidth="3" strokeLinecap="round" />
            {/* Sparkle of softness */}
            <circle cx="42" cy="35" r="2.5" fill="#F59E0B" />
            <circle cx="58" cy="35" r="2.5" fill="#F59E0B" />
            <path d="M50 30 L52 35 L57 37 L52 39 L50 44 L48 39 L43 37 L48 35 Z" fill="#F43F5E" />
          </g>
        )}

        {stepNumber >= 4 && (
          <g>
            {/* Completed accent */}
            <circle cx="50" cy="45" r="16" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3 3" />
            <path d="M44 45 L48 49 L58 39" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
      </svg>
    </div>
  );
};
