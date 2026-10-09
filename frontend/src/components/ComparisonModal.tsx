'use client';

import React from 'react';
import { RankedProduct } from '@/types/recommendation';
import { X, Star, CheckCircle, Scale, Sparkles, Trash2, FlaskConical } from 'lucide-react';

interface Props {
  comparedProducts: RankedProduct[];
  onClose: () => void;
  onRemoveProduct: (productId: string) => void;
  onClearAll: () => void;
}

function ProductComparisonImage({ imageUrl, name }: { imageUrl?: string | null; name: string }) {
  const [imgError, setImgError] = React.useState(false);

  return (
    <div className="w-full h-36 rounded-xl bg-white border border-purple-100 flex items-center justify-center overflow-hidden">
      {imageUrl && !imgError ? (
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-contain p-2"
          onError={() => setImgError(true)}
        />
      ) : (
        <FlaskConical className="w-10 h-10 text-purple-300" />
      )}
    </div>
  );
}

export function ComparisonModal({ comparedProducts, onClose, onRemoveProduct, onClearAll }: Props) {
  if (!comparedProducts || comparedProducts.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/40 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-purple-200/80 p-6 sm:p-8 space-y-6 relative">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-purple-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-900 text-white flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-[#1f0b2b]">
                Product Formula Comparison
              </h2>
              <p className="text-xs text-purple-900/60 font-medium">
                Comparing {comparedProducts.length} selected skincare formulas side-by-side
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClearAll}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-purple-100/60 text-purple-400 hover:text-purple-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Side-by-Side Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {comparedProducts.map((item) => {
            const { product, score, explanation } = item;
            return (
              <div
                key={product.id}
                className="bg-purple-50/40 rounded-2xl p-5 border border-purple-200/60 space-y-5 relative flex flex-col justify-between"
              >
                {/* Remove button */}
                <button
                  onClick={() => onRemoveProduct(product.id)}
                  className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-rose-100 text-rose-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Remove from comparison"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="space-y-4">
                  {/* Image */}
                  <ProductComparisonImage imageUrl={product.imageUrl} name={product.name} />

                  {/* Title & Brand */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900/60">
                      {product.brand}
                    </span>
                    <h3 className="text-base font-serif font-bold text-[#1f0b2b] leading-snug">
                      {product.name}
                    </h3>
                  </div>

                  {/* Price & Rating */}
                  <div className="flex items-center justify-between pt-2 border-t border-purple-200/50">
                    <span className="text-xl font-serif font-bold text-[#1f0b2b]">
                      ₹{product.price}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{product.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Specs Comparison List */}
                  <div className="space-y-3 text-xs pt-2">
                    <div className="flex justify-between border-b border-purple-200/40 pb-1.5">
                      <span className="text-purple-900/60 font-medium">Category:</span>
                      <span className="font-semibold text-purple-950 capitalize">{product.category}</span>
                    </div>

                    <div className="flex justify-between border-b border-purple-200/40 pb-1.5">
                      <span className="text-purple-900/60 font-medium">Texture:</span>
                      <span className="font-semibold text-purple-950 capitalize">{product.texture}</span>
                    </div>

                    <div className="flex justify-between border-b border-purple-200/40 pb-1.5">
                      <span className="text-purple-900/60 font-medium">Fragrance:</span>
                      <span className="font-semibold text-purple-950">{product.fragranceFree ? 'Fragrance-Free' : 'Fraganced'}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-purple-900/60 font-medium block">Skin Suitability:</span>
                      <div className="flex flex-wrap gap-1">
                        {product.skinTypes.map((st, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-purple-100 text-purple-950 text-[10px] font-semibold capitalize">
                            {st}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-purple-900/60 font-medium block">Active Ingredients:</span>
                      <p className="text-[11px] font-medium text-stone-800 bg-white p-2 rounded-lg border border-purple-100">
                        {product.ingredients.join(', ')}
                      </p>
                    </div>

                    {explanation && (
                      <div className="space-y-1 pt-2">
                        <span className="text-purple-900/60 font-medium block">Why Recommended:</span>
                        <p className="text-[11px] text-purple-950 leading-relaxed font-medium bg-purple-100/60 p-2.5 rounded-lg">
                          {explanation.whyRecommended}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
