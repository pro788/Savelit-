import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Type,
  Sun,
  Moon,
  BookmarkCheck,
  Share2,
  Clock,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { SavedItem, ReaderSettings } from '../types';

interface ReaderModalProps {
  item: SavedItem | null;
  onClose: () => void;
  onShare: (item: SavedItem) => void;
}

export const ReaderModal: React.FC<ReaderModalProps> = ({ item, onClose, onShare }) => {
  if (!item) return null;

  // Reader Appearance state
  const [theme, setTheme] = useState<'slate' | 'sepia' | 'dark' | 'light'>('slate');
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans'>('serif');
  const [showAppearanceMenu, setShowAppearanceMenu] = useState<boolean>(false);

  // Audio Speech state
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Smart TL;DR summary state
  const [showSummary, setShowSummary] = useState<boolean>(false);
  const [summaryList, setSummaryList] = useState<string[]>([]);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState<boolean>(false);

  const fullText = item.articleBody || item.content || item.description || '';
  const wordCount = fullText.split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 180));

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    } else {
      setSpeechSupported(false);
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const handleToggleSpeak = () => {
    if (!synthRef.current) return;

    if (isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      return;
    }

    synthRef.current.cancel();
    const textToRead = `${item.title}. ${fullText}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsSpeaking(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
    setIsSpeaking(true);
  };

  const handleRateChange = (newRate: number) => {
    setSpeechRate(newRate);
    if (isSpeaking && synthRef.current) {
      synthRef.current.cancel();
      const textToRead = `${item.title}. ${fullText}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = newRate;
      utterance.onend = () => setIsSpeaking(false);
      utteranceRef.current = utterance;
      synthRef.current.speak(utterance);
    }
  };

  const handleGenerateSummary = () => {
    if (summaryList.length > 0) {
      setShowSummary(!showSummary);
      return;
    }

    setIsGeneratingSummary(true);
    setTimeout(() => {
      // Generate clean extraction bullets from article body
      const sentences = fullText
        .split(/(?<=[.?!])\s+/)
        .filter((s) => s.trim().length > 25);

      const bullets = [
        sentences[0] || 'Core premise outlines key principles for cognitive mastery and output.',
        sentences[Math.floor(sentences.length / 2)] || 'Actionable routines minimize daily context-switching overhead.',
        sentences[sentences.length - 1] || 'Sustainable habits compound into profound long-term results.',
      ].map((b) => b.trim());

      setSummaryList(bullets);
      setIsGeneratingSummary(false);
      setShowSummary(true);
    }, 400);
  };

  // Theme Styling classes
  const themeClasses = {
    slate: 'bg-slate-950 text-slate-100 border-slate-800',
    sepia: 'bg-[#f4ecd8] text-[#433422] border-[#e2d6b5]',
    dark: 'bg-[#0f0f11] text-[#e0e0e0] border-[#222]',
    light: 'bg-white text-slate-800 border-slate-200',
  }[theme];

  const contentThemeClasses = {
    slate: 'text-slate-200',
    sepia: 'text-[#433422]',
    dark: 'text-neutral-300',
    light: 'text-slate-700',
  }[theme];

  const headerThemeClasses = {
    slate: 'bg-slate-900/90 text-slate-200 border-slate-800',
    sepia: 'bg-[#ede3cb]/90 text-[#433422] border-[#ded1af]',
    dark: 'bg-[#18181b]/90 text-neutral-200 border-neutral-800',
    light: 'bg-slate-100/90 text-slate-800 border-slate-200',
  }[theme];

  const fontSizeClasses = {
    sm: 'text-sm leading-relaxed',
    base: 'text-base leading-relaxed',
    lg: 'text-lg leading-loose',
    xl: 'text-xl leading-loose',
  }[fontSize];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full h-full sm:h-[90vh] sm:max-w-2xl sm:rounded-3xl border flex flex-col overflow-hidden shadow-2xl transition-colors duration-200 ${themeClasses}`}
      >
        {/* Top Control Bar */}
        <div
          className={`px-4 py-3 border-b flex items-center justify-between backdrop-blur-md sticky top-0 z-20 ${headerThemeClasses}`}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (synthRef.current) synthRef.current.cancel();
                onClose();
              }}
              className="p-1.5 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              title="Close Reader"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1.5 text-xs font-medium opacity-80">
              <Clock className="w-3.5 h-3.5" />
              <span>{readTime} min read</span>
              <span>•</span>
              <span>{wordCount} words</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Audio Read Aloud */}
            {speechSupported && (
              <button
                onClick={handleToggleSpeak}
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-xl font-medium transition-all ${
                  isSpeaking
                    ? 'bg-indigo-600 text-white animate-pulse shadow-sm'
                    : 'bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20'
                }`}
                title={isSpeaking ? 'Stop reading' : 'Listen to article (Text to Speech)'}
              >
                {isSpeaking ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isSpeaking ? 'Pause' : 'Listen'}</span>
              </button>
            )}

            {/* TL;DR Summary Button */}
            <button
              onClick={handleGenerateSummary}
              disabled={isGeneratingSummary}
              className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-xl font-medium transition-all ${
                showSummary
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20'
              }`}
              title="Quick TL;DR summary"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">TL;DR</span>
            </button>

            {/* Appearance Menu Toggle */}
            <button
              onClick={() => setShowAppearanceMenu(!showAppearanceMenu)}
              className="p-1.5 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors text-xs font-serif font-bold"
              title="Typography & Theme"
            >
              <Type className="w-4 h-4" />
            </button>

            {/* Share */}
            <button
              onClick={() => onShare(item)}
              className="p-1.5 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
              title="Share Article"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dropdown for Appearance / Settings */}
        {showAppearanceMenu && (
          <div
            className={`p-3 border-b text-xs flex flex-wrap items-center justify-between gap-3 ${headerThemeClasses}`}
          >
            {/* Themes */}
            <div className="flex items-center gap-1.5">
              <span className="opacity-70 text-[11px] font-medium mr-1">Theme:</span>
              <button
                onClick={() => setTheme('slate')}
                className={`px-2 py-1 rounded-lg border text-[11px] font-medium ${
                  theme === 'slate' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-900 text-slate-300 border-slate-700'
                }`}
              >
                Slate
              </button>
              <button
                onClick={() => setTheme('sepia')}
                className={`px-2 py-1 rounded-lg border text-[11px] font-medium ${
                  theme === 'sepia' ? 'bg-[#c7b28f] text-black border-[#b29e7c]' : 'bg-[#e2d6b5] text-[#433422] border-[#cfc19f]'
                }`}
              >
                Sepia
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-2 py-1 rounded-lg border text-[11px] font-medium ${
                  theme === 'dark' ? 'bg-white text-black border-white' : 'bg-neutral-900 text-neutral-300 border-neutral-700'
                }`}
              >
                Dark
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`px-2 py-1 rounded-lg border text-[11px] font-medium ${
                  theme === 'light' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white text-slate-800 border-slate-300'
                }`}
              >
                Light
              </button>
            </div>

            {/* Font family & size */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setFontFamily('serif')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-serif border ${
                    fontFamily === 'serif' ? 'bg-indigo-600 text-white border-indigo-500' : 'border-current/20'
                  }`}
                >
                  Serif
                </button>
                <button
                  onClick={() => setFontFamily('sans')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-sans border ${
                    fontFamily === 'sans' ? 'bg-indigo-600 text-white border-indigo-500' : 'border-current/20'
                  }`}
                >
                  Sans
                </button>
              </div>

              {/* Font Size controls */}
              <div className="flex items-center gap-1">
                {(['sm', 'base', 'lg', 'xl'] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setFontSize(sz)}
                    className={`w-6 h-6 rounded-md text-[11px] font-bold border flex items-center justify-center ${
                      fontSize === sz ? 'bg-indigo-600 text-white border-indigo-500' : 'border-current/20'
                    }`}
                  >
                    {sz === 'sm' ? 'S' : sz === 'base' ? 'M' : sz === 'lg' ? 'L' : 'XL'}
                  </button>
                ))}
              </div>
            </div>

            {/* Speech rate if speaking */}
            {speechSupported && (
              <div className="flex items-center gap-1.5">
                <span className="opacity-70 text-[11px]">Audio Speed:</span>
                {[1, 1.25, 1.5].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => handleRateChange(rate)}
                    className={`px-1.5 py-0.5 rounded text-[11px] font-mono border ${
                      speechRate === rate ? 'bg-indigo-600 text-white border-indigo-500' : 'border-current/20'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Audio Player Active Floating Banner */}
        {isSpeaking && (
          <div className="bg-indigo-600 text-white px-4 py-2 flex items-center justify-between text-xs shadow-md">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 animate-bounce" />
              <span className="font-medium">Playing Audio Read-Aloud ({speechRate}x speed)</span>
            </div>
            <button
              onClick={handleToggleSpeak}
              className="px-2 py-0.5 rounded bg-indigo-700 hover:bg-indigo-800 text-[11px] font-semibold"
            >
              Stop Audio
            </button>
          </div>
        )}

        {/* Reader Article Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-10 select-text">
          <div className="max-w-xl mx-auto space-y-6">
            {/* Header info */}
            <div>
              {item.domain && (
                <div className="text-xs uppercase tracking-wider font-semibold opacity-60 mb-2">
                  {item.domain}
                </div>
              )}
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight mb-3">
                {item.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-xs opacity-70 pb-4 border-b border-current/10">
                <span>Saved on {new Date(item.createdAt).toLocaleDateString()}</span>
                {item.tags.map((t) => (
                  <span key={t} className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[10px]">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Smart TL;DR Card if opened */}
            {showSummary && summaryList.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
                <div className="flex items-center justify-between gap-2 mb-2 text-amber-300">
                  <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Instant TL;DR Summary</span>
                  </div>
                  <button
                    onClick={() => setShowSummary(false)}
                    className="text-xs hover:underline text-amber-300/80"
                  >
                    Hide
                  </button>
                </div>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-200 list-disc list-inside">
                  {summaryList.map((pt, i) => (
                    <li key={i} className="leading-snug">
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Cover image if available */}
            {item.coverImage && (
              <div className="rounded-2xl overflow-hidden border border-current/10 shadow-lg">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-full max-h-80 object-cover"
                />
              </div>
            )}

            {/* Main Article Paragraphs */}
            <div
              className={`${fontSizeClasses} ${
                fontFamily === 'serif' ? 'font-serif-reading' : 'font-sans'
              } ${contentThemeClasses} space-y-4`}
            >
              {fullText ? (
                fullText.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="italic opacity-60">No article text extracted yet for this bookmark.</p>
              )}
            </div>

            {/* External link footnote */}
            {item.type === 'link' && (
              <div className="pt-8 border-t border-current/10 flex items-center justify-between text-xs opacity-75">
                <span>Original Link:</span>
                <a
                  href={item.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-indigo-400 hover:underline font-mono"
                >
                  <span>{item.domain}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
