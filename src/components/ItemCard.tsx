import React from 'react';
import {
  Bookmark,
  ExternalLink,
  BookOpen,
  Pin,
  Trash2,
  Archive,
  RotateCcw,
  MoreVertical,
  Share2,
  Lock,
  Tag as TagIcon,
  Clock,
  FileText,
  Image as ImageIcon,
  Check,
  Copy
} from 'lucide-react';
import { SavedItem } from '../types';

interface ItemCardProps {
  item: SavedItem;
  onOpenReader: (item: SavedItem) => void;
  onTogglePin: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onEdit: (item: SavedItem) => void;
  onDelete: (id: string) => void;
  onShare: (item: SavedItem) => void;
  isVaultLocked?: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onOpenReader,
  onTogglePin,
  onToggleArchive,
  onEdit,
  onDelete,
  onShare,
  isVaultLocked = false,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleCopyContent = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTagColorClass = (tag: string) => {
    const lower = tag.toLowerCase();
    if (lower.includes('read') || lower.includes('book')) return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    if (lower.includes('tech') || lower.includes('react') || lower.includes('code')) return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
    if (lower.includes('design') || lower.includes('art')) return 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30';
    if (lower.includes('productiv') || lower.includes('focus')) return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    if (lower.includes('privat') || lower.includes('vault') || lower.includes('sec')) return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
    return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
  };

  // If item is private and vault is currently locked, obscure details
  if (item.isPrivate && isVaultLocked) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-200 text-sm">Protected Item</h4>
            <p className="text-xs text-slate-500">Unlock Private Vault to view</p>
          </div>
        </div>
        <span className="text-xs font-mono text-slate-500 bg-slate-800/80 px-2 py-1 rounded-lg">
          PIN Required
        </span>
      </div>
    );
  }

  return (
    <div className="group relative bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700/80 rounded-2xl overflow-hidden transition-all duration-200 shadow-md hover:shadow-xl flex flex-col">
      {/* Top Banner / Image Thumbnail for links with image or direct image cards */}
      {item.type === 'image' && item.content && (
        <div className="relative w-full h-44 bg-slate-950 overflow-hidden">
          <img
            src={item.content}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          <span className="absolute bottom-2 left-3 text-[11px] font-medium text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded-md backdrop-blur-sm flex items-center gap-1">
            <ImageIcon className="w-3 h-3 text-fuchsia-400" />
            Image
          </span>
        </div>
      )}

      {item.type === 'link' && item.coverImage && (
        <div className="relative w-full h-36 bg-slate-950 overflow-hidden">
          <img
            src={item.coverImage}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/20" />
          {item.estimatedReadTimeMinutes && (
            <span className="absolute bottom-2 left-3 text-[11px] font-medium text-slate-300 bg-slate-950/80 px-2 py-0.5 rounded-md backdrop-blur-sm flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" />
              {item.estimatedReadTimeMinutes} min read
            </span>
          )}
        </div>
      )}

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Header row: domain/icon, pin, more menu */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 overflow-hidden">
              {item.type === 'link' && (
                <>
                  {item.favicon ? (
                    <img
                      src={item.favicon}
                      alt=""
                      className="w-4 h-4 rounded-sm flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <ExternalLink className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                  )}
                  <span className="text-xs text-slate-400 font-mono truncate">
                    {item.domain || 'web link'}
                  </span>
                </>
              )}

              {item.type === 'note' && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Personal Note</span>
                </div>
              )}

              {item.type === 'image' && !item.coverImage && (
                <div className="flex items-center gap-1.5 text-xs text-fuchsia-400 font-medium">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Image Bookmark</span>
                </div>
              )}

              {item.isPrivate && (
                <span className="flex items-center gap-0.5 text-[10px] text-rose-300 bg-rose-500/10 px-1.5 py-0.5 rounded-full border border-rose-500/20">
                  <Lock className="w-2.5 h-2.5" />
                  Vault
                </span>
              )}
            </div>

            {/* Quick Actions (Pin & Menu) */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => onTogglePin(item.id)}
                className={`p-1.5 rounded-lg transition-colors ${
                  item.isPinned
                    ? 'text-amber-400 bg-amber-400/10 hover:bg-amber-400/20'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                }`}
                title={item.isPinned ? 'Unpin' : 'Pin to favorites'}
              >
                <Pin className={`w-3.5 h-3.5 ${item.isPinned ? 'fill-current' : ''}`} />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>

                {showMenu && (
                  <div
                    className="absolute right-0 top-full mt-1 w-40 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl py-1.5 z-30 flex flex-col text-xs"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onEdit(item);
                      }}
                      className="px-3 py-1.5 text-left text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                    >
                      <span>Edit Item</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onShare(item);
                      }}
                      className="px-3 py-1.5 text-left text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Share Item</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onToggleArchive(item.id);
                      }}
                      className="px-3 py-1.5 text-left text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                    >
                      {item.isArchived ? (
                        <>
                          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Restore</span>
                        </>
                      ) : (
                        <>
                          <Archive className="w-3.5 h-3.5 text-amber-400" />
                          <span>Archive</span>
                        </>
                      )}
                    </button>
                    <div className="h-px bg-slate-800 my-1" />
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onDelete(item.id);
                      }}
                      className="px-3 py-1.5 text-left text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-slate-100 text-sm sm:text-base leading-snug line-clamp-2 mb-1.5">
            {item.title}
          </h3>

          {/* Excerpt / Content display */}
          {item.type === 'note' && (
            <div className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 whitespace-pre-line font-normal line-clamp-4 mb-2.5">
              {item.content}
            </div>
          )}

          {item.type === 'link' && item.description && (
            <p className="text-xs text-slate-400 line-clamp-2 mb-2.5">
              {item.description}
            </p>
          )}

          {item.type === 'image' && item.imageCaption && (
            <p className="text-xs text-slate-400 italic line-clamp-2 mb-2.5">
              "{item.imageCaption}"
            </p>
          )}

          {/* Tag Badges */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${getTagColorClass(
                    tag
                  )}`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Interactive Bar */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 mt-2">
          {/* Left action depending on type */}
          {item.type === 'link' ? (
            <button
              onClick={() => onOpenReader(item)}
              className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-medium py-1 px-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 transition-all text-xs"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Clean Reader</span>
            </button>
          ) : item.type === 'note' ? (
            <button
              onClick={() => onOpenReader(item)}
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium py-1 px-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 transition-all text-xs"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Listen / Focus</span>
            </button>
          ) : (
            <span className="text-[11px] text-slate-500">
              {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          )}

          {/* Right quick buttons: Copy / External link */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleCopyContent}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              title="Copy content / URL"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            {item.type === 'link' && (
              <a
                href={item.content}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                title="Open original website"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
