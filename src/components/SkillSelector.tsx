import React from 'react';
import { SkillLevel } from '../services/skillService';
import { Compass, BookOpen, Trophy } from 'lucide-react';

interface SkillSelectorProps {
  selectedSkill: SkillLevel;
  onSkillChange: (skill: SkillLevel) => void;
}

export default function SkillSelector({ selectedSkill, onSkillChange }: SkillSelectorProps) {
  const levels = [
    {
      id: 'Beginner' as SkillLevel,
      title: 'Beginner',
      description: 'Simple explanations, everyday analogies, and clear foundation concepts.',
      icon: Compass,
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      activeBg: 'bg-blue-650 bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-500/15',
    },
    {
      id: 'Intermediate' as SkillLevel,
      title: 'Intermediate',
      description: 'Detailed theory, key NCERT formulas, proofs, and standard derivations.',
      icon: BookOpen,
      bgColor: 'bg-orange-500/10',
      textColor: 'text-[#FF6B00]',
      borderColor: 'border-orange-200',
      activeBg: 'bg-[#FF6B00] bg-gradient-to-br from-[#FF6B00] to-[#FF8C42] text-white shadow-orange-500/15',
    },
    {
      id: 'Advanced' as SkillLevel,
      title: 'Advanced',
      description: 'CET/NEET style concepts, applications, and higher-order thinking problems.',
      icon: Trophy,
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-600',
      borderColor: 'border-emerald-200',
      activeBg: 'bg-emerald-600 bg-gradient-to-br from-emerald-500 to-teal-650 text-white shadow-emerald-500/15',
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col text-left">
        <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Select Learning Skill Level</label>
        <p className="text-xs text-slate-400 font-medium">The AI assistant adapts explanation style, vocabulary, experiments, and questions dynamically.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="skill-selector-container">
        {levels.map((level) => {
          const Icon = level.icon;
          const isActive = selectedSkill === level.id;
          return (
            <button
              key={level.id}
              onClick={() => onSkillChange(level.id)}
              className={`flex flex-col items-start text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer select-none relative overflow-hidden ${
                isActive 
                  ? `${level.activeBg} border-transparent shadow-lg scale-[1.02]` 
                  : 'bg-white border-slate-100 hover:border-slate-350 hover:shadow-md'
              }`}
              style={{ contentVisibility: 'auto' }}
            >
              <div className={`p-2.5 rounded-xl mb-3 ${isActive ? 'bg-white/20 text-white' : `${level.bgColor} ${level.textColor}`}`}>
                <Icon className="w-5 h-5" />
              </div>
              
              <h3 className="font-extrabold text-sm uppercase tracking-wider mb-1">
                {level.title}
              </h3>
              
              <p className={`text-xs leading-relaxed font-semibold ${isActive ? 'text-white/90' : 'text-slate-500'}`}>
                {level.description}
              </p>

              {isActive && (
                <div className="absolute right-2 top-2 bg-white/20 text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  Active
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
