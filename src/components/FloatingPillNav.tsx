import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { ArrowUp, PhoneCall } from 'lucide-react';

interface FloatingPillNavProps {
  visible?: boolean;
}

export const FloatingPillNav: React.FC<FloatingPillNavProps> = ({ visible = true }) => {
  const { siteConfig } = useData();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* 4.1 Floating Pill Nav (Appears after scrolling out from hero) */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center max-w-max transition-all duration-300 ease-out ${
          visible
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-8 pointer-events-none'
        }`}
      >
        <nav
          aria-label="Floating Primary Navigation"
          className="flex items-center gap-1.5 p-1.5 pl-2 pr-2 rounded-full bg-[#212121] text-white shadow-2xl border border-white/10 backdrop-blur-md text-xs select-none"
        >
          {/* Square Logo Mark button */}
          <button
            onClick={scrollToTop}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[11px] font-black text-[#EFF0A3] font-['Oxygen'] transition-colors"
            title="THE GRID — Calicut"
          >
            G.
          </button>

          {/* Nav Links inside muted pill */}
          <div className="hidden sm:flex items-center gap-1 px-1 text-zinc-300 font-medium text-[12px]">
            <button
              onClick={() => scrollTo('spaces')}
              className="px-2.5 py-1 rounded-full hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              Spaces
            </button>
            <button
              onClick={() => scrollTo('why-coworking')}
              className="px-2.5 py-1 rounded-full hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              Why Grid
            </button>
            <button
              onClick={() => scrollTo('amenities')}
              className="px-2.5 py-1 rounded-full hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              Amenities
            </button>
            <button
              onClick={() => scrollTo('location')}
              className="px-2.5 py-1 rounded-full hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              Location
            </button>
            <button
              onClick={() => scrollTo('enquiry')}
              className="px-2.5 py-1 rounded-full hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              Book Desk
            </button>
          </div>

          {/* Divider */}
          <div className="h-4 w-px bg-white/20 mx-0.5" />

          {/* Highlighted CTA Pill in Vanilla #EFF0A3: Call Now button with dial icon */}
          <a
            href={`tel:${siteConfig.phone}`}
            className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EFF0A3] hover:bg-[#dfe094] text-[#212121] font-bold text-[11px] transition-all cursor-pointer shadow-xs"
          >
            <PhoneCall className="w-3 h-3 text-[#212121]" />
            <span>Call Now</span>
          </a>
        </nav>
      </div>

      {/* Floating Back to Top Button at bottom-left */}
      {showBackToTop && visible && (
        <button
          onClick={scrollToTop}
          aria-label="Back to Top"
          className="fixed bottom-6 left-6 z-50 w-10 h-10 rounded-xl bg-[#212121] text-white shadow-xl hover:bg-[#333333] border border-white/10 flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
          title="Back to Top"
        >
          <ArrowUp className="w-4 h-4 text-[#EFF0A3]" />
        </button>
      )}
    </>
  );
};
