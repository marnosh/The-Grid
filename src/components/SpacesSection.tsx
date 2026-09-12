import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import { SpaceItem } from '../types';
import { Phone, Check, LayoutGrid, ListFilter } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

const DEFAULT_SPACE_IMAGE_MAP: Record<string, { url: string; alt: string }> = {
  'space-hot-desk': {
    url: 'https://i.postimg.cc/L8LVYHhb/file-00000000eea881f89cf02d346c35d8df.png',
    alt: 'Hot desk coworking space at THE GRID, Hilite Business Park, Calicut',
  },
  'space-private-cabin': {
    url: 'https://i.postimg.cc/CLY8Pj1T/file-00000000810081f78c5c11097a9ecc9e.png',
    alt: 'Private cabin workspace for teams at THE GRID, Hilite Business Park, Calicut',
  },
  'space-managed-office': {
    url: 'https://i.postimg.cc/DzykBYVK/file-000000002c688207aab359367e133d65.png',
    alt: 'Managed office space up to 24 seats at THE GRID, Hilite Business Park, Calicut',
  },
  'space-virtual-office': {
    url: 'https://i.postimg.cc/TPPFrLm5/file-00000000725882089b00296a80df7f78.png',
    alt: 'Virtual office and conference setup at THE GRID, Hilite Business Park, Calicut',
  },
};

const getSpaceImage = (space: SpaceItem): { url: string; alt: string } | null => {
  if (space.imageUrl) {
    return {
      url: space.imageUrl,
      alt: space.imageAlt || `${space.name} at THE GRID, Hilite Business Park, Calicut`,
    };
  }
  if (DEFAULT_SPACE_IMAGE_MAP[space.id]) {
    return DEFAULT_SPACE_IMAGE_MAP[space.id];
  }
  const nameLower = space.name.toLowerCase();
  if (nameLower.includes('hot desk') || nameLower.includes('co-working') || nameLower.includes('desk')) {
    return DEFAULT_SPACE_IMAGE_MAP['space-hot-desk'];
  }
  if (nameLower.includes('cabin')) {
    return DEFAULT_SPACE_IMAGE_MAP['space-private-cabin'];
  }
  if (nameLower.includes('managed')) {
    return DEFAULT_SPACE_IMAGE_MAP['space-managed-office'];
  }
  if (nameLower.includes('virtual')) {
    return DEFAULT_SPACE_IMAGE_MAP['space-virtual-office'];
  }
  return null;
};

interface SpacesSectionProps {
  searchQuery?: string;
}

