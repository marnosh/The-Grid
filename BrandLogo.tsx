import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  darkTheme?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', darkTheme = false }) => {
  const iconSize = size === 'sm' ? 24 : size === 'lg' ? 38 : 30;

  return (
    <div className="flex items-center gap-2.5 select-none group cursor-pointer">
      {/* 4-cell geometric grid icon mark */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105"
      >
        <rect x="2" y="2" width="16" height="16" rx="3" fill={darkTheme ? '#71717A' : '#141414'} />
        <rect x="22" y="2" width="16" height="16" rx="3" fill={darkTheme ? '#A1A1AA' : '#52525B'} />
        <path
          d="M2 22C2 22 2 34 2 38H18V22H2Z"
          fill={darkTheme ? '#52525B' : '#71717A'}
        />
        <path
          d="M22 22H38V35C38 36.6569 36.6569 38 35 38H22V22Z"
          fill="#F5622E"
        />
      </svg>
      <div className="flex flex-col leading-none">
        <span
          className={`font-['Oxygen'] font-bold tracking-tight uppercase ${
            size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl'
          } ${darkTheme ? 'text-white' : 'text-[#141414]'}`}
        >
          THE GRID
        </span>
        <span
          className={`font-sans uppercase tracking-[0.24em] text-[8.5px] font-semibold mt-0.5 ${
            darkTheme ? 'text-zinc-400' : 'text-zinc-600'
          }`}
        >
          POWERED BY CASTILLO
        </span>
      </div>
    </div>
  );
};
