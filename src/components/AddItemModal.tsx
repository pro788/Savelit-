import React, { useState } from 'react';
import {
  X,
  Link as LinkIcon,
  FileText,
  Image as ImageIcon,
  Plus,
  Sparkles,
  Pin,
  Lock,
  Upload,
  Globe
} from 'lucide-react';
import { SavedItem, ItemType } from '../types';
import { extractMetadataFromUrl } from '../utils/storage';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<SavedItem, 'id' | 'createdAt' | 'updatedAt' | 'isArchived'>) => void;
}

const COMMON_TAGS = ['Reading', 'Tech', 'Design', 'Productivity', 'Recipes', 'Personal', 'Ideas'];

export const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose, onSave }) => {
  const [activeType, setActiveType] = useState<ItemType>('link');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [articleBody, setArticleBody] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [tags, setTags] = useState<string[]>(['Reading']);
  const [customTagInput, setCustomTagInput] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  // Link preview helper
  const [isAutoFetching, setIsAutoFetching] = useState(false);
  const [previewCover, setPreviewCover] = useState('');

  if (!isOpen) return null;

  const handleUrlBlur = () => {
    if (activeType === 'link' && content && !title) {
      setIsAutoFetching(true);
      setTimeout(() => {
        const meta = extractMetadataFromUrl(content);
        if (meta.domain) {
          setTitle(`Article: ${meta.domain}`);
          if (meta.coverImage) setPreviewCover(meta.coverImage);
          setDescription('Auto-extracted link metadata from ' + meta.domain);
        }
        setIsAutoFetching(false);
      }, 300);
    }
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setContent(reader.result);
        if (!title) {
          setTitle(file.name.replace(/\.[^/.]+$/, ''));
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleToggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleAddCustomTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const clean = customTagInput.trim().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
      setCustomTagInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && activeType !== 'note') return;

    let finalTitle = title.trim();
    if (!finalTitle) {
      if (activeType === 'link') finalTitle = 'Saved Link';
      else if (activeType === 'note') finalTitle = 'Untitled Note';
      else finalTitle = 'Saved Image';
    }

    const meta = activeType === 'link' ? extractMetadataFromUrl(content) : {};

    onSave({
      type: activeType,
      title: finalTitle,
      content: content.trim(),
      description: description.trim() || undefined,
      tags,
      isPinned,
      isPrivate,
      domain: meta.domain,
      favicon: meta.favicon,
      coverImage: previewCover || meta.coverImage,
      estimatedReadTimeMinutes: meta.estimatedReadTimeMinutes || (activeType === 'note' ? 1 : 3),
      articleBody: articleBody.trim() || (activeType === 'note' ? content : undefined),
      imageCaption: imageCaption.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">Save Something New</h3>
              <p className="text-[11px] text-slate-400">Stage 1: Offline-ready storage</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Type Switcher */}
        <div className="p-3 bg-slate-950/40 border-b border-slate-800 flex gap-2">
          <button
            type="button"
            onClick={() => setActiveType('link')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeType === 'link'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Link</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveType('note')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeType === 'note'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Note</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveType('image')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeType === 'image'
                ? 'bg-fuchsia-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Image</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Main Content Input based on type */}
          {activeType === 'link' && (
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Link URL <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onBlur={handleUrlBlur}
                  placeholder="https://example.com/article"
                  className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs font-mono"
                />
                <Globe className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-3" />
              </div>
              {isAutoFetching && (
                <span className="text-[10px] text-indigo-400 mt-1 flex items-center gap-1 animate-pulse">
                  <Sparkles className="w-3 h-3" /> Auto-extracting website details...
                </span>
              )}
            </div>
          )}

          {activeType === 'note' && (
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Note Content <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your thoughts, checklist items, or ideas..."
                className="w-full p-3 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs font-normal"
              />
            </div>
          )}

          {activeType === 'image' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Image Source <span className="text-rose-400">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={content.startsWith('data:') ? '' : content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste image web address (https://...)"
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                  />
                  <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors border border-slate-700">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {content && (
                <div className="w-full h-32 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 relative">
                  <img src={content} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          )}

          {/* Title input */}
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">
              Title <span className="text-slate-500">(Optional)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                activeType === 'link'
                  ? 'e.g. Design Systems Handbook'
                  : activeType === 'note'
                  ? 'e.g. Grocery List'
                  : 'e.g. Living Room Inspiration'
              }
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
            />
          </div>

          {/* Description / Caption */}
          {activeType !== 'note' && (
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                {activeType === 'image' ? 'Image Caption' : 'Description / Notes'}
              </label>
              <input
                type="text"
                value={activeType === 'image' ? imageCaption : description}
                onChange={(e) =>
                  activeType === 'image'
                    ? setImageCaption(e.target.value)
                    : setDescription(e.target.value)
                }
                placeholder="Brief summary or personal reminder"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
              />
            </div>
          )}

          {/* Article Text for Link (Optional Reader support) */}
          {activeType === 'link' && (
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Full Article Text <span className="text-slate-500">(Optional for Clean Reader mode)</span>
              </label>
              <textarea
                rows={3}
                value={articleBody}
                onChange={(e) => setArticleBody(e.target.value)}
                placeholder="Paste article body here to enable distraction-free reading & text-to-speech..."
                className="w-full p-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs font-serif-reading"
              />
            </div>
          )}

          {/* Tags Section */}
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Tags</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {COMMON_TAGS.map((tag) => {
                const isSelected = tags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className={`text-[11px] px-2 py-0.5 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>

            {/* Custom Tag Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                onKeyDown={handleAddCustomTag}
                placeholder="Add new tag + Enter"
                className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
              />
              <button
                type="button"
                onClick={handleAddCustomTag}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl font-medium"
              >
                Add
              </button>
            </div>
          </div>

          {/* Privacy & Pin Toggles */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setIsPinned(!isPinned)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                isPinned
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-current' : ''}`} />
              <span>Pin to Top</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPrivate(!isPrivate)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                isPrivate
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Private Vault</span>
            </button>
          </div>

          {/* Footer Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all text-xs flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Save to Saveit</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
