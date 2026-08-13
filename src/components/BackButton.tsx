import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
  className?: string;
  id?: string;
}

export default function BackButton({ onClick, className = '', id = 'universal-back-btn' }: BackButtonProps) {
  return (
    <button
      type="button"
      id={id}
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white/4 border border-white/8 hover:bg-white/8 text-white/90 hover:text-white hover:border-sky-505 hover:border-sky-400/50 hover:shadow-lg hover:shadow-sky-500/5 active:scale-95 transition-all cursor-pointer mb-5 shrink-0 ${className}`}
    >
      <ArrowLeft className="w-4 h-4 text-sky-400 shrink-0" />
      <span>Back</span>
    </button>
  );
}
