'use client';

import React, { useState } from 'react';
import { SearchInput } from '@/components/SearchInput';
import { Sparkle, Check } from 'lucide-react';

export default function Home() {
  const [activeQuery, setActiveQuery] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSearchSubmit = (query: string) => {
    setActiveQuery(query);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-24 flex flex-col justify-center min-h-[calc(100vh-10rem)]">
      
      {/* Refined Beauty Tech Hero & Search Console */}
      <section className="text-center space-y-8 max-w-4xl mx-auto w-full">
        
        {/* Refined Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-purple-200/70 text-xs font-semibold tracking-wide text-purple-900 shadow-2xs">
          <Sparkle className="w-3.5 h-3.5 fill-purple-600 text-purple-600" />
          <span>AI-Powered Beauty Intelligence</span>
        </div>

        {/* Elegant Headline (Slightly Reduced Size for Sophistication) */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-[#1f0b2b] leading-[1.15]">
          Your Personal <br />
          <span className="gradient-text font-sans">Skincare Pilot</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#3b154c]/80 max-w-2xl mx-auto leading-relaxed font-normal">
          Describe your skin type, budget, or concerns in natural words to receive tailored skincare recommendations.
        </p>

        {/* Focal Point: Search Consultation Console */}
        <div className="pt-2">
          <SearchInput onSearchSubmit={handleSearchSubmit} isLoading={isProcessing} />
        </div>

        {/* Active Query Consultation Card */}
        {activeQuery && (
          <div className="mt-8 p-6 rounded-2xl bg-white border border-purple-200/70 text-left max-w-2xl mx-auto space-y-3 shadow-xl shadow-purple-900/5 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-purple-600" />
                Consultation Query Active
              </span>
              <span className="text-[11px] bg-purple-50 text-purple-900 px-3 py-1 rounded-full font-semibold border border-purple-200/50">
                Analysis Ready
              </span>
            </div>
            <p className="text-base font-serif italic text-[#1f0b2b]">
              "{activeQuery}"
            </p>
          </div>
        )}

      </section>

    </div>
  );
}
