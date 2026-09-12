import React from 'react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import { MapPin, Phone, Mail, Instagram, ExternalLink, Navigation } from 'lucide-react';

export const LocationSection: React.FC = () => {
  const { siteConfig } = useData();

  const googleMapsDirections = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'HiLITE Business Park Calicut Kerala'
  )}`;

  return (
    <section id="location" className="py-20 sm:py-28 lg:py-32 bg-[#F6F5FA] relative">
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24">
        
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
              North Kerala's Tech Corridor
            </span>
            <span className="text-zinc-300">·</span>
            <span className="text-xs text-zinc-500 font-medium">Calicut Bypass</span>
          </div>

          <h2 className="font-['Oxygen'] text-3xl sm:text-5xl font-bold uppercase tracking-tight text-[#212121]">
            WHERE TO FIND US.
          </h2>

          <p className="text-zinc-600 text-sm mt-1">
            Strategically situated at Hilite Business Park, Calicut's landmark commercial destination.
          </p>
        </motion.div>

        {/* Location Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* Details Card (White card on Ghost White with Alice Blue borders) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="p-8 rounded-2xl bg-white border border-[#D8DFE9] shadow-xs flex flex-col justify-between hover:border-[#212121]/40 transition-colors"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3">
                <span className="text-[11px] font-bold uppercase text-zinc-500 tracking-wider">
                  Contact Information
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#EFF0A3] text-[#212121] border border-[#DFE094]">
                  Calicut, Kerala
                </span>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4 pb-4">
                <div className="w-9 h-9 rounded-xl bg-[#D8DFE9]/40 flex items-center justify-center shrink-0 border border-[#D8DFE9]">
                  <MapPin className="w-4 h-4 text-[#212121]" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold uppercase text-zinc-500 tracking-wider mb-1">
                    Address
                  </h4>
                  <p className="text-sm font-semibold text-[#212121] leading-snug">
                    {siteConfig.address}
                  </p>
                  <p className="text-xs text-zinc-800 font-semibold mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#CFDECA]/60">
                    <span>✓ 1st Floor (Instant walk-in access)</span>
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4 pb-4">
                <div className="w-9 h-9 rounded-xl bg-[#D8DFE9]/40 flex items-center justify-center shrink-0 border border-[#D8DFE9]">
                  <Phone className="w-4 h-4 text-[#212121]" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold uppercase text-zinc-500 tracking-wider mb-1">
                    Direct Telephone
                  </h4>
                  <a
                    href={`tel:${siteConfig.phone}`}
                    className="text-sm font-semibold text-[#212121] hover:text-zinc-600 transition-colors block"
                  >
                    {siteConfig.phoneFormatted}
                  </a>
                  <span className="text-[11px] text-zinc-500">Open Mon–Sat 8:30 AM – 9:00 PM</span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 pb-4">
                <div className="w-9 h-9 rounded-xl bg-[#D8DFE9]/40 flex items-center justify-center shrink-0 border border-[#D8DFE9]">
                  <Mail className="w-4 h-4 text-[#212121]" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold uppercase text-zinc-500 tracking-wider mb-1">
                    Email
                  </h4>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="text-sm font-semibold text-[#212121] hover:text-zinc-600 transition-colors"
                  >
                    {siteConfig.email}
                  </a>
                </div>
              </div>

              {/* Instagram */}
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-[#D8DFE9]/40 flex items-center justify-center shrink-0 border border-[#D8DFE9]">
                  <Instagram className="w-4 h-4 text-[#212121]" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold uppercase text-zinc-500 tracking-wider mb-1">
                    Instagram
                  </h4>
                  <a
                    href={siteConfig.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-[#212121] hover:text-zinc-600 transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>{siteConfig.instagram}</span>
                    <ExternalLink className="w-3 h-3 text-zinc-500" />
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4">
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={googleMapsDirections}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#212121] hover:bg-[#333333] text-white text-xs font-semibold transition-colors shadow-xs"
              >
                <Navigation className="w-3.5 h-3.5 text-[#EFF0A3]" />
                <span>Open in Google Maps</span>
              </motion.a>
            </div>
          </motion.div>

          {/* Map Embed Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.1 }}
            className="rounded-2xl overflow-hidden border border-[#D8DFE9] min-h-[380px] bg-white shadow-xs relative"
          >
            <iframe
              title="THE GRID at Hilite Business Park, Calicut"
              src={siteConfig.googleMapsEmbedUrl}
              className="w-full h-full min-h-[400px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
