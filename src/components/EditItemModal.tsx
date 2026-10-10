import React, { useState } from 'react';
import { X, Save, Pin, Lock, Trash2 } from 'lucide-react';
import { SavedItem } from '../types';

interface EditItemModalProps {
  item: SavedItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: SavedItem) => void;
  onDelete: (id: string) => void;
}

export const EditItemModal: React.FC<EditItemModalProps> = ({
  item,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  if (!isOpen || !item) return null;

  const [title, setTitle] = useState(item.title);
  const [content, setContent] = useState(item.content);
  const [description, setDescription] = useState(item.description || '');
  const [articleBody, setArticleBody] = useState(item.articleBody || '');
  const [tags, setTags] = useState<string[]>(item.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [isPinned, setIsPinned] = useState(item.isPinned);
  const [isPrivate, setIsPrivate] = useState(item.isPrivate);

  const handleAddTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const clean = tagInput.trim().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...item,
      title: title.trim(),
      content: content.trim(),
      description: description.trim() || undefined,
      articleBody: articleBody.trim() || undefined,
      tags,
      isPinned,
      isPrivate,
      updatedAt: Date.now(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <h3 className="font-bold text-slate-100 text-sm">Edit Saved Item</h3>
            <p className="text-[11px] text-slate-400 capitalize">{item.type} bookmark</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs flex-1">
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">
              {item.type === 'link' ? 'URL' : item.type === 'image' ? 'Image URL' : 'Content'}
            </label>
            {item.type === 'note' ? (
              <textarea
                rows={4}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 text-xs"
              />
            ) : (
              <input
                type="text"
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 text-xs font-mono"
              />
            )}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">
              Description / Notes
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 text-xs"
            />
          </div>

          {item.type === 'link' && (
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Article Text (For Clean Reader mode)
              </label>
              <textarea
                rows={3}
                value={articleBody}
                onChange={(e) => setArticleBody(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 text-xs font-serif-reading"
              />
            </div>
          )}

          {/* Tags */}
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Tags</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1 text-[11px]"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tag + Enter"
                className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 text-xs"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium"
              >
                Add
              </button>
            </div>
          </div>

          {/* Toggles */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
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
              <span>Pinned</span>
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

          {/* Action buttons */}
          <div className="pt-3 flex gap-2">
            <button
              type="button"
              onClick={() => {
                onDelete(item.id);
                onClose();
              }}
              className="px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
