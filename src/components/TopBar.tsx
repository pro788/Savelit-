import React from 'react';
import {
  Search,
  X,
  SlidersHorizontal,
  Cloud,
  Settings,
  Filter,
  CheckCircle2,
  RefreshCw,
  WifiOff
} from 'lucide-react';
import { ItemType, UserProfile, ViewTab } from '../types';

interface TopBarProps {
  currentTab: ViewTab;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedType: 'all' | ItemType;
  onSelectType: (type: 'all' | ItemType) => void;
  availableTags: string[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  user: UserProfile;
  onOpenSettings: () => void;
  syncState: 'synced' | 'syncing' | 'offline' | 'pending';
  onOpenSyncInspector: () => void;
  totalFilteredCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  searchQuery,
  onSearchChange,
  selectedType,
  onSelectType,
  availableTags,
  selectedTag,
  onSelectTag,
  user,
  onOpenSettings,
  syncState,
  onOpenSyncInspector,
  totalFilteredCount,
}) => {
  const getTabHeading = () => {
    switch (currentTab) {
      case 'inbox':
        return 'Saved Inbox';
      case 'favorites':
        return 'Pinned Favorites';
      case 'vault':
        return 'Private Vault';
      case 'archive':
        return 'Archived Collection';
    }
  };

  return (
    <div className="p-3 sm:p-4 bg-slate-950/90 border-b border-slate-800/80 sticky top-0 z-20 space-y-3 backdrop-blur-md">
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-100 tracking-tight leading-none">
              {getTabHeading()}
            </h2>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full">
              {totalFilteredCount}
            </span>
          </div>
          <span className="text-[10px] text-slate-400">Offline-first local library</span>
        </div>

        {/* Right side controls: Sync badge & Profile button */}
        <div className="flex items-center gap-2">
          {/* Cloud Sync Status Icon */}
          <button
            onClick={onOpenSyncInspector}
            className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors"
            title="Cloud Sync Status"
          >
            {syncState === 'syncing' ? (
              <RefreshCw className="w-3 h-3 text-amber-400 animate-spin" />
            ) : syncState === 'offline' ? (
              <WifiOff className="w-3 h-3 text-rose-400" />
            ) : (
              <Cloud className="w-3 h-3 text-emerald-400" />
            )}
            <span className="hidden sm:inline capitalize text-[10px] font-medium text-slate-400">
              {syncState}
            </span>
          </button>

          {/* User Avatar / Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="relative p-0.5 rounded-full ring-2 ring-slate-800 hover:ring-indigo-500 transition-all"
            title="Account Settings"
          >
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover"
            />
          </button>
        </div>
      </div>

      {/* Live Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title, tags, or content..."
          className="w-full pl-9 pr-8 py-2 bg-slate-900/90 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-all shadow-inner"
        />
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="p-1 text-slate-400 hover:text-slate-200 absolute right-2.5 top-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Content Type Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-xs">
        {(['all', 'link', 'note', 'image'] as const).map((type) => (
          <button
            key={type}
            onClick={() => onSelectType(type)}
            className={`px-2.5 py-1 rounded-xl capitalize font-medium transition-all text-[11px] whitespace-nowrap ${
              selectedType === type
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            {type === 'all' ? 'All Types' : `${type}s`}
          </button>
        ))}

        <div className="w-px h-4 bg-slate-800 mx-1 flex-shrink-0" />

        {/* Tag Filters */}
        {selectedTag && (
          <button
            onClick={() => onSelectTag(null)}
            className="px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] flex items-center gap-1 flex-shrink-0"
          >
            <span>Clear #{selectedTag}</span>
            <X className="w-2.5 h-2.5" />
          </button>
        )}

        {availableTags.map((tag) => (
          <button
            key={tag}
            onClick={() => onSelectTag(selectedTag === tag ? null : tag)}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-medium border flex-shrink-0 transition-all ${
              selectedTag === tag
                ? 'bg-indigo-500/30 text-indigo-200 border-indigo-400'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>
    </div>
  );
};
