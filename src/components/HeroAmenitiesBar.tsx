import React, { useState } from 'react';
import {
  Armchair,
  Snowflake,
  Building2,
  Wifi,
  Gamepad2,
  Coffee,
  PhoneCall,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { WhatsAppIcon } from './WhatsAppIcon';
import { LiquidMetalButton } from './ui/liquid-metal-button';

interface HeroAmenityItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
  glowColor: string;
}

const HERO_AMENITIES: HeroAmenityItem[] = [
  {
    id: 'furnished',
    title: 'Fully Furnished',
    subtitle: 'Ergonomic desks & chairs',
    icon: <Armchair className="w-5 h-5 text-[#212121]" />,
    // Reference Palette: Honeydew (#CFDECA) to Alice Blue (#D8DFE9)
    gradientFrom: '#CFDECA',
    gradientTo: '#D8DFE9',
    glowColor: '#CFDECA',
  },
  {
    id: 'ac',
    title: '100% Air-Conditioned',
    subtitle: 'Climate controlled',
    icon: <Snowflake className="w-5 h-5 text-[#212121]" />,
    // Reference Palette: Alice Blue (#D8DFE9) to Vanilla (#EFF0A3)
    gradientFrom: '#D8DFE9',
    gradientTo: '#EFF0A3',
    glowColor: '#D8DFE9',
  },
  {
    id: 'location',
    title: 'Hilite Park 1st Fl',
    subtitle: 'Zero lift friction',
    icon: <Building2 className="w-5 h-5 text-[#212121]" />,
    // Reference Palette: Vanilla (#EFF0A3) to Honeydew (#CFDECA)
    gradientFrom: '#EFF0A3',
    gradientTo: '#CFDECA',
    glowColor: '#EFF0A3',
  },
  {
    id: 'wifi',
    title: 'High-Speed WiFi',
    subtitle: 'Dedicated fiber',
    icon: <Wifi className="w-5 h-5 text-[#212121]" />,
    // Reference Palette: Honeydew (#CFDECA) to Alice Blue (#D8DFE9)
    gradientFrom: '#CFDECA',
    gradientTo: '#D8DFE9',
    glowColor: '#CFDECA',
  },
  {
    id: 'games',
    title: 'Games & Lounge',
    subtitle: 'Breakout area',
    icon: <Gamepad2 className="w-5 h-5 text-[#212121]" />,
    // Reference Palette: Vanilla (#EFF0A3) to Honeydew (#CFDECA)
    gradientFrom: '#EFF0A3',
    gradientTo: '#CFDECA',
    glowColor: '#EFF0A3',
  },
  {
    id: 'coffee',
    title: 'Unlimited Coffee',
    subtitle: 'Free daily brew',
    icon: <Coffee className="w-5 h-5 text-[#212121]" />,
    // Reference Palette: Alice Blue (#D8DFE9) to Vanilla (#EFF0A3)
    gradientFrom: '#D8DFE9',
    gradientTo: '#EFF0A3',
    glowColor: '#D8DFE9',
  },
];

export const HeroAmenitiesBar: React.FC = () => {
  const { siteConfig } = useData();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const scrollToAmenities = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('amenities');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const whatsappVisitUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    'Hello Team Grid, I would like to schedule a visit'
  )}`;

  return (
    <div className="w-full max-w-4xl mx-auto mt-7 sm:mt-8">
      {/* Expandable Menu Bar Container */}
      <div className="flex justify-center items-center">
        <ul className="flex flex-wrap justify-center items-center gap-2.5 sm:gap-3.5 p-2 sm:p-2.5 rounded-full bg-white/45 backdrop-blur-2xl backdrop-saturate-150 border border-white/80 shadow-[inset_0_1.5px_2px_0_rgba(255,255,255,0.95),0_12px_32px_-4px_rgba(33,33,33,0.06),0_2px_6px_rgba(0,0,0,0.02)] transition-all duration-300">
          {HERO_AMENITIES.map((item) => {
            const isHovered = hoveredId === item.id;

            return (
              <li
                key={item.id}
                onClick={scrollToAmenities}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                onTouchStart={() => setHoveredId(item.id)}
                style={
                  {
                    '--bg-gradient': `linear-gradient(135deg, ${item.gradientFrom}, ${item.gradientTo})`,
                  } as React.CSSProperties
                }
                className={`amenity-pill ${isHovered ? 'is-active' : ''}`}
                title={`${item.title} — ${item.subtitle}`}
              >
                {/* Pastel Gradient background on hover using reference palette */}
                <div className="amenity-gradient-bg" />

                {/* Soft pastel ambient glow */}
                <div className="amenity-glow" />

                {/* Amenity Icon: Visible initially, collapses smoothly on hover */}
                <div className="amenity-icon-wrapper">
                  <span className="p-1 rounded-full">{item.icon}</span>
                </div>

                {/* Amenity Title: Scales and fades in on hover with bold Oxygen typography */}
                <div className="amenity-title-wrapper">
                  <span className="text-[#212121] font-['Oxygen'] font-extrabold uppercase tracking-wider text-[11px] sm:text-xs text-center truncate max-w-full">
                    {item.title}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Call to Action Buttons directly beneath the expandable amenities session */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-8 sm:mt-10">
        {/* Primary CTA: Liquid metal button for Book a free visit via WhatsApp */}
        <LiquidMetalButton
          label="Book a free visit"
          width={182}
          title="Book a free visit on WhatsApp"
          onClick={() => {
            window.open(whatsappVisitUrl, '_blank', 'noopener,noreferrer');
          }}
        />

        {/* Secondary CTA: Liquid metal dial icon button prompting phone call */}
        <LiquidMetalButton
          viewMode="icon"
          icon={<PhoneCall className="w-4 h-4 text-white" />}
          title={`Call ${siteConfig.phone}`}
          onClick={() => {
            window.location.href = `tel:${siteConfig.phone}`;
          }}
        />
      </div>
    </div>
  );
};
