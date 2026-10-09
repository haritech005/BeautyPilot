'use client';

import React, { useState } from 'react';
import { SearchInput } from '@/components/SearchInput';
import { LoadingSteps } from '@/components/LoadingSteps';
import { RecommendationResults } from '@/components/RecommendationResults';
import { fetchRecommendations } from '@/lib/api';
import { RecommendationApiResponse } from '@/types/recommendation';
import { Sparkle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function Home() {
  const [activeQuery, setActiveQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recommendationData, setRecommendationData] = useState<RecommendationApiResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSearchSubmit = async (query: string) => {
    setActiveQuery(query);
    setIsLoading(true);
    setErrorMessage(null);
    setRecommendationData(null);

    try {
      const data = await fetchRecommendations(query);
      setRecommendationData(data);
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Backend server is unreachable at http://localhost:5000. Please start the backend server with npm run dev in the backend folder.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSearch = () => {
    setActiveQuery('');
    setRecommendationData(null);
    setErrorMessage(null);
  };

  const hasResults = !isLoading && (recommendationData || errorMessage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14 min-h-[calc(100vh-10rem)]">
      
      {/* Search Submitted Mode: Compact Top Bar Header */}
      {hasResults || isLoading ? (
        <div className="space-y-8 animate-fade-in">
          
          {/* Compact Header Bar preserving user search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-4xl mx-auto w-full">
            
            <button
              onClick={handleResetSearch}
              className="flex items-center gap-2 px-4.5 py-3.5 rounded-2xl bg-white hover:bg-purple-50 text-[#1f0b2b] text-xs font-bold border border-purple-200/80 shadow-md shadow-purple-900/5 transition-all duration-200 shrink-0 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <ArrowLeft className="w-4 h-4 text-purple-700" />
              <span>New Consultation</span>
            </button>

            <div className="w-full flex-1">
              <SearchInput initialQuery={activeQuery} onSearchSubmit={handleSearchSubmit} isLoading={isLoading} />
            </div>

          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="py-8">
              <LoadingSteps />
            </div>
          )}

          {/* Results State */}
          {!isLoading && (
            <RecommendationResults
              response={recommendationData}
              error={errorMessage}
              onRetry={() => activeQuery && handleSearchSubmit(activeQuery)}
            />
          )}

        </div>
      ) : (
        /* Homepage Hero Mode: Oversized Focal Point Console */
        <section className="text-center space-y-8 max-w-4xl mx-auto w-full py-12 md:py-20 animate-fade-in">
          


          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-[#1f0b2b] leading-[1.15]">
            Your Personal <br />
            <span className="gradient-text font-sans">Skincare Pilot</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#3b154c]/80 max-w-2xl mx-auto leading-relaxed font-normal">
            Describe your skin type, budget, or concerns in natural words to receive tailored skincare recommendations.
          </p>

          {/* Main Search Input Console */}
          <div className="pt-2">
            <SearchInput onSearchSubmit={handleSearchSubmit} isLoading={isLoading} />
          </div>

        </section>
      )}

    </div>
  );
}
