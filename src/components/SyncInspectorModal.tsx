import React, { useState } from 'react';
import {
  X,
  Cloud,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Database,
  ArrowRight,
  Wifi,
  WifiOff,
  ShieldCheck,
  Server,
  Layers
} from 'lucide-react';
import { SavedItem, UserProfile } from '../types';

interface SyncInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  items: SavedItem[];
  user: UserProfile;
  syncState: 'synced' | 'syncing' | 'offline' | 'pending';
  lastSyncedAt: number;
  onTriggerSync: () => void;
  isSimulatedOffline: boolean;
  onToggleOffline: () => void;
}

export const SyncInspectorModal: React.FC<SyncInspectorProps> = ({
  isOpen,
  onClose,
  items,
  user,
  syncState,
  lastSyncedAt,
  onTriggerSync,
  isSimulatedOffline,
  onToggleOffline,
}) => {
  const [activeTab, setActiveTab] = useState<'status' | 'cloudJson' | 'architecture'>('status');

  if (!isOpen) return null;

  const activeCount = items.filter((i) => !i.isArchived).length;
  const archivedCount = items.filter((i) => i.isArchived).length;
  const privateCount = items.filter((i) => i.isPrivate).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-1.5">
                Stage 2: Cloud Sync & DB Inspector
              </h3>
              <p className="text-[11px] text-slate-400">
                Connected User: {user.email}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-4 pt-2 gap-4 text-xs">
          <button
            onClick={() => setActiveTab('status')}
            className={`pb-2.5 font-medium border-b-2 transition-all ${
              activeTab === 'status'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Sync Status & Network
          </button>
          <button
            onClick={() => setActiveTab('cloudJson')}
            className={`pb-2.5 font-medium border-b-2 transition-all ${
              activeTab === 'cloudJson'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Cloud Document (JSON)
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`pb-2.5 font-medium border-b-2 transition-all ${
              activeTab === 'architecture'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            How Sync Works Simply
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {activeTab === 'status' && (
            <div className="space-y-4">
              {/* Sync Status Banner */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                      isSimulatedOffline
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : syncState === 'syncing'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-spin'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    {isSimulatedOffline ? (
                      <WifiOff className="w-5 h-5" />
                    ) : syncState === 'syncing' ? (
                      <RefreshCw className="w-5 h-5" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200 text-sm">
                      {isSimulatedOffline
                        ? 'Offline Mode (Local Storage Only)'
                        : syncState === 'syncing'
                        ? 'Syncing with Cloud DB...'
                        : 'Fully Synced with Cloud Database'}
                    </h4>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Last synchronized: {new Date(lastSyncedAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={onTriggerSync}
                  disabled={isSimulatedOffline || syncState === 'syncing'}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl font-medium transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncState === 'syncing' ? 'animate-spin' : ''}`} />
                  <span>Sync Now</span>
                </button>
              </div>

              {/* Network Toggle Simulator */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-200 text-xs block">Simulate Offline Mode</span>
                  <span className="text-[11px] text-slate-400">
                    Test how Saveit works when there is no internet connection
                  </span>
                </div>
                <button
                  onClick={onToggleOffline}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-colors border text-xs flex items-center gap-1.5 ${
                    isSimulatedOffline
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  {isSimulatedOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
                  <span>{isSimulatedOffline ? 'Offline' : 'Online'}</span>
                </button>
              </div>

              {/* Data Metrics Grid */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                    Inbox Items
                  </span>
                  <span className="text-lg font-bold text-slate-100">{activeCount}</span>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                    Private Vault
                  </span>
                  <span className="text-lg font-bold text-rose-400">{privateCount}</span>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                    Archived
                  </span>
                  <span className="text-lg font-bold text-slate-400">{archivedCount}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cloudJson' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Simulated Cloud Collection: <code className="text-indigo-300">/users/{user.id}/items</code></span>
                <span>{items.length} records</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto max-h-72">
                <pre>{JSON.stringify(items.slice(0, 3), null, 2)}</pre>
                {items.length > 3 && (
                  <p className="text-slate-500 mt-2 font-sans italic text-center">
                    ... + {items.length - 3} more items synced to cloud
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-3 leading-relaxed text-slate-300">
              <div className="p-3 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 space-y-1.5">
                <h4 className="font-semibold text-indigo-300 text-xs flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  What is "Offline-First Sync"?
                </h4>
                <p className="text-[11px] text-slate-300">
                  Instead of waiting for a slow network request before showing your saved item, Saveit writes immediately to your phone's fast local storage (<code className="text-indigo-200">localStorage</code> / IndexedDB). Then, in the background, a lightweight sync engine pushes the update to the cloud database.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <h4 className="font-semibold text-emerald-300 text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Privacy & Encryption
                </h4>
                <p className="text-[11px] text-slate-400">
                  When an item is marked as <strong>Private Vault</strong>, its contents are locked behind your local 4-digit PIN. In production apps, the PIN derives a local AES-GCM encryption key before uploading to the cloud.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            Protocol: WebSocket / HTTPS REST
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium transition-all text-xs"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
