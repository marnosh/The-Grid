import React from 'react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import {
  Armchair,
  Snowflake,
  Building2,
  Wifi,
  Gamepad2,
  Coffee,
  CheckCircle2,
} from 'lucide-react';
import { AmenityItem } from '../types';

export const AmenitiesSection: React.FC = () => {
  const { amenities } = useData();

  const getAmenityIcon = (iconName: AmenityItem['icon']) => {
    switch (iconName) {
      case 'sofa':
        return <Armchair className="w-5 h-5 text-[#212121]" />;
      case 'snowflake':
        return <Snowflake className="w-5 h-5 text-[#212121]" />;
      case 'map-pin':
        return <Building2 className="w-5 h-5 text-[#212121]" />;
      case 'wifi':
        return <Wifi className="w-5 h-5 text-[#212121]" />;
      case 'gamepad':
        return <Gamepad2 className="w-5 h-5 text-[#212121]" />;
      case 'coffee':
        return <Coffee className="w-5 h-5 text-[#212121]" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-[#212121]" />;
    }
  };

  const enabledAmenities = amenities.filter((a) => a.enabled);

  return (
    <section id="amenities" className="py-20 sm:py-28 lg:py-32 bg-[#F6F5FA] relative">
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
              Zero Add-On Fees
            </span>
            <span className="text-zinc-300">·</span>
            <span className="text-xs text-zinc-500 font-medium">Standard with all desks & cabins</span>
          </div>

          <h2 className="font-['Oxygen'] text-3xl sm:text-5xl font-bold uppercase tracking-tight text-[#212121]">
            AMENITIES INCLUDED.
          </h2>

          <p className="text-zinc-600 text-sm mt-1">
            Everything you and your team need for a seamless workday without utility bills or maintenance overheads.
          </p>
        </motion.div>

        {/* 6 Amenities Grid in White on Ghost White with Alice Blue borders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {enabledAmenities.map((amenity, idx) => (
            <motion.div
              key={amenity.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: idx * 0.07 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="p-7 rounded-2xl bg-white border border-[#D8DFE9] hover:border-[#212121] transition-colors shadow-xs flex flex-col justify-between group cursor-default"
            >
              <div>
                <div className="flex items-center justify-between pb-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#D8DFE9]/40 flex items-center justify-center shrink-0 border border-[#D8DFE9] group-hover:bg-[#EFF0A3]/50 transition-colors">
                    {getAmenityIcon(amenity.icon)}
                  </div>
                  <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                    Feature 0{idx + 1}
                  </span>
                </div>

                <h3 className="text-[#212121] font-bold text-base sm:text-lg mb-1.5 tracking-tight font-['Oxygen'] uppercase">
                  {amenity.title}
                </h3>
                
                <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                  {amenity.description}
                </p>
              </div>

              {/* Progress Bar with Pastel Vanilla / Honeydew */}
              <div className="pt-3">
                <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1.5 font-medium">
                  <span>Reliability</span>
                  <span className="font-bold text-[#212121]">100% Guaranteed</span>
                </div>
                <div className="w-full h-1.5 bg-[#F6F5FA] rounded-full overflow-hidden border border-[#D8DFE9]/50">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: idx * 0.07 + 0.15, ease: 'easeOut' }}
                    className="h-full bg-[#CFDECA] rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
