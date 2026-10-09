'use client';

import React, { useState } from 'react';
import { RecommendationApiResponse, RankedProduct } from '@/types/recommendation';
import { UnderstoodRequirements } from './UnderstoodRequirements';
import { ProductCard } from './ProductCard';
import { ProductDetailModal } from './ProductDetailModal';
import { ComparisonModal } from './ComparisonModal';
import { Sparkles, AlertTriangle, RefreshCw, Scale, X, ArrowRight } from 'lucide-react';

interface Props {
  response: RecommendationApiResponse | null;
  error: string | null;
  onRetry?: () => void;
}

export function RecommendationResults({ response, error, onRetry }: Props) {
  const [detailProduct, setDetailProduct] = useState<RankedProduct | null>(null);
  const [comparedProducts, setComparedProducts] = useState<RankedProduct[]>([]);
  const [showComparisonModal, setShowComparisonModal] = useState<boolean>(false);

  const handleToggleCompare = (rankedProduct: RankedProduct) => {
    setComparedProducts((prev) => {
      const exists = prev.some((item) => item.product.id === rankedProduct.product.id);
      if (exists) {
        return prev.filter((item) => item.product.id !== rankedProduct.product.id);
      } else {
        if (prev.length >= 3) {
          alert('You can compare up to 3 products at a time.');
          return prev;
        }
        return [...prev, rankedProduct];
      }
    });
  };

  const handleRemoveCompareProduct = (productId: string) => {
    setComparedProducts((prev) => prev.filter((item) => item.product.id !== productId));
  };

  if (error) {
    return (
      <div className="w-full max-w-3xl mx-auto bg-rose-50 border border-rose-200/80 rounded-3xl p-6 sm:p-8 space-y-4 text-center animate-fade-in">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-serif font-bold text-rose-950">
          Recommendation Analysis Error
        </h3>
        <p className="text-sm text-rose-900/80 max-w-md mx-auto">
          {error}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-500 transition-colors shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        )}
      </div>
    );
  }

  if (!response) return null;

  return (
    <div id="results" className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in pt-2 relative">
      
      {/* Top Recommendations Title */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-2xl font-serif font-bold text-[#1f0b2b]">
            Top recommendations
          </h3>
        </div>

        {/* Product Cards 3-Column Grid */}
        {response.recommendations && response.recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {response.recommendations.map((item, idx) => {
              const isCompared = comparedProducts.some((cp) => cp.product.id === item.product.id);
              return (
                <ProductCard
                  key={item.product.id || idx}
                  rankedProduct={item}
                  rankIndex={idx}
                  onViewDetails={(rp) => setDetailProduct(rp)}
                  onToggleCompare={handleToggleCompare}
                  isCompared={isCompared}
                />
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 border border-purple-200/70 text-center space-y-3">
            <h4 className="text-lg font-serif font-bold text-[#1f0b2b]">
              No Matching Formulations Found
            </h4>
            <p className="text-sm text-purple-900/70 max-w-md mx-auto">
              {response.overview || 'Try adjusting your budget or broadening your skin concern parameters.'}
            </p>
          </div>
        )}
      </div>

      {/* Floating Comparison Sticky Action Bar */}
      {comparedProducts.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-purple-950 text-white px-6 py-3.5 rounded-full shadow-2xl border border-purple-700/80 flex items-center gap-4 animate-bounce-short">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Scale className="w-4 h-4 text-rose-300" />
            <span>{comparedProducts.length} product{comparedProducts.length > 1 ? 's' : ''} selected for comparison</span>
          </div>

          <button
            onClick={() => setShowComparisonModal(true)}
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-700 via-purple-600 to-rose-500 hover:from-purple-600 hover:to-rose-400 text-white text-xs font-bold transition-transform hover:scale-105 flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span>Compare Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setComparedProducts([])}
            className="p-1 rounded-full hover:bg-purple-800 text-purple-300 hover:text-white transition-colors cursor-pointer"
            title="Clear selections"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Phase 9 Product Detail Modal */}
      {detailProduct && (
        <ProductDetailModal
          rankedProduct={detailProduct}
          onClose={() => setDetailProduct(null)}
          onToggleCompare={handleToggleCompare}
          isCompared={comparedProducts.some((cp) => cp.product.id === detailProduct.product.id)}
        />
      )}

      {/* Phase 9 Side-by-Side Comparison Modal */}
      {showComparisonModal && (
        <ComparisonModal
          comparedProducts={comparedProducts}
          onClose={() => setShowComparisonModal(false)}
          onRemoveProduct={handleRemoveCompareProduct}
          onClearAll={() => {
            setComparedProducts([]);
            setShowComparisonModal(false);
          }}
        />
      )}

    </div>
  );
}
