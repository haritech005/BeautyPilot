'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, Search, CheckCircle2, Loader2 } from 'lucide-react';

const LOADING_STEPS = [
  { label: 'Understanding your needs...', detail: 'Extracting skin profile & constraints' },
  { label: 'Finding suitable products...', detail: 'Querying database & filtering catalog' },
  { label: 'Preparing recommendations...', detail: 'Scoring matches & drafting grounded AI explanations' },
];

export function LoadingSteps() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 1200);
    const timer2 = setTimeout(() => setCurrentStep(2), 2600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto py-10 px-6 bg-white rounded-3xl border border-purple-200/70 shadow-xl shadow-purple-900/5 space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-purple-100 pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600 animate-spin" />
          <span className="text-sm font-serif font-bold text-[#1f0b2b]">
            BeautyPilot Consultation Engine
          </span>
        </div>
        <span className="text-xs font-semibold text-purple-700 bg-purple-100/70 px-3 py-1 rounded-full">
          Processing
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-purple-100/60 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-purple-700 via-purple-600 to-rose-500 h-full transition-all duration-700 ease-out"
          style={{ width: `${((currentStep + 1) / LOADING_STEPS.length) * 100}%` }}
        />
      </div>

      {/* Step Items */}
      <div className="space-y-4">
        {LOADING_STEPS.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-300 ${
                isCurrent
                  ? 'bg-purple-50/80 border border-purple-200/80 shadow-2xs'
                  : 'opacity-60'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-purple-600" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-purple-300 flex items-center justify-center text-[10px] font-bold text-purple-400">
                    {idx + 1}
                  </div>
                )}
              </div>

              <div>
                <p className={`text-sm font-semibold ${isCurrent ? 'text-[#1f0b2b]' : 'text-purple-900/70'}`}>
                  {step.label}
                </p>
                <p className="text-xs text-purple-900/50 mt-0.5">
                  {step.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
