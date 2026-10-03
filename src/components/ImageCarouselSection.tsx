import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';

interface GalleryImage {
  id: number;
  localUrl: string;
  fallbackUrl: string;
  title: string;
  category: string;
  description: string;
}

const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: 1,
    localUrl: '/gallery/gallery-1.jpg',
    fallbackUrl: 'https://i.postimg.cc/BZkNn1nK/IMG-20261002-WA0001.jpg',
    title: 'Executive Cabins & Private Suites',
    category: '1st Floor Hilite',
    description: 'Fully furnished private office cabins with premium glass partitions, acoustic privacy, and dedicated ergonomic setups.',
  },
  {
    id: 2,
    localUrl: '/gallery/gallery-2.jpg',
    fallbackUrl: 'https://i.postimg.cc/J4XxD4yM/IMG-20261002-WA0002.jpg',
    title: 'Conference & Meeting Room',
    category: 'Meeting Spaces',
    description: 'Professional conference facilities equipped for client presentations, board meetings, and high-stakes hybrid syncs.',
  },
  {
    id: 3,
    localUrl: '/gallery/gallery-3.jpg',
    fallbackUrl: 'https://i.postimg.cc/QCTQT0dh/IMG-20261002-WA0003.jpg',
    title: 'Private Lockable Team Cabins',
    category: 'Private Cabins',
    description: 'Tailored 4, 6, 8, 12 and 16-seater closed offices offering privacy, custom branding, and lockable storage.',
  },
  {
    id: 4,
    localUrl: '/gallery/gallery-4.jpg',
    fallbackUrl: 'https://i.postimg.cc/qvL8yt4X/IMG-20261002-WA0004.jpg',
    title: 'Dedicated Workstation Desks',
    category: 'Coworking Floor',
    description: 'Dedicated and flexible hot desks with ergonomic seating, individual power strips, and dual fiber high-speed internet.',
  },
  {
    id: 5,
    localUrl: '/gallery/gallery-5.jpg',
    fallbackUrl: 'https://i.postimg.cc/KzKL6JLt/IMG-20261002-WA0005.jpg',
    title: 'Spacious Open Coworking Floor',
    category: 'Open Coworking',
    description: 'Spacious, air-conditioned shared floor built for founders, freelance developers, and creative teams to build without friction.',
  },
  {
    id: 6,
    localUrl: '/gallery/gallery-6.jpg',
    fallbackUrl: 'https://i.postimg.cc/gcZ84tGk/IMG-20261002-WA0006.jpg',
    title: 'Front Entrance & Walk-in Access',
    category: 'Lobby & Access',
    description: 'Direct 1st Floor walk-in access at Hilite Business Park Phase 2 — zero elevator bottlenecks before your morning meetings.',
  },
  {
    id: 7,
    localUrl: '/gallery/gallery-7.jpg',
    fallbackUrl: 'https://i.postimg.cc/zGJhzJKF/IMG-20261002-WA0007.jpg',
    title: 'Team Workspaces & Managed Cabins',
    category: 'Team Suites',
    description: 'Fully managed office wings scalable up to 24 seats with plug-and-play move-in readiness and daily maintenance.',
  },
  {
    id: 8,
    localUrl: '/gallery/gallery-8.jpg',
    fallbackUrl: 'https://i.postimg.cc/N0FrXpNH/IMG-20261002-WA0008.jpg',
    title: 'Community Breakout & Lounge Area',
    category: 'Amenities & Lounge',
    description: 'Recharge with fresh bean-to-cup coffee, games and relaxation zones, and casual collaborative seating areas.',
  },
];

export const ImageCarouselSection: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [selectedImageIdx, setSelectedImageIdx] = useState<number | null>(null);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (selectedImageIdx === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImageIdx(null);
      } else if (e.key === 'ArrowRight') {
        setSelectedImageIdx((prev) => (prev !== null ? (prev + 1) % GALLERY_IMAGES.length : 0));
      } else if (e.key === 'ArrowLeft') {
        setSelectedImageIdx((prev) =>
          prev !== null ? (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length : 0
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIdx]);

  // Duplicate items for infinite seamless scroll
  const duplicatedImages = [...GALLERY_IMAGES, ...GALLERY_IMAGES];

  return (
    <section
      id="gallery"
      className="pt-14 sm:pt-20 pb-4 sm:pb-6 bg-[#F6F5FA] relative overflow-hidden border-t border-[#D8DFE9]/50"
      aria-label="Workspace Portrait Photo Gallery Carousel"
    >
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#212121] bg-[#EFF0A3] px-2.5 py-0.5 rounded-full border border-[#DFE094] inline-flex items-center gap-1.5">
              <Camera className="w-3 h-3 text-[#212121]" />
              Photo Gallery
            </span>
            <span className="text-zinc-300">·</span>
            <span className="text-xs text-zinc-500 font-medium">1st Floor Walkthrough</span>
          </div>

          <h2 className="font-['Oxygen'] text-3xl sm:text-5xl font-bold uppercase tracking-tight text-[#212121]">
            SEE INSIDE THE GRID.
          </h2>
        </div>
      </div>

      {/* Moving Portrait Carousel Track (Right to Left) */}
      <div
        className="relative w-full overflow-hidden py-3"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Soft edge blur masks on sides */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-28 lg:w-36 bg-gradient-to-r from-[#F6F5FA] via-[#F6F5FA]/80 to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-28 lg:w-36 bg-gradient-to-l from-[#F6F5FA] via-[#F6F5FA]/80 to-transparent pointer-events-none z-10" />

        {/* Marquee Track Moving from Right to Left */}
        <div
          className={`animate-gallery-marquee flex gap-6 sm:gap-7 lg:gap-8 ${
            isPaused ? 'is-paused' : ''
          }`}
          style={{ willChange: 'transform' }}
        >
          {duplicatedImages.map((img, index) => {
            const actualIndex = index % GALLERY_IMAGES.length;
            return (
              <motion.div
                key={`${img.id}-${index}`}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                onClick={() => setSelectedImageIdx(actualIndex)}
                className="group relative w-[82vw] sm:w-[46vw] md:w-[40vw] lg:w-[30.5vw] xl:w-[29vw] max-w-[490px] shrink-0 rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-[#D8DFE9] hover:border-[#212121] shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer select-none"
              >
                {/* 4:5 Portrait Photo Container */}
                <div className="aspect-[4/5] w-full overflow-hidden bg-zinc-100 relative">
                  <img
                    src={img.localUrl}
                    alt={`${img.title} at THE GRID, Hilite Business Park, Calicut`}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.fallback) {
                        target.dataset.fallback = 'true';
                        target.src = img.fallbackUrl;
                      }
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal for enlarged portrait view */}
      <AnimatePresence>
        {selectedImageIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedImageIdx(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImageIdx(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors z-20 cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIdx((prev) =>
                  prev !== null ? (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length : 0
                );
              }}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors z-20 cursor-pointer"
              title="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIdx((prev) =>
                  prev !== null ? (prev + 1) % GALLERY_IMAGES.length : 0
                );
              }}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors z-20 cursor-pointer"
              title="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Lightbox Content Container (Clean Full Portrait View) */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full bg-black rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="relative aspect-[4/5] w-full bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={GALLERY_IMAGES[selectedImageIdx].localUrl}
                  alt={GALLERY_IMAGES[selectedImageIdx].title}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.fallback) {
                      target.dataset.fallback = 'true';
                      target.src = GALLERY_IMAGES[selectedImageIdx].fallbackUrl;
                    }
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
