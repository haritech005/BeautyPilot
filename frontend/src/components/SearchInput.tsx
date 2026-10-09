'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, X, ArrowRight } from 'lucide-react';

interface SearchInputProps {
  onSearchSubmit?: (query: string) => void;
  isLoading?: boolean;
  initialQuery?: string;
}

const SUGGESTED_QUERIES = [
  {
    label: 'Oily skin moisturizer under ₹1000',
    query: 'I have oily skin and need a lightweight moisturizer under ₹1000.',
  },
  {
    label: 'Gentle cleanser for sensitive skin',
    query: 'Gentle cleanser for sensitive skin',
  },
  {
    label: 'Fragrance-free moisturizer',
    query: 'Fragrance-free moisturizer',
  },
  {
    label: 'Hydrating serum for dry skin',
    query: 'Hydrating serum for dry skin',
  },
];

export function SearchInput({ onSearchSubmit, isLoading = false, initialQuery = '' }: SearchInputProps) {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && onSearchSubmit) {
      onSearchSubmit(query.trim());
    }
  };

  const handleSelectPrompt = (promptQuery: string) => {
    setQuery(promptQuery);
    if (onSearchSubmit) {
      onSearchSubmit(promptQuery);
    }
  };

  return (
    <div id="advisor" className="w-full max-w-3xl mx-auto space-y-4 px-1 sm:px-0">
      {/* Visual Focal Point: Elevated Natural-Language Input Bar */}
      <form onSubmit={handleSubmit} className="relative group w-full">
        <div className="bg-white rounded-2xl p-2 sm:p-2.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 transition-all duration-300 border border-purple-200/70 focus-within:ring-2 focus-within:ring-purple-400/30 focus-within:border-purple-400 shadow-xl shadow-purple-900/5 group-hover:shadow-2xl group-hover:shadow-purple-900/10">

          <div className="flex items-center gap-2.5 w-full px-2 py-1 sm:py-0">
            <div className="text-purple-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe your skin concern, budget..."
              disabled={isLoading}
              className="w-full bg-transparent text-[#1f0b2b] placeholder-[#2c123d]/65 text-sm sm:text-base font-medium focus:outline-none disabled:opacity-50 px-1 py-1.5 sm:py-2 text-center sm:text-left"
            />

            {query && !isLoading && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1.5 rounded-full hover:bg-purple-50 text-purple-400 hover:text-purple-700 transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-purple-800 via-purple-700 to-rose-600 hover:from-purple-700 hover:to-rose-500 text-white font-semibold text-sm shadow-md shadow-purple-900/15 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:scale-[1.01] active:scale-[0.99] shrink-0"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Finding Matches...</span>
              </>
            ) : (
              <>
                <span>Get Recommendations</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </div>
      </form>
    </div>
  );
}
