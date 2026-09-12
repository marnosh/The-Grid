import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { useData } from '../context/DataContext';
import { PhoneCall, Menu, X } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

interface HeaderProps {
  onSearchChange?: (val: string) => void;
  searchQuery?: string;
}

export const Header: React.FC<HeaderProps> = () => {
  const { siteConfig } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    "Hi, I'd like to book a free visit to check workspace options at THE GRID, Hilite Business Park, Calicut"
  )}`;

  return (
    <header className="w-full relative z-40">
      {/* 4.3 Promo Ticker (Marquee strip in pastel Vanilla #EFF0A3) */}
      {siteConfig.bannerEnabled && (
        <div className="bg-[#EFF0A3] py-2 px-4 overflow-hidden text-[12px] font-semibold text-[#212121] select-none shadow-2xs">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-10">
            <span className="flex items-center gap-2">
              <span>{siteConfig.bannerText}</span>
              <span className="text-zinc-500">·</span>
              <span className="font-extrabold underline decoration-[#212121]/30">Desks from ₹3,500</span>
              <span className="text-zinc-500">·</span>
              <span className="font-extrabold">Virtual Office ₹999/mo</span>
              <span className="text-zinc-500">·</span>
              <span>1st Floor, Phase 2, Hilite Business Park</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="font-bold">THE GRID Calicut</span>
              <span>⚡</span>
              <span>Fully furnished plug-and-play offices for teams & freelancers</span>
              <span className="text-zinc-500">·</span>
              <span>Direct WhatsApp: {siteConfig.phone}</span>
            </span>
            <span className="flex items-center gap-2">
              <span>{siteConfig.bannerText}</span>
              <span className="text-zinc-500">·</span>
              <span className="font-bold">Zero Brokerage, Zero Lock-in</span>
            </span>
          </div>
        </div>
      )}

      {/* 4.2 Utility Header in Ghost White #F6F5FA - seamless view without divider */}
      <div className="bg-[#F6F5FA] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Mark */}
          <div className="cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <BrandLogo size="md" darkTheme={false} />
          </div>

          {/* Primary Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-zinc-700">
            <button
              onClick={() => scrollToSection('spaces')}
              className="hover:text-[#212121] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Workspaces</span>
              <span className="px-2 py-0.5 rounded-full bg-[#EFF0A3] text-[#212121] text-[10px] font-bold uppercase border border-[#DFE094]">
                4 Plans
              </span>
            </button>
            <button
              onClick={() => scrollToSection('why-coworking')}
              className="hover:text-[#212121] transition-colors cursor-pointer"
            >
              Why Grid
            </button>
            <button
              onClick={() => scrollToSection('amenities')}
              className="hover:text-[#212121] transition-colors cursor-pointer"
            >
              Amenities
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            {/* WhatsApp Outline Button: Book a free visit */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#CFDECA] hover:border-[#212121] text-[#212121] text-xs font-semibold transition-all bg-white hover:bg-[#CFDECA]/20 shadow-2xs whitespace-nowrap"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 text-[#212121]" />
              <span>Book a free visit</span>
            </a>

            {/* Call Now Action Button: Eerie Black #212121 Pill with dial icon and Vanilla Accent */}
            <a
              href={`tel:${siteConfig.phone}`}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#212121] hover:bg-[#333333] text-white text-xs font-semibold transition-all shadow-xs active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#EFF0A3]" />
              <span>Call Now</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-zinc-700 hover:bg-zinc-200"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#D8DFE9] px-6 py-4 space-y-3">
          <button
            onClick={() => scrollToSection('spaces')}
            className="block w-full text-left py-1 text-sm font-semibold text-[#212121]"
          >
            Spaces & Pricing
          </button>
          <button
            onClick={() => scrollToSection('why-coworking')}
            className="block w-full text-left py-1 text-sm font-semibold text-[#212121]"
          >
            Why Coworking Works
          </button>
          <button
            onClick={() => scrollToSection('amenities')}
            className="block w-full text-left py-1 text-sm font-semibold text-[#212121]"
          >
            Included Amenities
          </button>
          <button
            onClick={() => scrollToSection('enquiry')}
            className="block w-full text-left py-1 text-sm font-semibold text-[#212121]"
          >
            Book Desk or Cabin
          </button>
        </div>
      )}
    </header>
  );
};
