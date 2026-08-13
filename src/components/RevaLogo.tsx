import React from 'react';

interface RevaLogoProps {
  className?: string;
  size?: number;
  variant?: 'full' | 'compact' | 'horizontal';
}

export default function RevaLogo({ className = '', size = 50, variant = 'full' }: RevaLogoProps) {
  return (
    <div 
      style={{ width: size, height: size }} 
      className={`relative flex items-center justify-center shrink-0 rounded-full overflow-hidden ${className}`}
      id="tim-logo"
    >
      <img
        src="/tim_logo.jpg"
        alt="TIM Logo"
        className="w-full h-full object-contain rounded-full"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

