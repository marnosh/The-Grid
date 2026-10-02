import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import { BrandLogo } from './BrandLogo';

const SESSION_STORAGE_KEY = 'thegrid_split_intro_v3';

export const SplitSquareIntro: React.FC = () => {
  // Initialize to true so there is NEVER a flash of site content behind it on first render
  const [isVisible, setIsVisible] = useState(true);
  const [isOpening, setIsOpening] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [canTriggerByScroll, setCanTriggerByScroll] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const triggeredRef = useRef<boolean>(false);

  const triggerOpen = useCallback(() => {
    if (triggeredRef.current) return;
    triggeredRef.current = true;
    setIsOpening(true);

    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
    } catch {
      // Ignore private mode storage restrictions
    }

    // After animation duration (~1050ms), cleanly unmount and clear
    setTimeout(() => {
      setIsFinished(true);
      setIsVisible(false);
    }, 1100);
  }, []);

  // Replay function exposed to global custom event
  const replayIntro = useCallback(() => {
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      sessionStorage.removeItem('thegrid_split_intro_shown');
    } catch {
      // ignore
    }
    triggeredRef.current = false;
    setCanTriggerByScroll(false);
    setIsFinished(false);
    setIsOpening(false);
    setIsVisible(true);

    if (timerRef.current) clearTimeout(timerRef.current);
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);

    // Hold for 800ms before allowing scroll triggers
    holdTimerRef.current = setTimeout(() => {
      setCanTriggerByScroll(true);
    }, 800);

    // Auto trigger after 1800ms if user remains idle
    timerRef.current = setTimeout(() => {
      triggerOpen();
    }, 1800);
  }, [triggerOpen]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Listen for custom replay event at any time
    window.addEventListener('thegrid-replay-intro', replayIntro);

    // 1. Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsFinished(true);
      setIsVisible(false);
      return () => {
        window.removeEventListener('thegrid-replay-intro', replayIntro);
      };
    }

    // 2. Check session storage (only play once per session)
    try {
      const hasPlayed = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (hasPlayed === 'true') {
        setIsFinished(true);
        setIsVisible(false);
        return () => {
          window.removeEventListener('thegrid-replay-intro', replayIntro);
        };
      }
    } catch {
      // continue
    }

    // Start hold timer: Hold for ~800ms before allowing scroll triggers
    holdTimerRef.current = setTimeout(() => {
      setCanTriggerByScroll(true);
    }, 800);

    // Start auto-dismiss timer (idle 1.5s after initial hold = ~2000ms total, only when visible)
    const startIdleTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        triggerOpen();
      }, 2000);
    };

    if (document.visibilityState === 'visible') {
      startIdleTimer();
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !triggeredRef.current) {
        startIdleTimer();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      window.removeEventListener('thegrid-replay-intro', replayIntro);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [triggerOpen, replayIntro]);

  // Handle user scroll / wheel / touch activity only after hold period (~800ms)
  useEffect(() => {
    if (!canTriggerByScroll || isFinished || triggeredRef.current) return;

    const handleActivity = () => {
      triggerOpen();
    };

    window.addEventListener('wheel', handleActivity, { passive: true, once: true });
    window.addEventListener('touchmove', handleActivity, { passive: true, once: true });
    window.addEventListener('scroll', handleActivity, { passive: true, once: true });
    window.addEventListener('keydown', handleActivity, { once: true });

    return () => {
      window.removeEventListener('wheel', handleActivity);
      window.removeEventListener('touchmove', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, [canTriggerByScroll, isFinished, triggerOpen]);

  if (!isVisible || isFinished) {
    return null;
  }

  // Smooth ease-out curve over 1000ms
  const transitionConfig = {
    duration: 1.0,
    ease: [0.16, 1, 0.3, 1] as const,
  };

  return (
    <div
      id="intro-split-overlay"
      className={`fixed inset-0 z-[9999] overflow-hidden select-none ${
        isOpening ? 'pointer-events-none' : 'pointer-events-auto cursor-pointer'
      }`}
      onClick={triggerOpen}
      role="region"
      aria-label="THE GRID Intro animation"
      style={{ display: isFinished ? 'none' : 'block' }}
    >
      {/* 1. Top-Left: "THE GRID" official logo on black background */}
      <motion.div
        initial={{ x: 0, y: 0, opacity: 1 }}
        animate={isOpening ? { x: '-102%', y: '-102%', opacity: 0 } : { x: 0, y: 0, opacity: 1 }}
        transition={transitionConfig}
        className="absolute top-0 left-0 w-1/2 h-1/2 bg-black flex flex-col items-center justify-center p-6 sm:p-10 border-r border-b border-white/10"
      >
        <div className="flex flex-col items-center justify-center text-center max-w-full px-4 sm:px-6">
          <BrandLogo size="xl" darkTheme={true} />
        </div>
      </motion.div>

      {/* 2. Top-Right: Brand's fine architectural line-grid pattern on black background */}
      <motion.div
        initial={{ x: 0, y: 0, opacity: 1 }}
        animate={isOpening ? { x: '102%', y: '-102%', opacity: 0 } : { x: 0, y: 0, opacity: 1 }}
        transition={transitionConfig}
        className="absolute top-0 right-0 w-1/2 h-1/2 bg-black overflow-hidden border-b border-white/10"
      >
        {/* Crisp architectural grid pattern matching the brand motif */}
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <pattern id="split-fine-grid" width="36" height="36" patternUnits="userSpaceOnUse">
              <path
                d="M 36 0 L 0 0 0 36"
                fill="none"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="1"
              />
              <circle cx="0" cy="0" r="1.5" fill="rgba(255, 255, 255, 0.35)" />
            </pattern>
            <pattern id="split-major-grid" width="108" height="108" patternUnits="userSpaceOnUse">
              <rect width="108" height="108" fill="url(#split-fine-grid)" />
              <path
                d="M 108 0 L 0 0 0 108"
                fill="none"
                stroke="rgba(255, 255, 255, 0.28)"
                strokeWidth="1.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#split-major-grid)" />
        </svg>
        {/* Architectural coordinate stamp */}
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 font-mono text-[9px] sm:text-[10px] tracking-widest text-zinc-500 uppercase">
          MOD.01 // ARCH.GRID
        </div>
      </motion.div>

      {/* 3. Bottom-Left: Round ash/dot pattern on black background */}
      <motion.div
        initial={{ x: 0, y: 0, opacity: 1 }}
        animate={isOpening ? { x: '-102%', y: '102%', opacity: 0 } : { x: 0, y: 0, opacity: 1 }}
        transition={transitionConfig}
        className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-black overflow-hidden border-r border-white/10"
      >
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <filter id="ash-blur-sm" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" />
            </filter>
            <filter id="ash-blur-md" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5.5" />
            </filter>
            <filter id="ash-blur-lg" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="9" />
            </filter>
          </defs>

          {/* Scattered soft circular grayscale dots of varying size and opacity */}
          <g>
            {/* Small soft dots */}
            <circle cx="15%" cy="20%" r="8" fill="#E4E4E7" opacity="0.32" filter="url(#ash-blur-sm)" />
            <circle cx="28%" cy="75%" r="12" fill="#D4D4D8" opacity="0.25" filter="url(#ash-blur-sm)" />
            <circle cx="65%" cy="30%" r="10" fill="#A1A1AA" opacity="0.35" filter="url(#ash-blur-sm)" />
            <circle cx="82%" cy="68%" r="7" fill="#F4F4F5" opacity="0.4" filter="url(#ash-blur-sm)" />
            <circle cx="45%" cy="15%" r="9" fill="#71717A" opacity="0.28" filter="url(#ash-blur-sm)" />
            <circle cx="90%" cy="25%" r="11" fill="#D4D4D8" opacity="0.3" filter="url(#ash-blur-sm)" />
            <circle cx="10%" cy="85%" r="9" fill="#A1A1AA" opacity="0.22" filter="url(#ash-blur-sm)" />
            <circle cx="55%" cy="82%" r="14" fill="#E4E4E7" opacity="0.3" filter="url(#ash-blur-sm)" />

            {/* Medium smoky dots */}
            <circle cx="22%" cy="45%" r="24" fill="#A1A1AA" opacity="0.22" filter="url(#ash-blur-md)" />
            <circle cx="75%" cy="50%" r="32" fill="#71717A" opacity="0.28" filter="url(#ash-blur-md)" />
            <circle cx="40%" cy="60%" r="28" fill="#D4D4D8" opacity="0.18" filter="url(#ash-blur-md)" />
            <circle cx="85%" cy="85%" r="20" fill="#52525B" opacity="0.35" filter="url(#ash-blur-md)" />
            <circle cx="35%" cy="25%" r="22" fill="#E4E4E7" opacity="0.15" filter="url(#ash-blur-md)" />

            {/* Large diffused smoky ash blooms */}
            <circle cx="50%" cy="45%" r="55" fill="#71717A" opacity="0.16" filter="url(#ash-blur-lg)" />
            <circle cx="15%" cy="60%" r="48" fill="#52525B" opacity="0.22" filter="url(#ash-blur-lg)" />
            <circle cx="70%" cy="20%" r="42" fill="#A1A1AA" opacity="0.14" filter="url(#ash-blur-lg)" />
          </g>
        </svg>
        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 font-mono text-[9px] sm:text-[10px] tracking-widest text-zinc-500 uppercase">
          TEX.02 // ASH.DIFFUSE
        </div>
      </motion.div>

      {/* 4. Bottom-Right: Solid black panel with the tagline in small centered white text */}
      <motion.div
        initial={{ x: 0, y: 0, opacity: 1 }}
        animate={isOpening ? { x: '102%', y: '102%', opacity: 0 } : { x: 0, y: 0, opacity: 1 }}
        transition={transitionConfig}
        className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-black flex flex-col items-center justify-center p-6 sm:p-10"
      >
        <p className="font-['Oxygen'] text-xs sm:text-sm md:text-base font-normal tracking-wide text-zinc-200 text-center max-w-xs leading-relaxed">
          A coworking space without the stress or the rent.
        </p>
      </motion.div>

      {/* Subtle indicator hint at center intersection */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpening ? 0 : 0.8 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center pointer-events-none"
      >
        <span className="font-mono text-[10px] tracking-widest uppercase text-zinc-400 bg-black/40 px-3 py-1 rounded-full border border-white/10 backdrop-blur-xs">
          Scroll or click to enter
        </span>
      </motion.div>
    </div>
  );
};
