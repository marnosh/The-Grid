import React, { useState } from 'react';
import gridLogo from '../assets/grid-logo.png';

export const GRID_LOGO_URL = 'https://i.postimg.cc/gk75xJ3T/1000074863-removebg-preview.png';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  darkTheme?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  darkTheme = false,
  className = '',
}) => {
  const [imgSrc, setImgSrc] = useState<string>(gridLogo);

  // Height & scale profiles tuned to the 1084x230 natural ratio of THE GRID logo
  const sizeStyles = {
    sm: 'h-7 sm:h-8 max-w-[140px] sm:max-w-[160px]',
    md: 'h-8 sm:h-9 md:h-10 max-w-[180px] sm:max-w-[210px]',
    lg: 'h-10 sm:h-11 md:h-12 max-w-[220px] sm:max-w-[260px]',
    xl: 'w-full max-w-[260px] sm:max-w-[340px] md:max-w-[440px] lg:max-w-[520px] max-h-[140px]',
  }[size];

  return (
    <div className={`inline-flex items-center select-none group cursor-pointer ${className}`}>
      <img
        src={imgSrc}
        onError={() => {
          if (imgSrc !== GRID_LOGO_URL) {
            setImgSrc(GRID_LOGO_URL);
          }
        }}
        alt="THE GRID - Powered by Castillo"
        referrerPolicy="no-referrer"
        className={`w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-[1.02] ${sizeStyles} ${
          darkTheme
            ? 'filter drop-shadow-[0_1px_10px_rgba(255,255,255,0.14)] brightness-105'
            : 'filter drop-shadow-[0_1px_3px_rgba(0,0,0,0.06)]'
        }`}
      />
    </div>
  );
};

