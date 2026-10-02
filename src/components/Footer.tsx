import React from 'react';
import { BrandLogo } from './BrandLogo';
import { useData } from '../context/DataContext';
import { Phone, Mail, Instagram, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

export const Footer: React.FC = () => {
  const {
    siteConfig,
    setIsAdminView,
    setIsBlogViewerOpen,
    isAdminAuthenticated,
    setIsAdminLoginModalOpen,
  } = useData();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="footer" className="bg-black text-[#E5E5EA] pt-16 pb-28 relative z-30">
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24">
        
        {/* 7.1 Pre-Footer CTA Strip */}
        <div className="rounded-2xl bg-[#181818] border border-zinc-800 p-8 sm:p-10 mb-16 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="max-w-xl text-center md:text-left">
            <span className="text-[11px] font-bold text-[#EFF0A3] uppercase tracking-wider block mb-2">
              Ready for a walkthrough?
            </span>
            <h3 className="font-['Oxygen'] text-2xl sm:text-3xl font-bold uppercase text-white tracking-tight">
              VISIT 1ST FLOOR, PHASE 2 TODAY.
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2">
              Drop in without an appointment between 9 AM and 7 PM, or message our community manager on WhatsApp.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <a
              href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
                'Hi, I would like to schedule a tour of THE GRID at Hilite Business Park'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#CFDECA] hover:bg-[#b8cbb3] text-[#212121] text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#212121]" />
              <span>Schedule Tour</span>
            </a>

            <a
              href={`tel:${siteConfig.phone}`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-zinc-100 text-[#212121] text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-[#212121]" />
              <span>{siteConfig.phoneFormatted}</span>
            </a>
          </div>
        </div>

        {/* 7.2 Footer Proper: 4 Columns (Restored exactly as previous) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 pb-12">
          
          {/* Col 1: Brand & Bio with Blogs link */}
          <div className="lg:col-span-4 space-y-4">
            <BrandLogo size="md" darkTheme={true} />
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Premium managed workspace on the 1st Floor of Phase 2, Hilite Business Park, Calicut. Hot desks, private cabins, dedicated team suites, and registered virtual office plans.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                id="footer-blogs-link-btn"
                onClick={() => setIsBlogViewerOpen(true)}
                className="text-xs font-semibold text-zinc-400 hover:text-white hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Blogs</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <span className="text-zinc-600">·</span>
              <button
                id="footer-admin-link-btn"
                onClick={() => {
                  if (isAdminAuthenticated) {
                    setIsAdminView(true);
                  } else {
                    setIsAdminLoginModalOpen(true);
                  }
                }}
                className="text-xs font-semibold text-zinc-400 hover:text-white hover:underline cursor-pointer flex items-center gap-1.5"
                title={isAdminAuthenticated ? "Access Admin Portal (Session Active)" : "Admin Sign In"}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
                {isAdminAuthenticated && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" title="Admin session active" />
                )}
              </button>
              <span className="text-zinc-600">·</span>
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('thegrid-replay-intro'));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-xs font-semibold text-zinc-400 hover:text-white hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Replay Intro Animation ↺</span>
              </button>
            </div>
          </div>

          {/* Col 2: Workspace Plans */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-2 font-['Oxygen']">
              Workspaces & Rates
            </h4>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <button onClick={() => scrollTo('spaces')} className="hover:text-white transition-colors cursor-pointer">
                  Hot Desk / Co-working (₹3,500)
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('spaces')} className="hover:text-white transition-colors cursor-pointer">
                  Private Cabins (4-16 seaters)
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('spaces')} className="hover:text-white transition-colors cursor-pointer">
                  Managed Office Suites (up to 24 seats)
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('spaces')} className="hover:text-white transition-colors cursor-pointer">
                  Virtual Office Address (₹999/mo)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Amenities */}
          <div className="lg:col-span-2 space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-2 font-['Oxygen']">
              Amenities
            </h4>
            <ul className="space-y-2 text-zinc-400">
              <li>High-speed fiber WiFi</li>
              <li>100% Air Conditioned</li>
              <li>Bean-to-cup Coffee</li>
              <li>Games & Breakout Lounge</li>
              <li>Conference Rooms</li>
              <li>1st Floor Walk-in</li>
            </ul>
          </div>

          {/* Col 4: Location & Timings */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-2 font-['Oxygen']">
              THE GRID, Hilite Business Park
            </h4>
            <p className="text-zinc-400 leading-relaxed">
              2121, 1st Floor, Phase 2, Hilite Business Park, Calicut, Kerala 673014
            </p>
            <div className="pt-2 text-zinc-400 space-y-1">
              <p>Mon – Sat: 8:30 AM – 9:00 PM</p>
              <p>Sunday: Member Keycard Access</p>
            </div>
          </div>

        </div>

        {/* Spacing Before Bottom Bar */}
        <div className="pt-6" />

        {/* 7.3 Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()} THE GRID (Castillo). All rights reserved.</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">Hilite Business Park, Calicut</span>
            <span className="hidden sm:inline">·</span>
            <button
              onClick={() => setIsBlogViewerOpen(true)}
              className="text-zinc-400 hover:text-white hover:underline cursor-pointer"
            >
              Blogs
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-zinc-400 font-medium">Connect:</span>
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>{siteConfig.instagram}</span>
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
