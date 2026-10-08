import React from 'react';
import Link from 'next/link';
import { Sparkles, ShoppingBag, Sparkle } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#faf8f5]/85 backdrop-blur-md border-b border-purple-100/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Refined Premium Brand Mark */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-700 via-purple-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-purple-900/10 group-hover:scale-[1.03] transition-transform duration-300">
            <Sparkle className="w-4.5 h-4.5 fill-white text-white" />
          </div>
          <div>
            <span className="text-xl font-serif font-bold tracking-tight text-[#1f0b2b]">
              Beauty<span className="gradient-text font-sans">Pilot</span>
            </span>
            <span className="block text-[9px] uppercase tracking-[0.2em] text-purple-900/60 font-bold">
              Beauty Tech Intelligence
            </span>
          </div>
        </Link>

        {/* User Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#advisor"
            className="flex items-center gap-2 text-sm font-semibold text-[#2c123d] hover:text-purple-700 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>AI Consultation</span>
          </Link>
          <Link
            href="#catalog"
            className="flex items-center gap-2 text-sm font-semibold text-[#2c123d] hover:text-purple-700 transition-colors"
          >
            <ShoppingBag className="w-4 h-4 text-purple-900/50" />
            <span>Browse Products</span>
          </Link>
        </nav>

      </div>
    </header>
  );
}
