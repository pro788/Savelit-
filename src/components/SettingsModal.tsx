import React, { useState } from 'react';
import {
  X,
  User,
  KeyRound,
  Download,
  Upload,
  RefreshCcw,
  Shield,
  Cloud,
  Check,
  Smartphone,
  Info
} from 'lucide-react';
import { SavedItem, UserProfile } from '../types';
import { exportDataAsJson, exportDataAsMarkdown } from '../utils/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: SavedItem[];
  user: UserProfile;
  onChangeUser: (user: UserProfile) => void;
  vaultPin: string;
  onUpdateVaultPin: (newPin: string) => void;
  onResetData: () => void;
  onImportData: (items: SavedItem[]) => void;
  syncEnabled: boolean;
  onToggleSync: (enabled: boolean) => void;
}

const DEMO_ACCOUNTS: UserProfile[] = [
  {
    id: 'usr_default_01',
    name: 'Alex Rivera',
    email: 'alex.rivera@saveit.app',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    plan: 'cloud_pro',
  },
  {
    id: 'usr_demo_02',
    name: 'Sarah Chen',
    email: 'sarah.chen@saveit.app',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    plan: 'free',
  },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  items,
  user,
  onChangeUser,
  vaultPin,
  onUpdateVaultPin,
  onResetData,
  onImportData,
  syncEnabled,
  onToggleSync,
}) => {
  const [newPin, setNewPin] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);
  const [importError, setImportError] = useState('');

  if (!isOpen) return null;

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length === 4 && /^\d+$/.test(newPin)) {
      onUpdateVaultPin(newPin);
      setPinSuccess(true);
      setNewPin('');
      setTimeout(() => setPinSuccess(false), 2000);
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError('');
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        if (Array.isArray(parsed)) {
          onImportData(parsed);
          alert(`Successfully imported ${parsed.length} items into Saveit!`);
        } else {
          setImportError('Invalid JSON format: array of items required.');
        }
      } catch (err) {
        setImportError('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-200">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">Account & Settings</h3>
              <p className="text-[11px] text-slate-400">Stage 2: Profile & Privacy Vault</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 text-xs text-slate-300">
          {/* Active Account Switcher */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-2">
              Current Logged-in Profile
            </label>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((acc) => {
                const isActive = acc.id === user.id;
                return (
                  <div
                    key={acc.id}
                    onClick={() => onChangeUser(acc)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-slate-800 border-indigo-500 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={acc.avatarUrl}
                        alt={acc.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <div className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
                          <span>{acc.name}</span>
                          {acc.plan === 'cloud_pro' && (
                            <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                              Cloud Pro
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">{acc.email}</div>
                      </div>
                    </div>
                    {isActive && <Check className="w-4 h-4 text-indigo-400" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cloud Sync Option */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Cloud className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="font-semibold text-slate-200 text-xs block">Cloud Database Sync</span>
                <span className="text-[11px] text-slate-400">Sync items to remote server</span>
              </div>
            </div>
            <button
              onClick={() => onToggleSync(!syncEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                syncEnabled ? 'bg-indigo-600' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  syncEnabled ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Change Vault PIN */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-rose-400" />
                Change 4-Digit Vault PIN
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Current: {vaultPin}</span>
            </div>

            <form onSubmit={handleSavePin} className="flex gap-2 pt-1">
              <input
                type="password"
                maxLength={4}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="New 4-digit PIN"
                className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-100 text-xs font-mono"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors"
              >
                Save PIN
              </button>
            </form>
            {pinSuccess && (
              <span className="text-[11px] text-emerald-400 font-medium block">
                ✓ Vault PIN updated successfully!
              </span>
            )}
          </div>

          {/* Export & Import Backup */}
          <div className="space-y-2">
            <span className="font-semibold text-slate-300 text-[11px] uppercase tracking-wider block">
              Data Management & Backup
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => exportDataAsJson(items)}
                className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-850 border border-slate-800 text-slate-200 font-medium transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>Export JSON</span>
              </button>
              <button
                onClick={() => exportDataAsMarkdown(items)}
                className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-850 border border-slate-800 text-slate-200 font-medium transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export Notes (MD)</span>
              </button>
            </div>

            <div className="pt-1">
              <label className="w-full p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-850 border border-slate-800 text-slate-300 font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span>Import JSON Backup</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </label>
              {importError && (
                <span className="text-rose-400 text-[10px] mt-1 block">{importError}</span>
              )}
            </div>
          </div>

          {/* Reset Starter Data */}
          <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
            <span className="text-[11px] text-slate-500">Restore fresh demo bookmarks</span>
            <button
              onClick={() => {
                if (confirm('Reset to original starter bookmarks and notes?')) {
                  onResetData();
                  onClose();
                }
              }}
              className="text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1"
            >
              <RefreshCcw className="w-3 h-3" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
