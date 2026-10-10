import React from 'react';
import { Inbox, Pin, Lock, Archive, Plus } from 'lucide-react';
import { ViewTab } from '../types';

interface BottomNavProps {
  currentTab: ViewTab;
  onChangeTab: (tab: ViewTab) => void;
  onOpenAddModal: () => void;
  inboxCount: number;
  favoritesCount: number;
  vaultCount: number;
  archiveCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onChangeTab,
  onOpenAddModal,
  inboxCount,
  favoritesCount,
  vaultCount,
  archiveCount,
}) => {
  return (
    <div className="sticky bottom-0 left-0 right-0 z-30 bg-slate-950/90 backdrop-blur-md border-t border-slate-800/80 px-2 py-2 flex items-center justify-around select-none">
      {/* Inbox */}
      <button
        onClick={() => onChangeTab('inbox')}
        className={`flex-1 py-1.5 flex flex-col items-center gap-1 rounded-xl transition-all relative ${
          currentTab === 'inbox' ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <div className="relative">
          <Inbox className="w-5 h-5" />
          {inboxCount > 0 && (
            <span className="absolute -top-1 -right-2 px-1 text-[9px] font-bold rounded-full bg-indigo-600 text-white min-w-[14px] text-center">
              {inboxCount}
            </span>
          )}
        </div>
        <span className="text-[10px]">Inbox</span>
      </button>

      {/* Favorites / Pinned */}
      <button
        onClick={() => onChangeTab('favorites')}
        className={`flex-1 py-1.5 flex flex-col items-center gap-1 rounded-xl transition-all relative ${
          currentTab === 'favorites' ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <div className="relative">
          <Pin className={`w-5 h-5 ${currentTab === 'favorites' ? 'fill-current' : ''}`} />
          {favoritesCount > 0 && (
            <span className="absolute -top-1 -right-2 px-1 text-[9px] font-bold rounded-full bg-amber-500 text-slate-950 min-w-[14px] text-center">
              {favoritesCount}
            </span>
          )}
        </div>
        <span className="text-[10px]">Pinned</span>
      </button>

      {/* Floating Add Button in Center */}
      <div className="px-1">
        <button
          onClick={onOpenAddModal}
          className="w-12 h-12 -mt-4 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 text-white flex items-center justify-center shadow-lg shadow-indigo-600/40 active:scale-95 transition-all"
          title="Save New Item"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* Private Vault */}
      <button
        onClick={() => onChangeTab('vault')}
        className={`flex-1 py-1.5 flex flex-col items-center gap-1 rounded-xl transition-all relative ${
          currentTab === 'vault' ? 'text-rose-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <div className="relative">
          <Lock className="w-5 h-5" />
          {vaultCount > 0 && (
            <span className="absolute -top-1 -right-2 px-1 text-[9px] font-bold rounded-full bg-rose-500 text-white min-w-[14px] text-center">
              {vaultCount}
            </span>
          )}
        </div>
        <span className="text-[10px]">Vault</span>
      </button>

      {/* Archive */}
      <button
        onClick={() => onChangeTab('archive')}
        className={`flex-1 py-1.5 flex flex-col items-center gap-1 rounded-xl transition-all relative ${
          currentTab === 'archive' ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <div className="relative">
          <Archive className="w-5 h-5" />
          {archiveCount > 0 && (
            <span className="absolute -top-1 -right-2 px-1 text-[9px] font-bold rounded-full bg-slate-700 text-slate-300 min-w-[14px] text-center">
              {archiveCount}
            </span>
          )}
        </div>
        <span className="text-[10px]">Archive</span>
      </button>
    </div>
  );
};
