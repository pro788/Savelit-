import React, { useState } from 'react';
import {
  X,
  Share2,
  Smartphone,
  ExternalLink,
  CheckCircle2,
  Code2,
  Sparkles,
  ArrowRight,
  Compass,
  Twitter,
  Youtube,
  Image as ImageIcon
} from 'lucide-react';
import { SavedItem } from '../types';

interface ShareSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  onReceiveShare: (shareData: {
    title: string;
    content: string;
    type: 'link' | 'note' | 'image';
    tags: string[];
    description?: string;
  }) => void;
}

const PRESET_MOCK_SHARES = [
  {
    sourceApp: 'Safari Browser',
    icon: Compass,
    iconColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    type: 'link' as const,
    title: 'The Future of Spatial Computing and Ambient Interfaces',
    content: 'https://designmanifesto.io/spatial-computing-2026',
    description: 'An architectural breakdown of gesture interaction and gaze detection in consumer hardware.',
    tags: ['Tech', 'Design', 'Reading'],
  },
  {
    sourceApp: 'X / Twitter Post',
    icon: Twitter,
    iconColor: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    type: 'note' as const,
    title: 'Insight on Software Craftsmanship by @kentcdodds',
    content: '"Write tests. Not too many. Mostly integration. The more your tests resemble the way your software is used, the more confidence they can give you."',
    description: 'Bookmarked quotation on reliable frontend testing practices.',
    tags: ['Quotes', 'Dev', 'Coding'],
  },
  {
    sourceApp: 'YouTube App',
    icon: Youtube,
    iconColor: 'text-red-400 bg-red-500/10 border-red-500/20',
    type: 'link' as const,
    title: 'How to Build an Ultra-Fast Offline-First App in 2026',
    content: 'https://youtube.com/watch?v=offline-first-architecture',
    description: 'Video tutorial covering local storage caching, sync queues, and service worker strategies.',
    tags: ['Video', 'Tutorial', 'React'],
  },
  {
    sourceApp: 'Apple Photos / Camera',
    icon: ImageIcon,
    iconColor: 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20',
    type: 'image' as const,
    title: 'Architectural Blueprint: Scandinavian Cabin',
    content: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1000&auto=format&fit=crop&q=80',
    description: 'Shared screenshot of timber frame structural inspiration.',
    tags: ['Photos', 'Architecture'],
  },
];

export const ShareSimulatorModal: React.FC<ShareSimulatorProps> = ({
  isOpen,
  onClose,
  onReceiveShare,
}) => {
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [customTitle, setCustomTitle] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [customType, setCustomType] = useState<'link' | 'note' | 'image'>('link');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [showCodeDetails, setShowCodeDetails] = useState(false);
  const [justShared, setJustShared] = useState(false);

  if (!isOpen) return null;

  const handleSimulateShare = () => {
    let payload;
    if (isCustomMode) {
      if (!customTitle || !customUrl) return;
      payload = {
        title: customTitle,
        content: customUrl,
        type: customType,
        tags: ['Shared', 'Inbox'],
        description: `Imported via mobile Share Sheet on ${new Date().toLocaleTimeString()}`,
      };
    } else {
      const preset = PRESET_MOCK_SHARES[selectedPreset];
      payload = {
        title: preset.title,
        content: preset.content,
        type: preset.type,
        tags: preset.tags,
        description: preset.description,
      };
    }

    setJustShared(true);
    setTimeout(() => {
      onReceiveShare(payload);
      setJustShared(false);
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-1.5">
                Stage 3: Phone Share Integration
              </h3>
              <p className="text-[11px] text-slate-400">Simulate incoming native OS Share Sheet</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {/* Explanation Box */}
          <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5 text-indigo-300 font-semibold text-xs">
              <Smartphone className="w-3.5 h-3.5" />
              <span>How Mobile "Share to Saveit" Works</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              On a real phone (iOS/Android), you don’t open Saveit first. Instead, inside Twitter, Safari, or Chrome, you tap the phone’s <strong>Share</strong> icon, choose <strong>Saveit</strong>, and the phone hands off the link, text, or photo directly into Saveit.
            </p>
          </div>

          {/* Mode switch */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="font-semibold text-slate-300">Choose what to simulate sharing:</span>
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setIsCustomMode(false)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  !isCustomMode ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                App Presets
              </button>
              <button
                onClick={() => setIsCustomMode(true)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  isCustomMode ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Custom Data
              </button>
            </div>
          </div>

          {/* Presets List */}
          {!isCustomMode ? (
            <div className="space-y-2">
              {PRESET_MOCK_SHARES.map((preset, index) => {
                const Icon = preset.icon;
                const isSelected = selectedPreset === index;
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedPreset(index)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-slate-800/90 border-indigo-500 shadow-md ring-1 ring-indigo-500/30'
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-850'
                    }`}
                  >
                    <div className={`p-2 rounded-xl border flex-shrink-0 ${preset.iconColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[11px] font-medium text-slate-400">{preset.sourceApp}</span>
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          {preset.type}
                        </span>
                      </div>
                      <h4 className="font-semibold text-slate-200 text-xs truncate">{preset.title}</h4>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{preset.content}</p>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-1" />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['link', 'note', 'image'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setCustomType(t)}
                      className={`py-1.5 rounded-xl capitalize font-medium border text-xs ${
                        customType === t
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Title</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. My Favorite Design System"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  {customType === 'link' ? 'URL' : customType === 'image' ? 'Image URL' : 'Note Content'}
                </label>
                <input
                  type="text"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder={
                    customType === 'link'
                      ? 'https://example.com/great-article'
                      : customType === 'image'
                      ? 'https://images.unsplash.com/...'
                      : 'Text to save for later'
                  }
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs font-mono"
                />
              </div>
            </div>
          )}

          {/* Under The Hood Code Details Toggle */}
          <div className="pt-1">
            <button
              onClick={() => setShowCodeDetails(!showCodeDetails)}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{showCodeDetails ? 'Hide technical implementation' : 'Show code under the hood (PWA manifest & Android Intent)'}</span>
            </button>

            {showCodeDetails && (
              <div className="mt-2 p-3 rounded-2xl bg-black/70 border border-slate-800 font-mono text-[10px] text-slate-300 space-y-2 overflow-x-auto">
                <p className="text-slate-400">// 1. Web App Manifest share_target configuration:</p>
                <pre className="text-indigo-300 whitespace-pre">
{`"share_target": {
  "action": "/share-target",
  "method": "GET",
  "params": {
    "title": "title",
    "text": "text",
    "url": "url"
  }
}`}
                </pre>
                <p className="text-slate-400">// 2. Receiving in React via URLSearchParams:</p>
                <pre className="text-emerald-300 whitespace-pre">
{`const params = new URLSearchParams(window.location.search);
const sharedUrl = params.get('url');
const sharedTitle = params.get('title');
if (sharedUrl) saveItem({ url: sharedUrl, title: sharedTitle });`}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Simulates tapping "Save to Saveit"
          </span>
          <button
            onClick={handleSimulateShare}
            disabled={justShared || (isCustomMode && (!customTitle || !customUrl))}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/30 transition-all text-xs"
          >
            {justShared ? (
              <>
                <CheckCircle2 className="w-4 h-4 animate-spin" />
                <span>Receiving into Saveit...</span>
              </>
            ) : (
              <>
                <span>Share to Saveit</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