export const SpacesSection: React.FC<SpacesSectionProps> = ({ searchQuery = '' }) => {
  const { spaces, siteConfig } = useData();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'desk' | 'cabin' | 'office' | 'virtual'>('all');

  const filteredSpaces = spaces
    .filter((sp) => {
      const matchesCategory = categoryFilter === 'all' || sp.iconType === categoryFilter;
      const matchesSearch =
        !searchQuery ||
        sp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sp.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => a.order - b.order);

  return (
    <section id="spaces" className="py-20 sm:py-28 lg:py-32 bg-[#F6F5FA] relative">
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#212121] bg-[#EFF0A3] px-2.5 py-0.5 rounded-full border border-[#DFE094]">
                Smart Selection
              </span>
              <span className="text-zinc-300">·</span>
              <span className="text-xs text-zinc-500 font-medium">Hilite Business Park, Calicut</span>
            </div>

            <h2 className="font-['Oxygen'] text-3xl sm:text-5xl font-bold uppercase tracking-tight text-[#212121]">
              SPACES & PRICING
            </h2>
            
            <p className="text-zinc-600 text-sm mt-1">
              Flexible workspaces for Calicut's freelancers, startups and growing teams.
            </p>
          </div>

          {/* Controls: Filter Pills + Grid/List View Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Pills with Alice Blue border */}
            <div className="flex items-center gap-1 p-1 bg-white border border-[#D8DFE9] rounded-full text-xs shadow-2xs">
              {(['all', 'desk', 'cabin', 'office', 'virtual'] as const).map((cat) => {
                const label =
                  cat === 'all'
                    ? 'All'
                    : cat === 'desk'
                    ? 'Desks'
                    : cat === 'cabin'
                    ? 'Cabins'
                    : cat === 'office'
                    ? 'Offices'
                    : 'Virtual';
                const isActive = categoryFilter === cat;
                return (
                  <motion.button
                    key={cat}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#212121] text-white shadow-xs'
                        : 'text-zinc-600 hover:text-[#212121]'
                    }`}
                  >
                    {label}
                  </motion.button>
                );
              })}
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 p-1 bg-white border border-[#D8DFE9] rounded-full shadow-2xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-[#212121] text-white' : 'text-zinc-500 hover:text-[#212121]'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-[#212121] text-white' : 'text-zinc-500 hover:text-[#212121]'
                }`}
                title="Table / List View"
              >
                <ListFilter className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* 5.2 Card Grid View */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredSpaces.map((space, idx) => {
              const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
                `Hi, I'd like to know more about ${space.name} at THE GRID`
              )}`;
              const callUrl = `tel:${siteConfig.phone}`;
              const isVirtual = space.iconType === 'virtual' || space.id === 'space-virtual-office';
              const spaceImage = getSpaceImage(space);

              return (
                <motion.div
                  key={space.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.45, delay: (idx % 4) * 0.08 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className={`rounded-2xl border flex flex-col justify-between transition-colors duration-300 relative bg-white overflow-hidden shadow-xs hover:shadow-md ${
                    isVirtual
                      ? 'border-[#EFF0A3] ring-1 ring-[#EFF0A3]'
                      : 'border-[#D8DFE9] hover:border-[#212121]'
                  }`}
                >
                  {/* Card Service Image with decreased left, top, and right padding */}
                  {spaceImage && (
                    <div className="p-2 sm:p-2.5 pb-0">
                      <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-zinc-100 relative shadow-2xs border border-[#D8DFE9]/60 group">
                        <img
                          src={spaceImage.url}
                          alt={spaceImage.alt}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                  )}

                  {/* Card Content */}
                  <div className={`px-5 sm:px-6 pb-4 flex-1 flex flex-col ${spaceImage ? 'pt-3 sm:pt-4' : 'pt-5 sm:pt-6'}`}>
                    {/* Top Row: Seats Info & Badge in a single clean flex row - eliminates collision on all viewports */}
                    <div className="flex items-center justify-between gap-2 mb-2.5 min-h-[22px]">
                      {space.seatsInfo ? (
                        <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider truncate flex-1 min-w-0">
                          {space.seatsInfo}
                        </span>
                      ) : (
                        <span className="flex-1" />
                      )}

                      {space.badge && (
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider shrink-0 whitespace-nowrap ${
                            isVirtual
                              ? 'bg-[#EFF0A3] text-[#212121] border border-[#DFE094] shadow-xs'
                              : 'bg-[#D8DFE9]/60 text-[#212121] border border-[#D8DFE9]'
                          }`}
                        >
                          {space.badge}
                        </span>
                      )}
                    </div>

                    {/* Card Title */}
                    <h3 className="font-['Oxygen'] text-xl font-bold uppercase text-[#212121] tracking-tight leading-snug mb-3">
                      {space.name}
                    </h3>

                    {/* Price Block */}
                    <div className="py-2 mb-4">
                      <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-0.5">
                        Pricing
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-['Oxygen'] text-2xl sm:text-3xl font-bold text-[#212121]">
                          {space.price}
                        </span>
                      </div>
                      {space.unit && (
                        <span className="text-[11px] text-zinc-500 block mt-0.5">
                          {space.unit}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-zinc-600 leading-relaxed mb-4 min-h-[44px]">
                      {space.description}
                    </p>

                    {/* Features list */}
                    <div className="pt-2">
                      <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider block mb-2">
                        Includes:
                      </span>
                      <ul className="space-y-2">
                        {space.features.map((feat, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-xs text-zinc-700 pb-1.5"
                          >
                            <Check className="w-3.5 h-3.5 text-[#212121] shrink-0 mt-0.5" />
                            <span className="leading-snug">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card CTA: WhatsApp Button + Call Phone Button */}
                  <div className="p-6 pt-4 border-t border-[#D8DFE9]/60 bg-[#F6F5FA]/60">
                    <div className="grid grid-cols-[1fr_auto] gap-2.5">
                      {/* Button 1: Enquire on WhatsApp with Honeydew tint */}
                      <motion.a
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-full bg-[#CFDECA] hover:bg-[#b8cbb3] text-[#212121] text-xs font-bold transition-colors shadow-xs text-center leading-none"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">Enquire on WhatsApp</span>
                      </motion.a>

                      {/* Button 2: Call Phone Icon in Eerie Black */}
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={callUrl}
                        aria-label={`Call THE GRID at ${siteConfig.phone}`}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-[#212121] hover:bg-[#333333] text-white transition-colors shadow-xs shrink-0"
                        title={`Call ${siteConfig.phone}`}
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </motion.a>
                    </div>

                    {!space.isAvailable && (
                      <span className="text-[10px] text-rose-600 font-semibold text-center block mt-2">
                        Waitlist currently active
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* 5.5 Directory Table / List View */
          <div className="bg-white rounded-2xl border border-[#D8DFE9] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#D8DFE9]/20 text-[#212121] uppercase text-[11px] font-bold border-b border-[#D8DFE9]">
                    <th className="py-3.5 px-6">Space Name / Plan</th>
                    <th className="py-3.5 px-6">Capacity</th>
                    <th className="py-3.5 px-6">Features Summary</th>
                    <th className="py-3.5 px-6">Rate</th>
                    <th className="py-3.5 px-6 text-right">Instant Enquiries</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSpaces.map((space) => {
                    const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
                      `Hi, I'd like to know more about ${space.name} at THE GRID`
                    )}`;
                    const callUrl = `tel:${siteConfig.phone}`;
                    const spaceImage = getSpaceImage(space);

                    return (
                      <tr key={space.id} className="hover:bg-[#F6F5FA]/70 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            {spaceImage && (
                              <div className="w-12 h-9 rounded-lg overflow-hidden shrink-0 border border-[#D8DFE9]/70 bg-zinc-100 hidden sm:block">
                                <img
                                  src={spaceImage.url}
                                  alt={spaceImage.alt}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            )}
                            <div>
                              <div className="font-['Oxygen'] text-base font-bold uppercase text-[#212121]">
                                {space.name}
                              </div>
                              {space.badge && (
                                <span className="inline-block mt-0.5 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#EFF0A3] text-[#212121] border border-[#DFE094]">
                                  {space.badge}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-zinc-700 font-medium">
                          {space.seatsInfo || 'Flexible'}
                        </td>
                        <td className="py-4 px-6 text-zinc-600 max-w-xs truncate">
                          {space.features.join(' · ')}
                        </td>
                        <td className="py-4 px-6 font-['Oxygen'] text-base font-bold text-[#212121]">
                          {space.price}
                          <span className="text-[10px] text-zinc-500 font-sans block font-normal">
                            {space.unit}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="inline-flex items-center gap-2 justify-end">
                            <motion.a
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              href={whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#CFDECA] text-[#212121] text-[11px] font-bold shadow-xs hover:bg-[#b8cbb3] transition-colors"
                            >
                              <WhatsAppIcon className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </motion.a>
                            <motion.a
                              whileHover={{ scale: 1.08 }}
                              whileTap={{ scale: 0.92 }}
                              href={callUrl}
                              className="w-8 h-8 rounded-full bg-[#212121] text-white flex items-center justify-center hover:bg-[#333333] transition-colors"
                              title="Call"
                            >
                              <Phone className="w-3 h-3" />
                            </motion.a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
