import React, { useState, useEffect } from 'react';
import { DataProvider, useData } from './context/DataContext';
import { Header } from './components/Header';
import { FloatingPillNav } from './components/FloatingPillNav';
import { HeroSection } from './components/HeroSection';
import { ComparisonSection } from './components/ComparisonSection';
import { WhyCoworkingSection } from './components/WhyCoworkingSection';
import { SpacesSection } from './components/SpacesSection';
import { AmenitiesSection } from './components/AmenitiesSection';
import { LocationSection } from './components/LocationSection';
import { EnquirySection } from './components/EnquirySection';
import { Footer } from './components/Footer';
import { SoftPromoPopup } from './components/SoftPromoPopup';
import { SplitSquareIntro } from './components/SplitSquareIntro';
import { AdminPanel } from './components/admin/AdminPanel';
import { CheckCircle2 } from 'lucide-react';
import { WhatsAppIcon } from './components/WhatsAppIcon';

const WebsiteContent: React.FC = () => {
  const { isAdminView, toastMessage, siteConfig } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [hasScrolledPastHero, setHasScrolledPastHero] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroEl = document.getElementById('hero');
      if (heroEl) {
        const rect = heroEl.getBoundingClientRect();
        // Visible only when the bottom of the hero section has scrolled above the upper viewport threshold
        setHasScrolledPastHero(rect.bottom <= 120);
      } else {
        setHasScrolledPastHero(window.scrollY > 500);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  if (isAdminView) {
    return (
      <>
        <AdminPanel />
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-[#212121] border border-zinc-700 text-white text-xs font-semibold shadow-2xl animate-in slide-in-from-bottom-2">
            <CheckCircle2 className="w-4 h-4 text-[#CFDECA]" />
            <span>{toastMessage}</span>
          </div>
        )}
      </>
    );
  }

  const whatsappFloatingUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    "Hi, I'd like to check workspace options at THE GRID, Hilite Business Park, Calicut"
  )}`;

  return (
    <div className="min-h-screen bg-[#F6F5FA] text-[#212121] flex flex-col selection:bg-[#212121] selection:text-[#EFF0A3] antialiased overflow-x-hidden">
      {/* Full-screen Split-Square Opening Intro Overlay */}
      <SplitSquareIntro />

      {/* 4.2 Utility Header with Promo Ticker */}
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Main Content Sections */}
      <main className="flex-1">
        <HeroSection />
        <ComparisonSection />
        <WhyCoworkingSection />
        <SpacesSection searchQuery={searchQuery} />
        <AmenitiesSection />
        <LocationSection />
        <EnquirySection />
      </main>

      {/* Site Footer with Pre-Footer CTA */}
      <Footer />

      {/* 4.1 Floating Pill Nav (Reveals only after scrolling out of hero) */}
      <FloatingPillNav visible={hasScrolledPastHero} />

      {/* 8. Soft Promo Popup (Bottom-right, dismissible) */}
      <SoftPromoPopup />

      {/* WhatsApp Quick Floating Action Button (Reveals only after scrolling out of hero) */}
      <a
        href={whatsappFloatingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-[#CFDECA] hover:bg-[#b8cbb3] text-[#212121] shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 border border-[#CFDECA] ${
          hasScrolledPastHero
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-8 pointer-events-none'
        }`}
        aria-label="Chat with THE GRID on WhatsApp"
        title="Chat on WhatsApp"
      >
        <WhatsAppIcon className="w-5 h-5" />
      </a>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#212121] text-white text-xs font-semibold shadow-2xl border border-zinc-700">
          <CheckCircle2 className="w-4 h-4 text-[#CFDECA]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <DataProvider>
      <WebsiteContent />
    </DataProvider>
  );
}
