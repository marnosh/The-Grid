import React, { useState, useEffect } from 'react';
import { X, ArrowUpRight } from 'lucide-react';
import { useData } from '../context/DataContext';

export const SoftPromoPopup: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);
  const { siteConfig } = useData();

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const promo = siteConfig.promoPopup || {
    enabled: true,
    tag: 'FLOOR UPDATE · HILITE PHASE 2',
    headline: '4-SEATER CABIN JUST OPENED',
    description: 'Immediate move-in available on 1st Floor. Plug-and-play with dedicated AC & fiber WiFi.',
    ctaText: 'Ask for floor walkthrough',
    floorLocation: '1st Floor',
    whatsappMessage: 'Hi, I saw the 4-seater private cabin update at THE GRID Hilite Park. Is it available?',
  };

  if (dismissed || !promo.enabled || !visible) return null;

  const whatsappText = promo.whatsappMessage || `Hi, I saw the ${promo.headline} at THE GRID Hilite Park. Is it available?`;
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;

  return (
    <div className="fixed bottom-20 right-6 z-40 max-w-xs w-full animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="bg-[#212121] text-white p-4 rounded-2xl border border-zinc-700 shadow-2xl relative flex flex-col justify-between">
        
        {/* Dismiss Button */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-3 right-3 p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Content */}
        <div>
          {promo.tag && (
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CFDECA] animate-ping" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#EFF0A3]">
                {promo.tag}
              </span>
            </div>
          )}

          <h4 className="font-['Oxygen'] text-sm font-bold uppercase tracking-tight text-white pr-4">
            {promo.headline}
          </h4>

          {promo.description && (
            <p className="text-[11px] text-zinc-300 leading-snug mt-1">
              {promo.description}
            </p>
          )}
        </div>

        {/* Action Link with Arrow CTA */}
        <div className="mt-3 pt-2 border-dotted-separator-dark flex items-center justify-between">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold text-[#EFF0A3] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{promo.ctaText || 'Ask for floor walkthrough'}</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
          {promo.floorLocation && (
            <span className="text-[10px] text-zinc-400">{promo.floorLocation}</span>
          )}
        </div>

      </div>
    </div>
  );
};
