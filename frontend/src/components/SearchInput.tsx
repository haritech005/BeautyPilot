'use client';

import React, { useState } from 'react';
import { Sparkles, X, ArrowRight } from 'lucide-react';

interface SearchInputProps {
  onSearchSubmit?: (query: string) => void;
  isLoading?: boolean;
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

export function SearchInput({ onSearchSubmit, isLoading = false }: SearchInputProps) {
  const [query, setQuery] = useState('');

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
    <div id="advisor" className="w-full max-w-3xl mx-auto space-y-4">
      {/* Visual Focal Point: Elevated Natural-Language Input Bar */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className="bg-white rounded-2xl p-2.5 flex items-center gap-3 transition-all duration-300 border border-purple-200/70 focus-within:ring-2 focus-within:ring-purple-400/30 focus-within:border-purple-400 shadow-xl shadow-purple-900/5 group-hover:shadow-2xl group-hover:shadow-purple-900/10">
          
          <div className="pl-3.5 text-purple-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe your skin concern, budget, or preferred texture..."
            disabled={isLoading}
            className="w-full bg-transparent text-[#1f0b2b] placeholder-purple-900/40 text-sm sm:text-base font-medium focus:outline-none disabled:opacity-50 px-1 py-2"
          />

          {query && !isLoading && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1.5 rounded-full hover:bg-purple-50 text-purple-400 hover:text-purple-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-800 via-purple-700 to-rose-600 hover:from-purple-700 hover:to-rose-500 text-white font-semibold text-sm shadow-md shadow-purple-900/15 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] shrink-0"
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

      {/* Refined Minimal Suggestion Chips */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1.5 text-xs">
        <span className="text-purple-900/60 font-semibold tracking-tight text-[11px] mr-1">
          Suggested queries:
        </span>
        
        {SUGGESTED_QUERIES.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelectPrompt(item.query)}
            disabled={isLoading}
            className="px-3.5 py-1.5 rounded-full bg-white hover:bg-purple-50/80 text-[#2c123d] font-medium border border-purple-200/50 hover:border-purple-300/80 shadow-2xs transition-all duration-200 disabled:opacity-50 text-[11.5px]"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
