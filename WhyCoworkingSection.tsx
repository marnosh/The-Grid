import React from 'react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import { TrendingUp, Users2, ShieldCheck, Laptop, Clock, ArrowDownRight, CheckCircle2 } from 'lucide-react';

export const DEFAULT_WHY_COWORKING_DESCRIPTIONS: Record<string, string> = {
  'Cost-effective and affordable':
    'Desks and cabins start at ₹3,500 and a virtual office at ₹999/month — a fraction of what a private office lease in Calicut would cost you.',
  'Networking and collaboration opportunities':
    'Shared desks and a common games & fun zone put you next to other founders and freelancers, not alone in a rented room.',
  'Professional work environment, increased productivity':
    "Fully furnished desks, air conditioning and high-speed WiFi mean you're not fixing office problems — you're just working.",
  'Great for freelancers, startups and remote workers':
    'No lease, no deposit lock-in, no hiring an office manager — scale from a single hot desk to a 24-seater as your team grows.',
  'Saves time on office management':
    'Pantry, parking, courier handling and a signed name board are already sorted — you skip the setup and start working from day one.',
};

const DEFAULT_INDEX_DESCRIPTIONS = [
  'Desks and cabins start at ₹3,500 and a virtual office at ₹999/month — a fraction of what a private office lease in Calicut would cost you.',
  'Shared desks and a common games & fun zone put you next to other founders and freelancers, not alone in a rented room.',
  "Fully furnished desks, air conditioning and high-speed WiFi mean you're not fixing office problems — you're just working.",
  'No lease, no deposit lock-in, no hiring an office manager — scale from a single hot desk to a 24-seater as your team grows.',
  'Pantry, parking, courier handling and a signed name board are already sorted — you skip the setup and start working from day one.',
];

export const WhyCoworkingSection: React.FC = () => {
  const { siteConfig } = useData();

  const getPointDescription = (pointTitle: string, index: number): string => {
    if (
      siteConfig.whyCoworkingDescriptions &&
      siteConfig.whyCoworkingDescriptions[index] &&
      siteConfig.whyCoworkingDescriptions[index].trim() !== ''
    ) {
      return siteConfig.whyCoworkingDescriptions[index];
    }
    return (
      DEFAULT_WHY_COWORKING_DESCRIPTIONS[pointTitle] ||
      DEFAULT_INDEX_DESCRIPTIONS[index] ||
      'Eliminates administrative distraction so you can direct your energy into shipping code, meeting clients, and scaling revenues.'
    );
  };

  const icons = [
    <TrendingUp key="1" className="w-5 h-5 text-[#212121]" />,
    <Users2 key="2" className="w-5 h-5 text-[#212121]" />,
    <ShieldCheck key="3" className="w-5 h-5 text-[#212121]" />,
    <Laptop key="4" className="w-5 h-5 text-[#212121]" />,
    <Clock key="5" className="w-5 h-5 text-[#212121]" />,
  ];

  return (
    <section id="why-coworking" className="py-20 sm:py-28 lg:py-32 bg-[#F6F5FA] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="max-w-3xl mb-12"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#212121] bg-[#EFF0A3] px-2.5 py-0.5 rounded-full border border-[#DFE094]">
              The Core Advantage
            </span>
            <span className="text-zinc-300">·</span>
            <span className="text-xs text-zinc-500 font-medium">Calicut Workspace Economics</span>
          </div>

          <h2 className="font-['Oxygen'] text-3xl sm:text-5xl font-bold uppercase tracking-tight text-[#212121]">
            WHY COWORKING WORKS.
          </h2>

          <p className="text-zinc-600 text-sm mt-1">
            Five solid commercial reasons Calicut founders choose shared infrastructure over private leases.
          </p>
        </motion.div>

        {/* 5 Points Grid + "No Stairs, No Stress" Callout Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {siteConfig.whyCoworkingPoints.map((point, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="p-7 rounded-2xl bg-white border border-[#D8DFE9] hover:border-[#212121] transition-colors shadow-xs flex flex-col justify-between group cursor-default"
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-[#D8DFE9]/40 flex items-center justify-center border border-[#D8DFE9] group-hover:bg-[#EFF0A3]/50 transition-colors">
                    {icons[idx % icons.length]}
                  </div>
                  <span className="text-[11px] font-bold text-zinc-500 uppercase">
                    0{idx + 1}
                  </span>
                </div>

                <h3 className="text-[#212121] font-bold text-base mb-2 leading-snug">
                  {point}
                </h3>
                
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {getPointDescription(point, idx)}
                </p>
              </div>

              <div className="mt-5 pt-3 flex items-center justify-between text-[11px] text-zinc-600 font-medium">
                <span>Verified THE GRID Benefit</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#212121]" />
              </div>
            </motion.div>
          ))}

          {/* Callout Card: No stairs, no stress in pastel Honeydew (#CFDECA) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, delay: 0.42 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="p-7 rounded-2xl bg-[#CFDECA]/40 border border-[#CFDECA] shadow-xs flex flex-col justify-between md:col-span-2 lg:col-span-1 cursor-default hover:border-[#212121]/50 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between pb-3 mb-4">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#212121]">
                  Zero Vertical Friction
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#EFF0A3] text-[#212121] border border-[#DFE094]">
                  1st Floor
                </span>
              </div>

              <h3 className="font-['Oxygen'] text-2xl font-bold uppercase text-[#212121] tracking-tight mb-2">
                NO STAIRS, NO STRESS
              </h3>

              <p className="text-xs text-zinc-700 leading-relaxed">
                {siteConfig.floorNotice}
              </p>
            </div>

            <div className="mt-5 pt-3 flex items-center justify-between text-xs text-[#212121] font-bold">
              <span>Phase 2, Hilite Business Park</span>
              <ArrowDownRight className="w-4 h-4 text-[#212121]" />
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};
