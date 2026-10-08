import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BeautyPilot — AI-Powered Beauty Intelligence & Skincare Engine',
  description: 'Personalized, grounded skincare recommendations powered by AI requirement extraction and explainable scoring intelligence.',
  keywords: ['skincare', 'AI recommendations', 'BeautyPilot', 'dermatology', 'moisturizer', 'cleanser', 'serum'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="antialiased min-h-screen flex flex-col bg-[#faf8f5] text-[#1f0b2b]">
        <Header />
        <main className="flex-1 hero-glow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
