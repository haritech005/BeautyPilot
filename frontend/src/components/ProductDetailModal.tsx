'use client';

import React from 'react';
import { RankedProduct } from '@/types/recommendation';
import { X, Star, CheckCircle, Sparkles, ShieldCheck, Tag, Droplets, FlaskConical, Layers, Scale } from 'lucide-react';

interface Props {
  rankedProduct: RankedProduct | null;
  onClose: () => void;
  onToggleCompare: (rankedProduct: RankedProduct) => void;
  isCompared: boolean;
}

export function ProductDetailModal({ rankedProduct, onClose, onToggleCompare, isCompared }: Props) {
  if (!rankedProduct) return null;

  const { product, score, explanation } = rankedProduct;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-purple-200/80 p-6 sm:p-8 space-y-6 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-purple-100/60 text-purple-400 hover:text-purple-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image & Title Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-purple-100 pb-6">
          <div className="w-32 h-32 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-center justify-center overflow-hidden shrink-0">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-contain p-2 hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : null}
            <div className="text-purple-300 flex items-center justify-center">
              <FlaskConical className="w-12 h-12" />
            </div>
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-purple-900/60">
                {product.brand} • {product.size}
              </span>
            </div>

            <h2 className="text-2xl font-serif font-bold text-[#1f0b2b]">
              {product.name}
            </h2>

            <div className="flex items-center justify-center sm:justify-start gap-4">
              <span className="text-2xl font-serif font-bold text-[#1f0b2b]">
                ₹{product.price}
              </span>
              <div className="flex items-center gap-1 text-amber-500 font-bold text-sm bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tags Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 space-y-1">
            <span className="text-[10px] font-bold uppercase text-purple-400 block">Category</span>
            <span className="font-semibold text-purple-950 capitalize">{product.category}</span>
          </div>

          <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 space-y-1">
            <span className="text-[10px] font-bold uppercase text-purple-400 block">Texture</span>
            <span className="font-semibold text-purple-950 capitalize">{product.texture}</span>
          </div>

          <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 space-y-1">
            <span className="text-[10px] font-bold uppercase text-purple-400 block">Fragrance</span>
            <span className="font-semibold text-purple-950">{product.fragranceFree ? 'Fragrance-Free' : 'Standard'}</span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900/60">Description</h4>
          <p className="text-sm text-purple-900/80 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Skin Types & Active Ingredients */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-purple-100">
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900/60">Target Skin Types</h4>
            <div className="flex flex-wrap gap-1.5">
              {product.skinTypes.map((st, i) => (
                <span key={i} className="px-2.5 py-1 rounded-md bg-purple-100/70 text-purple-950 text-xs font-semibold capitalize">
                  {st}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900/60">Key Active Ingredients</h4>
            <div className="flex flex-wrap gap-1.5">
              {product.ingredients.map((ing, i) => (
                <span key={i} className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 text-xs font-semibold">
                  {ing}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Grounded AI Recommendation Explanation */}
        {explanation && (
          <div className="bg-purple-900 text-white rounded-2xl p-5 space-y-3 shadow-lg shadow-purple-950/10">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-300">
              <Sparkles className="w-4 h-4" />
              <span>AI Matching Reasoning</span>
            </div>
            
            <p className="text-sm leading-relaxed text-purple-100 font-serif italic">
              "{explanation.whyRecommended}"
            </p>

            {explanation.comparisonNotes && (
              <p className="text-xs text-purple-200/90 pt-2 border-t border-purple-800/80">
                <strong>Formula Comparison:</strong> {explanation.comparisonNotes}
              </p>
            )}

            {explanation.keyBenefits && explanation.keyBenefits.length > 0 && (
              <div className="pt-2 border-t border-purple-800/80 space-y-1.5">
                <span className="text-[11px] font-bold uppercase text-purple-300">Key Benefits:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {explanation.keyBenefits.map((b, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-purple-100">
                      <CheckCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-purple-100">
          <button
            onClick={() => onToggleCompare(rankedProduct)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isCompared
                ? 'bg-purple-900 text-white shadow-md'
                : 'bg-purple-100 text-purple-900 hover:bg-purple-200'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>{isCompared ? 'Remove from Compare' : 'Add to Compare'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
