import React, { useState } from 'react';
import { User, Sun, Moon, Languages, Volume2, Bell, RotateCcw, ShieldAlert, Check } from 'lucide-react';

interface SettingsProps {
  username: string;
  studentId: string;
  onUpdateProfile: (name: string, roll: string) => void;
  onResetProgress: () => void;
}

export default function Settings({ username, studentId, onUpdateProfile, onResetProgress }: SettingsProps) {
  const [profileName, setProfileName] = useState<string>(username.split("@")[0] || 'Student');
  const [rollId, setRollId] = useState<string>(studentId);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('tim_theme') === 'dark';
  });
  const [selectedLang, setSelectedLang] = useState<string>('en-IN');
  const [voiceRate, setVoiceRate] = useState<number>(1);
  const [notifsEnabled, setNotifsEnabled] = useState<boolean>(true);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 2500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(profileName, rollId);
    triggerToast("Profile credentials updated successfully!");
  };

  const handleToggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    localStorage.setItem('tim_theme', nextMode ? 'dark' : 'light');
    
    // Inject theme wrapper class into DOM body
    const bodyEl = document.querySelector('body');
    if (bodyEl) {
      if (nextMode) {
        bodyEl.classList.add('dark-mode-active');
        bodyEl.style.backgroundColor = '#070b19';
        bodyEl.style.color = '#e2e8f0';
      } else {
        bodyEl.classList.remove('dark-mode-active');
        bodyEl.style.backgroundColor = '#F8F9FA';
        bodyEl.style.color = '#0F172A';
      }
    }
    triggerToast(`Theme switched to ${nextMode ? 'Dark Mode' : 'Light Mode'}!`);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all your learning streak, completion statuses, and quiz records? This cannot be undone.")) {
      onResetProgress();
      triggerToast("All performance databases have been reset to defaults!");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 font-sans" id="settings-module">
      {/* Banner */}
      <div className="glass-panel p-6 bg-white border border-slate-200 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div className="space-y-2">
          <span className="text-[10px] font-black text-[#FF6B00] uppercase tracking-widest block">
            TIM System Preferences • Account Control
          </span>
          <h1 className="text-2xl md:text-3.5xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Settings Dashboard
          </h1>
          <p className="text-xs text-slate-500 font-semibold">
            Customize system voice assistance levels, toggle Dark/Light layouts, and manage student roll credentials.
          </p>
        </div>
      </div>

      {successToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs text-emerald-700 font-bold flex items-center gap-2 animate-fade-in shadow-sm select-none">
          <Check className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
          {successToast}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Profile Card */}
        <form onSubmit={handleSaveProfile} className="glass-panel p-5 bg-white border border-slate-200 rounded-2xl space-y-4">
          <h3 className="text-sm font-black uppercase tracking-wide border-b pb-2 flex items-center gap-2 text-slate-800">
            <User className="w-4.5 h-4.5 text-[#FF6B00]" /> Student Profile Settings
          </h3>
          
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase text-slate-400">Student Registered Name:</label>
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-205 focus:border-[#FF6B00] focus:bg-white rounded-xl px-3.5 py-2 text-xs font-bold text-slate-850 focus:outline-none"
              placeholder="e.g. Santhosh"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase text-slate-400">Roll Number / Academic ID:</label>
            <input
              type="text"
              value={rollId}
              onChange={(e) => setRollId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-205 focus:border-[#FF6B00] focus:bg-white rounded-xl px-3.5 py-2 text-xs font-bold text-slate-855 focus:outline-none"
              placeholder="RACE-PUC-11-XXXX"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl cursor-pointer uppercase tracking-wider shadow select-none"
          >
            Save Profile Credentials
          </button>
        </form>

        {/* System parameters Card */}
        <div className="glass-panel p-5 bg-white border border-slate-200 rounded-2xl space-y-5">
          <h3 className="text-sm font-black uppercase tracking-wide border-b pb-2 flex items-center gap-2 text-slate-800">
            System Preferences
          </h3>

          {/* Theme */}
          <div className="flex justify-between items-center text-xs font-semibold">
            <div className="space-y-0.5">
              <span className="text-slate-800 font-extrabold block">Theme Layout Mode</span>
              <span className="text-[10px] text-slate-400 font-bold block">Switch between light and dark classroom aesthetics.</span>
            </div>
            <button
              onClick={handleToggleTheme}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer flex items-center gap-1.5 font-bold text-xs select-none border border-slate-250"
            >
              {isDarkMode ? <Moon className="w-4 h-4 text-orange-400" /> : <Sun className="w-4 h-4 text-orange-500 fill-orange-500" />}
              <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
          </div>

          {/* Language selection */}
          <div className="flex justify-between items-center text-xs font-semibold">
            <div className="space-y-0.5">
              <span className="text-slate-800 font-extrabold block">Voice Assistant Language</span>
              <span className="text-[10px] text-slate-400 font-bold block">Select translation language for RAG tutoring.</span>
            </div>
            <select
              value={selectedLang}
              onChange={(e) => {
                setSelectedLang(e.target.value);
                triggerToast("AI Assistant translation parameters updated!");
              }}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none"
            >
              <option value="en-IN">English (India)</option>
              <option value="kn-IN">Kannada (ಕನ್ನಡ)</option>
              <option value="hi-IN">Hindi (हिन्दी)</option>
              <option value="ta-IN">Tamil (தமிழ்)</option>
              <option value="te-IN">Telugu (తెలుగు)</option>
              <option value="ml-IN">Malayalam (മലയാളം)</option>
            </select>
          </div>

          {/* TTS voice rate */}
          <div className="space-y-2 text-xs font-semibold">
            <div className="flex justify-between">
              <div>
                <span className="text-slate-800 font-extrabold block">Voice Narration Speed</span>
                <span className="text-[10px] text-slate-400 font-bold block">Adjust speed rate of synthesized text lectures.</span>
              </div>
              <span className="font-mono text-orange-600 font-black">{voiceRate}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={voiceRate}
              onChange={(e) => setVoiceRate(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          </div>

          {/* Reset progress */}
          <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs font-semibold">
            <div className="space-y-0.5">
              <span className="text-rose-600 font-extrabold block">Reset Academic Progress</span>
              <span className="text-[10px] text-slate-400 font-bold block">Reset completed chapters lists and test histories.</span>
            </div>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 hover:text-rose-800 font-black rounded-xl cursor-pointer select-none uppercase tracking-wider text-[10.5px]"
            >
              Reset Database
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
