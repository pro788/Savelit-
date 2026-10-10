import React, { useState } from 'react';
import {
  X,
  BookOpen,
  CheckCircle2,
  HardDrive,
  Cloud,
  Share2,
  Lock,
  Code,
  Sparkles,
  Smartphone,
  Eye,
  Volume2
} from 'lucide-react';

interface StageGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StageGuideModal: React.FC<StageGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeStage, setActiveStage] = useState<1 | 2 | 3>(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm sm:text-base">
                How Saveit Is Built (Beginner Guide)
              </h3>
              <p className="text-[11px] text-slate-400">
                A simple, beginner-friendly roadmap of Stage 1, 2, and 3
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

        {/* Stage Selector Pills */}
        <div className="p-3 bg-slate-950/40 border-b border-slate-800 flex gap-2">
          <button
            onClick={() => setActiveStage(1)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeStage === 1
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>Stage 1: Core & Local</span>
          </button>

          <button
            onClick={() => setActiveStage(2)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeStage === 2
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Stage 2: Cloud & Privacy</span>
          </button>

          <button
            onClick={() => setActiveStage(3)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeStage === 3
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Stage 3: Share & Reader</span>
          </button>
        </div>

        {/* Educational Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-300 flex-1 leading-relaxed">
          {activeStage === 1 && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-800/40">
                <h4 className="font-bold text-indigo-300 text-sm mb-1">
                  Stage 1: The Offline-First Foundation
                </h4>
                <p className="text-[11px] text-slate-400">
                  Every great pocket app starts by making saving fast, dependable, and 100% functional offline without requiring an account or Wi-Fi connection.
                </p>
              </div>

              <div className="space-y-3">
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                  <div className="font-semibold text-slate-200 mb-1 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px]">1</span>
                    Three Item Types (Links, Notes, Images)
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Instead of just saving URLs, Saveit supports <strong>Links</strong> (with favicon, preview cover, and domain), <strong>Notes</strong> (checklists and thoughts), and <strong>Images</strong> (web URLs or uploaded photos stored locally as base64 data URLs).
                  </p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                  <div className="font-semibold text-slate-200 mb-1 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px]">2</span>
                    Local Storage Persistence
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    All your bookmarks are saved in the browser's <code className="text-emerald-400">localStorage</code>. When you refresh or close the tab, everything remains saved.
                  </p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                  <div className="font-semibold text-slate-200 mb-1 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px]">3</span>
                    CRUD: Edit, Delete, Pin & Archive
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    You can tag items (<code className="text-amber-400">#Reading</code>, <code className="text-cyan-400">#Tech</code>), pin favorite items to top, edit content, and archive finished items so your active Inbox stays clean.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeStage === 2 && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-800/40">
                <h4 className="font-bold text-cyan-300 text-sm mb-1">
                  Stage 2: Accounts, Cloud Database, Sync & Privacy
                </h4>
                <p className="text-[11px] text-slate-400">
                  Now we connect the local storage to the cloud so bookmarks stay synced across your phone, tablet, and laptop, while keeping private notes locked.
                </p>
              </div>

              <div className="space-y-3">
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                  <div className="font-semibold text-slate-200 mb-1 flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-cyan-400" />
                    Background Cloud Sync Engine
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    We use an <em>optimistic UI</em> pattern: your screen updates instantly (0ms delay), and an asynchronous queue sends the document to the cloud database (e.g. Firebase Firestore / Supabase). Check out the "Cloud DB" button at the top to inspect the JSON documents in real-time!
                  </p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                  <div className="font-semibold text-slate-200 mb-1 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-rose-400" />
                    Private Vault with 4-Digit Passcode
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Sensitive notes and bookmarks can be marked <strong>Private Vault</strong>. They are blurred and hidden until you enter your 4-digit PIN (default <code className="text-rose-300">1234</code>), keeping confidential data safe from shoulder-surfers.
                  </p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                  <div className="font-semibold text-slate-200 mb-1 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Data Portability (JSON & Markdown Export)
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    You own your data! In Settings, you can download a full JSON backup or an organized Markdown file of all your saved reading notes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeStage === 3 && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-fuchsia-950/40 border border-fuchsia-800/40">
                <h4 className="font-bold text-fuchsia-300 text-sm mb-1">
                  Stage 3: Phone Share Integration + Advanced Reader Mode
                </h4>
                <p className="text-[11px] text-slate-400">
                  Transforming Saveit into an authentic mobile app with deep OS integration and a distraction-free speed reader.
                </p>
              </div>

              <div className="space-y-3">
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                  <div className="font-semibold text-slate-200 mb-1 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-fuchsia-400" />
                    Mobile Phone Share Sheet Integration
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    In mobile operating systems (iOS and Android), users tap the native <strong>Share</strong> button inside Safari, Chrome, Twitter, or Reddit. With PWA <em>Web Share Target</em> or Android Intent Filters, the OS routes that URL directly into Saveit without manual copy-pasting. Click the <strong>Phone Share Sim</strong> button at top to test this live!
                  </p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                  <div className="font-semibold text-slate-200 mb-1 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-amber-400" />
                    Advanced Feature: Clean Reader Mode
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Tap "Clean Reader" on any link to strip away web ads, popups, and clutter. Features include:
                  </p>
                  <ul className="mt-1 space-y-1 text-[11px] text-slate-400 list-disc list-inside">
                    <li>4 Themes: Light Paper, Sepia Vintage, Dark OLED, and Slate Modern</li>
                    <li>Serif vs Sans typography and 4 font sizes</li>
                    <li>Estimated reading time & word count calculator</li>
                    <li><Sparkles className="w-3 h-3 inline text-amber-300" /> Instant AI/Smart TL;DR bullet summary</li>
                  </ul>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                  <div className="font-semibold text-slate-200 mb-1 flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-indigo-400" />
                    Audio Read-Aloud (Text-to-Speech)
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Too busy to read with your eyes? Tap the <strong>Listen</strong> button in Reader mode! Saveit uses the native Web Speech API (<code className="text-indigo-300">window.speechSynthesis</code>) to read the article aloud to you while you commute, with adjustable speed playback (1x, 1.25x, 1.5x).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Glossary for Beginners */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <h4 className="font-bold text-slate-200 text-xs mb-2 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-indigo-400" />
              Beginner Friendly Tech Stack Glossary
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="font-semibold text-indigo-300">React 19 & Hooks:</span> Handles dynamic UI state (search queries, active filters, open dialogs).
              </div>
              <div>
                <span className="font-semibold text-indigo-300">Tailwind CSS:</span> Provides responsive mobile layout, custom fonts, and dark mode palette.
              </div>
              <div>
                <span className="font-semibold text-indigo-300">Web Share API:</span> Standard browser API to trigger the mobile phone's native sharing sheet.
              </div>
              <div>
                <span className="font-semibold text-indigo-300">SpeechSynthesis:</span> Native browser audio voice engine that speaks text without external servers.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Saveit Reference Architecture
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all text-xs"
          >
            Got it, Let's Explore!
          </button>
        </div>
      </div>
    </div>
  );
};
