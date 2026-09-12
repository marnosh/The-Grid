import React from 'react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import { Sparkles } from 'lucide-react';
import NoiseDarkBlueGradientWithSquares from './ui/noise-dark-blue-gradient-with-squares';
import { HeroAmenitiesBar } from './HeroAmenitiesBar';

export const HeroSection: React.FC = () => {
  const { siteConfig } = useData();

  return (
    <section id="hero" className="relative overflow-hidden bg-[#F6F5FA] text-[#212121] min-h-[620px] lg:min-h-[720px] flex items-center justify-center py-20 sm:py-28 lg:py-36">
      
      {/* Moving Grid with softened blurred edges on top, bottom, and both sides */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-auto">
        <NoiseDarkBlueGradientWithSquares
          speed={0.08}
          borderColor="rgba(216, 223, 233, 0.75)"
          backgroundColor="bg-[#F6F5FA]"
          className="w-full h-full hero-grid-mask pointer-events-auto"
        />

        {/* Top Edge Smoothing Blur & Gradient */}
        <div className="hero-edge-blur-top" aria-hidden="true" />

        {/* Bottom Edge Smoothing Blur & Gradient */}
        <div className="hero-edge-blur-bottom" aria-hidden="true" />

        {/* Left Side Edge Smoothing Blur & Gradient */}
        <div className="hero-edge-blur-left" aria-hidden="true" />

        {/* Right Side Edge Smoothing Blur & Gradient */}
        <div className="hero-edge-blur-right" aria-hidden="true" />

        {/* Corner radial softening to remove any hard grid intersections */}
        <div
          className="pointer-events-none absolute inset-0 z-10 [background:radial-gradient(ellipse_at_center,transparent_45%,rgba(246,245,250,0.4)_72%,rgba(246,245,250,0.92)_92%,#F6F5FA_100%)]"
          aria-hidden="true"
        />
      </div>

      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 w-full relative z-20 flex flex-col items-center justify-center">
        
        {/* Eyebrow & Pastel Badges Strip (Centered) */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-8 sm:mb-10"
        >
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D8DFE9] bg-white/90 backdrop-blur-md text-[11px] font-semibold tracking-wider uppercase text-[#212121] shadow-xs cursor-default transition-colors hover:border-[#212121]"
          >
            <span className="w-2 h-2 rounded-full bg-[#CFDECA] border border-zinc-400 animate-pulse" />
            Hilite Business Park · Calicut
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#D8DFE9] bg-[#D8DFE9]/40 backdrop-blur-md text-[11px] font-semibold text-[#212121] shadow-xs cursor-default transition-colors hover:border-[#212121]"
          >
            <span className="font-bold">1st Floor Convenience</span>
            <span className="text-zinc-400">|</span>
            <span>Zero Stairs / Lift Friction</span>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EFF0A3] text-[#212121] text-[11px] font-extrabold uppercase tracking-wider shadow-xs border border-[#DFE094] cursor-default"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#212121]" />
            Plans from ₹999/mo
          </motion.div>
        </motion.div>

        {/* Hero Display Headline & Amenities Bar in Eerie Black #212121 (Centered) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.2 }}
          className="max-w-6xl mx-auto text-center w-full"
        >
          <h1 className="font-['Oxygen'] text-4xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-[#212121] leading-[1.08] sm:leading-[1.05] mb-5 sm:mb-6 text-center">
            {(() => {
              const text =
                siteConfig.heroHeadline &&
                siteConfig.heroHeadline !==
                  'Stress and expensive rent, or a coworking space that works for you?'
                  ? siteConfig.heroHeadline
                  : 'Skip the stress. Skip Expensive rent. Just work.';

              const sentences = text.includes('\n')
                ? text.split('\n').map((s) => s.trim()).filter(Boolean)
                : (text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text]).map((s) => s.trim()).filter(Boolean);

              return sentences.map((sentence, idx) => (
                <span key={idx} className="block">
                  {sentence}
                </span>
              ));
            })()}
          </h1>

          <p className="text-zinc-600 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed font-normal text-center mb-8 sm:mb-10">
            {siteConfig.heroSubhead}
          </p>

          {/* Expandable Amenities Bar positioned directly under the sub title with CTA action buttons */}
          <HeroAmenitiesBar />
        </motion.div>

      </div>
    </section>
  );
};
