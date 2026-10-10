import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, BookOpen, Share2, Sparkles, Cloud, Wifi, Battery } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
  onOpenGuide: () => void;
  onOpenShareSim: () => void;
  onOpenSyncInspector: () => void;
  syncState: 'synced' | 'syncing' | 'offline' | 'pending';
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  onOpenGuide,
  onOpenShareSim,
  onOpenSyncInspector,
  syncState,
}) => {
  const [isPhoneMode, setIsPhoneMode] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-2 sm:p-4 md:p-6 selection:bg-indigo-500 selection:text-white">
      {/* Top Banner Navigation / Inspector Toolbar */}
      <header className="w-full max-w-4xl mb-4 flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800/80 px-4 py-2.5 rounded-2xl backdrop-blur-md shadow-lg shadow-black/40">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-400 flex items-center justify-center shadow-md shadow-indigo-500/25">
            <span className="font-extrabold text-white text-base tracking-tight">S</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-slate-100 text-sm sm:text-base leading-tight">Saveit</h1>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Stage 1 • 2 • 3
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Pocket-style offline-first bookmark & reader app</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Cloud Sync Quick Status */}
          <button
            onClick={onOpenSyncInspector}
            title="Inspect Cloud Database & Sync Queue"
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700/60 hover:border-indigo-500/50 transition-all"
          >
            <Cloud className={`w-3.5 h-3.5 ${syncState === 'syncing' ? 'animate-pulse text-amber-400' : 'text-emerald-400'}`} />
            <span className="hidden md:inline font-medium">Cloud DB</span>
          </button>

          {/* Test Incoming Share Sheet */}
          <button
            onClick={onOpenShareSim}
            title="Test Phone Share Target Simulation"
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 transition-all font-medium"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Phone Share Sim</span>
          </button>

          {/* Guide / How It Works */}
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium shadow-sm transition-all"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Guide</span>
          </button>

          {/* Device Mockup Toggle */}
          <div className="hidden lg:flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setIsPhoneMode(true)}
              className={`p-1.5 rounded-lg text-xs transition-all flex items-center gap-1 ${
                isPhoneMode
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Mobile Device Frame"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsPhoneMode(false)}
              className={`p-1.5 rounded-lg text-xs transition-all flex items-center gap-1 ${
                !isPhoneMode
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Expanded Full View"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 flex justify-center items-start ${
          isPhoneMode
            ? 'max-w-[430px]'
            : 'max-w-4xl'
        }`}
      >
        {isPhoneMode ? (
          // Smartphone Frame Outer Body
          <div className="w-full relative rounded-[48px] p-3.5 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border-4 border-slate-700/80 ring-1 ring-slate-600/40">
            {/* Speaker & Mic hardware accent */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-16 h-1 bg-slate-600/80 rounded-full z-30" />

            {/* Screen Inner Viewport */}
            <div className="relative w-full h-[844px] bg-slate-950 rounded-[38px] overflow-hidden flex flex-col border border-slate-800/80 shadow-inner">
              {/* Dynamic Island / Status Bar */}
              <div className="w-full pt-3 px-6 pb-1 bg-slate-950/95 backdrop-blur-md flex items-center justify-between text-[11px] text-slate-300 select-none z-20">
                <span className="font-semibold tracking-tight">{currentTime}</span>
                {/* Dynamic pill cutout */}
                <div className="w-24 h-5 bg-black rounded-full flex items-center justify-center gap-1.5 px-2 shadow-sm border border-slate-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] text-slate-400 font-mono">Saveit</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Wifi className="w-3 h-3" />
                  <Battery className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>

              {/* Mobile Screen App Body */}
              <div className="flex-1 overflow-y-auto relative flex flex-col bg-slate-950">
                {children}
              </div>

              {/* Home indicator bar at bottom */}
              <div className="w-full py-1.5 bg-slate-950 flex justify-center items-center pointer-events-none z-20">
                <div className="w-32 h-1 bg-slate-600/70 rounded-full" />
              </div>
            </div>
          </div>
        ) : (
          // Expanded Responsive Layout
          <div className="w-full bg-slate-950 rounded-3xl border border-slate-800/90 shadow-2xl overflow-hidden min-h-[820px] flex flex-col">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
