'use client';

import React from 'react';
import { RankedProduct } from '@/types/recommendation';
import { Star, Sparkles, Scale, Info, FlaskConical } from 'lucide-react';

interface Props {
  rankedProduct: RankedProduct;
  rankIndex: number;
  onViewDetails: (rankedProduct: RankedProduct) => void;
  onToggleCompare: (rankedProduct: RankedProduct) => void;
  isCompared: boolean;
}

const BADGE_TAGS = [
  { label: 'Best overall', sub: 'Why it matches your needs', bg: 'bg-purple-900 text-white' },
  { label: 'Best lightweight', sub: 'Gel-based option', bg: 'bg-purple-100 text-purple-950 border border-purple-300' },
  { label: 'Best budget', sub: 'Lower-cost alternative', bg: 'bg-rose-100 text-rose-950 border border-rose-300' },
];

export function ProductCard({
  rankedProduct,
  rankIndex,
  onViewDetails,
  onToggleCompare,
  isCompared,
}: Props) {
  const { product, score, explanation } = rankedProduct;
  const badge = BADGE_TAGS[rankIndex] || BADGE_TAGS[2];

  return (
    <div className="bg-white rounded-3xl border border-purple-200/80 p-6 shadow-xl shadow-purple-900/5 hover:shadow-2xl hover:shadow-purple-900/10 transition-all duration-300 flex flex-col justify-between space-y-5 relative group">

      {/* Top Header: Badge & Score */}
      <div className="flex items-center justify-between gap-2 border-b border-purple-100 pb-3">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge.bg}`}>
          {badge.label}
        </span>
      </div>

      {/* Product Image Container */}
      <div
        onClick={() => onViewDetails(rankedProduct)}
        className="w-full h-48 rounded-2xl bg-gradient-to-b from-purple-50/50 to-white border border-purple-100 flex items-center justify-center overflow-hidden cursor-pointer group-hover:scale-[1.02] transition-transform duration-300 relative"
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain p-3"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : null}
        <div className="text-purple-300 flex items-center justify-center">
          <FlaskConical className="w-14 h-14" />
        </div>

        {/* Quick Hover Overlay */}
        <div className="absolute inset-0 bg-purple-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white text-purple-950 px-4 py-2 rounded-xl text-xs font-bold shadow-md">
            Click for details
          </span>
        </div>
      </div>

      {/* Title & Price Information */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-purple-900/60">
            {product.brand} • {product.size}
          </span>
          <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
        </div>

        <h3
          onClick={() => onViewDetails(rankedProduct)}
          className="text-lg font-serif font-bold text-[#1f0b2b] leading-snug cursor-pointer hover:text-purple-700 transition-colors line-clamp-2"
        >
          {product.name}
        </h3>

        <div className="flex items-baseline justify-between pt-1">
          <span className="text-2xl font-serif font-bold text-[#1f0b2b]">
            ₹{product.price}
          </span>
          <span className="text-xs font-semibold text-purple-900/60 capitalize">
            {product.texture}
          </span>
        </div>
      </div>

      {/* Why It Matches Explanation */}
      <div className="bg-purple-50/60 rounded-2xl p-4 border border-purple-200/50 space-y-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-purple-950 block">
          Why it matches:
        </span>
        <p className="text-xs text-purple-900/90 leading-relaxed font-medium line-clamp-2">
          {explanation?.whyRecommended || product.description}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-purple-100">
        <button
          type="button"
          onClick={() => onViewDetails(rankedProduct)}
          className="w-full py-2.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-950 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 border border-purple-200/60 cursor-pointer"
        >
          <Info className="w-3.5 h-3.5 text-purple-600" />
          <span>View details</span>
        </button>

        <button
          type="button"
          onClick={() => onToggleCompare(rankedProduct)}
          className={`w-full py-2.5 px-3 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${isCompared
              ? 'bg-purple-900 text-white shadow-md'
              : 'bg-white hover:bg-purple-50 text-purple-900 border border-purple-300'
            }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>{isCompared ? 'Compared' : 'Compare'}</span>
        </button>
      </div>

    </div>
  );
}
