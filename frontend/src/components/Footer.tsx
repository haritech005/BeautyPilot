import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-purple-200/50 py-8 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-700 via-purple-600 to-rose-500 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-base font-serif font-bold text-[#1f0b2b]">
            Beauty<span className="gradient-text font-sans">Pilot</span>
          </span>
        </div>

        {/* Middle: Tagline */}
        <p className="text-xs text-purple-900/70 text-center flex items-center gap-1.5 font-medium">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          <span>for personalized, grounded skincare intelligence</span>
        </p>

        {/* Right: Copyright */}
        <div className="text-xs text-purple-900/60 font-medium">
          © 2026 BeautyPilot. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
