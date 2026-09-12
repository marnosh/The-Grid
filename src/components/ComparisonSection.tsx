import React from 'react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import { XCircle, CheckCircle2, Phone } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

export const ComparisonSection: React.FC = () => {
  const { siteConfig } = useData();

  const whatsappHeroUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    'Hi, I would like to schedule a visit and check workspace availability at THE GRID Calicut.'
  )}`;

  return (
    <section id="comparison" className="py-20 sm:py-28 lg:py-32 bg-[#F6F5FA] relative">
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 w-full">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="max-w-3xl mx-auto text-center mb-14 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D8DFE9] bg-white/90 text-[11px] font-semibold tracking-wider uppercase text-[#212121] shadow-xs mb-4">
            <span className="w-2 h-2 rounded-full bg-[#CFDECA]" />
            Workspace Comparison
          </div>

          <h2 className="font-['Oxygen'] text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-[#212121] leading-tight mb-4">
            THE REAL COST OF A WORKSPACE
          </h2>

          <p className="text-zinc-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            See how traditional private leases compare with flexible, fully-managed plug-and-play offices at THE GRID in Hilite Business Park.
          </p>
        </motion.div>

        {/* Editorial Dual-Card Comparison Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch mb-14 sm:mb-20">
          
          {/* Card 1: Conventional Office */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="p-7 sm:p-9 rounded-2xl bg-white/95 border border-[#D8DFE9] shadow-sm flex flex-col justify-between hover:border-[#212121]/30 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-[#D8DFE9]/50">
                <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                  The Conventional Way
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                  <XCircle className="w-3 h-3 text-rose-600" /> High Overhead
                </span>
              </div>

              <h3 className="font-['Oxygen'] text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#212121] leading-tight mb-3">
                STRESS & EXPENSIVE RENT
              </h3>

              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-6">
                Heavy 3-5 year lock-in contracts, 6-10 month security deposits, unexpected maintenance expenses, internet downtime, and broker commissions.
              </p>

              <div className="space-y-3 text-xs text-zinc-700 font-medium">
                <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                  <span>Upfront capital expenditure</span>
                  <span className="font-bold text-rose-700">₹3L - ₹10L+</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                  <span>Lease commitment</span>
                  <span className="font-bold text-zinc-600">3 - 5 Years Lock-in</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>Admin & bills management</span>
                  <span className="text-zinc-500">Distracting & Costly</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-100 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Why lock away working capital on non-core overheads?
            </div>
          </motion.div>

          {/* Card 2: THE GRID Solution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="p-7 sm:p-9 rounded-2xl bg-[#212121] border border-[#383838] text-white shadow-xl flex flex-col justify-between relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#CFDECA]" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-300">
                    THE GRID Solution
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#212121] bg-[#EFF0A3] px-3 py-0.5 rounded-full shadow-xs">
                  1st Floor · Hilite Phase 2
                </span>
              </div>

              <h3 className="font-['Oxygen'] text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-white leading-tight mb-3">
                A CO-WORKING <span className="text-[#EFF0A3]">SPACE</span> THAT WORKS FOR YOU
              </h3>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6">
                Designed to help you grow your business quickly within your budget — fully furnished, plug-and-play desks, private cabins, and virtual offices in Calicut.
              </p>

              {/* Stat Grid with Pastel Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
                <motion.div whileHover={{ scale: 1.03 }} className="p-3 rounded-xl bg-white/5 border border-white/10 text-center transition-colors hover:border-white/20">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Desks from</span>
                  <span className="font-['Oxygen'] text-lg font-bold text-[#EFF0A3]">₹3,500</span>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} className="p-3 rounded-xl bg-white/5 border border-white/10 text-center transition-colors hover:border-white/20">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Virtual Office</span>
                  <span className="font-['Oxygen'] text-lg font-bold text-white">₹999/mo</span>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} className="p-3 rounded-xl bg-white/5 border border-white/10 text-center transition-colors hover:border-white/20">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Accessibility</span>
                  <span className="font-['Oxygen'] text-lg font-bold text-[#CFDECA]">1st Floor</span>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} className="p-3 rounded-xl bg-white/5 border border-white/10 text-center transition-colors hover:border-white/20">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Lock-in</span>
                  <span className="font-['Oxygen'] text-lg font-bold text-white">Zero</span>
                </motion.div>
              </div>

              <div className="space-y-2.5 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#CFDECA] shrink-0" />
                  <span>Ergonomic chairs, high-speed fiber internet, and power backup</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#CFDECA] shrink-0" />
                  <span>Free conference access, coffee machine, and breakout games lounge</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 pt-5 border-t border-white/10 flex flex-wrap items-center gap-3 relative z-20">
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href={whatsappHeroUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#CFDECA] hover:bg-[#b8cbb3] text-[#212121] font-bold text-xs transition-colors shadow-md cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>Enquire on WhatsApp</span>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href={`tel:${siteConfig.phone}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-zinc-100 text-[#212121] font-bold text-xs transition-colors shadow-sm cursor-pointer border border-[#D8DFE9]"
              >
                <Phone className="w-4 h-4 text-[#212121]" />
                <span>Call {siteConfig.phoneFormatted}</span>
              </motion.a>

              <span className="text-[11px] text-zinc-400 hidden sm:inline ml-auto">
                Phase 2, Hilite Business Park
              </span>
            </div>
          </motion.div>

        </div>

        {/* Quick Metric Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { label: 'Virtual Office', val: '₹999', sub: '/ month', note: 'Registered Hilite Park address' },
            { label: 'Hot Desks', val: '₹3,500', sub: '/ month', note: 'All amenities included' },
            { label: 'Private Cabins', val: '4 to 12', sub: 'Seaters', note: 'Acoustic privacy doors' },
            { label: 'Managed Offices', val: 'Up to 24', sub: 'Seats', note: 'Scalable dedicated suites' },
          ].map((metric, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              whileHover={{ y: -3, transition: { duration: 0.15 } }}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-[#D8DFE9] shadow-xs flex flex-col justify-between hover:border-[#212121]/30 transition-colors"
            >
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                  {metric.label}
                </span>
                <div className="font-['Oxygen'] text-2xl sm:text-3xl font-bold text-[#212121]">
                  {metric.val} <span className="text-xs font-sans text-zinc-500 font-normal">{metric.sub}</span>
                </div>
              </div>
              <span className="text-[11px] text-zinc-500 mt-2 block">{metric.note}</span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
