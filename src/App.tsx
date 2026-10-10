import React, { useState, useEffect, useMemo, useTransition } from 'react';
import {
  loadSavedItems,
  saveSavedItems,
  loadUserProfile,
  saveUserProfile,
  loadVaultPin,
  saveVaultPin,
  triggerSystemShare
} from './utils/storage';
import { INITIAL_ITEMS } from './data/initialData';
import { SavedItem, UserProfile, ViewTab, ItemType } from './types';
import { PhoneFrame } from './components/PhoneFrame';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { ItemCard } from './components/ItemCard';
import { AddItemModal } from './components/AddItemModal';
import { EditItemModal } from './components/EditItemModal';
import { ReaderModal } from './components/ReaderModal';
import { ShareSimulatorModal } from './components/ShareSimulatorModal';
import { SyncInspectorModal } from './components/SyncInspectorModal';
import { VaultLockModal } from './components/VaultLockModal';
import { SettingsModal } from './components/SettingsModal';
import { StageGuideModal } from './components/StageGuideModal';
import {
  BookmarkCheck,
  Search,
  Plus,
  Inbox,
  Sparkles,
  Lock,
  Archive,
  RotateCcw,
  AlertCircle,
  Check
} from 'lucide-react';

export default function App() {
  // Main data states
  const [items, setItems] = useState<SavedItem[]>(() => loadSavedItems());
  const [user, setUser] = useState<UserProfile>(() => loadUserProfile());
  const [vaultPin, setVaultPin] = useState<string>(() => loadVaultPin());

  // Navigation & Filtering
  const [currentTab, setCurrentTab] = useState<ViewTab>('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | ItemType>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Security / Vault Unlock state
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);

  // Sync Engine state (Stage 2)
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [syncState, setSyncState] = useState<'synced' | 'syncing' | 'offline' | 'pending'>('synced');
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<number>(() => Date.now());

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SavedItem | null>(null);
  const [readingItem, setReadingItem] = useState<SavedItem | null>(null);
  const [isShareSimOpen, setIsShareSimOpen] = useState(false);
  const [isSyncInspectorOpen, setIsSyncInspectorOpen] = useState(false);
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Undo delete toast
  const [deletedItemUndo, setDeletedItemUndo] = useState<SavedItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-sync simulation when items change
  const triggerBackgroundSync = () => {
    if (isSimulatedOffline || !syncEnabled) {
      setSyncState('offline');
      return;
    }
    setSyncState('syncing');
    setTimeout(() => {
      setSyncState('synced');
      setLastSyncedAt(Date.now());
    }, 700);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  // Synchronize items with localStorage
  const updateItems = (newItems: SavedItem[]) => {
    setItems(newItems);
    saveSavedItems(newItems);
    triggerBackgroundSync();
  };

  // Add Item handler
  const handleAddItem = (data: Omit<SavedItem, 'id' | 'createdAt' | 'updatedAt' | 'isArchived'>) => {
    const newItem: SavedItem = {
      ...data,
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isArchived: false,
    };
    const next = [newItem, ...items];
    updateItems(next);
    showToast(`Saved "${newItem.title}" to ${newItem.isPrivate ? 'Private Vault' : 'Inbox'}`);
  };

  // Edit Item handler
  const handleUpdateItem = (updated: SavedItem) => {
    const next = items.map((i) => (i.id === updated.id ? updated : i));
    updateItems(next);
    showToast(`Updated "${updated.title}"`);
  };

  // Delete item with Undo option
  const handleDeleteItem = (id: string) => {
    const itemToDelete = items.find((i) => i.id === id);
    if (!itemToDelete) return;

    setDeletedItemUndo(itemToDelete);
    const next = items.filter((i) => i.id !== id);
    updateItems(next);
    showToast(`Deleted "${itemToDelete.title}"`);
  };

  const handleUndoDelete = () => {
    if (deletedItemUndo) {
      const next = [deletedItemUndo, ...items];
      updateItems(next);
      setDeletedItemUndo(null);
      showToast(`Restored "${deletedItemUndo.title}"`);
    }
  };

  // Toggle Pin / Favorite
  const handleTogglePin = (id: string) => {
    const next = items.map((i) => {
      if (i.id === id) {
        return { ...i, isPinned: !i.isPinned, updatedAt: Date.now() };
      }
      return i;
    });
    updateItems(next);
  };

  // Toggle Archive
  const handleToggleArchive = (id: string) => {
    const target = items.find((i) => i.id === id);
    if (!target) return;
    const willArchive = !target.isArchived;

    const next = items.map((i) => {
      if (i.id === id) {
        return { ...i, isArchived: willArchive, updatedAt: Date.now() };
      }
      return i;
    });
    updateItems(next);
    showToast(willArchive ? `Moved to Archive` : `Restored to Inbox`);
  };

  // Share Item handler
  const handleShareItem = async (item: SavedItem) => {
    const wasSharedNative = await triggerSystemShare(item.title, item.description || item.content, item.content);
    if (wasSharedNative) {
      showToast(`Shared "${item.title}"`);
    } else {
      showToast(`Link & info copied to clipboard!`);
    }
  };

  // Incoming Share from Stage 3 Simulator
  const handleReceiveShare = (data: {
    title: string;
    content: string;
    type: ItemType;
    tags: string[];
    description?: string;
  }) => {
    handleAddItem({
      type: data.type,
      title: data.title,
      content: data.content,
      description: data.description,
      tags: data.tags,
      isPinned: false,
      isPrivate: false,
      estimatedReadTimeMinutes: 4,
    });
    showToast(`⚡ Received share from phone: "${data.title}"`);
  };

  // Tab switching with Vault PIN check
  const handleTabChange = (tab: ViewTab) => {
    if (tab === 'vault' && !isVaultUnlocked) {
      setIsVaultModalOpen(true);
      return;
    }
    setCurrentTab(tab);
  };

  // Vault Unlock success
  const handleVaultUnlockSuccess = () => {
    setIsVaultUnlocked(true);
    setIsVaultModalOpen(false);
    setCurrentTab('vault');
    showToast('Vault unlocked successfully');
  };

  // Force Cloud Sync trigger
  const handleForceSync = () => {
    if (isSimulatedOffline) {
      showToast('Cannot sync while Offline mode is active');
      return;
    }
    setSyncState('syncing');
    setTimeout(() => {
      setSyncState('synced');
      setLastSyncedAt(Date.now());
      showToast('Cloud Database synchronized');
    }, 900);
  };

  // Offline toggle
  const handleToggleOffline = () => {
    setIsSimulatedOffline((prev) => {
      const next = !prev;
      setSyncState(next ? 'offline' : 'synced');
      return next;
    });
  };

  // User Profile switch
  const handleChangeUser = (newUser: UserProfile) => {
    setUser(newUser);
    saveUserProfile(newUser);
    showToast(`Switched account to ${newUser.name}`);
  };

  // Vault PIN update
  const handleUpdateVaultPin = (pin: string) => {
    setVaultPin(pin);
    saveVaultPin(pin);
  };

  // Reset to initial starter pack
  const handleResetData = () => {
    setItems(INITIAL_ITEMS);
    saveSavedItems(INITIAL_ITEMS);
    showToast('Restored starter bookmarks and notes');
  };

  // Import JSON backup
  const handleImportData = (imported: SavedItem[]) => {
    updateItems(imported);
    showToast(`Imported ${imported.length} items successfully`);
  };

  // Extract all unique tags
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    items.forEach((item) => {
      item.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [items]);

  // Tab counts
  const inboxCount = useMemo(
    () => items.filter((i) => !i.isArchived && !i.isPrivate).length,
    [items]
  );
  const favoritesCount = useMemo(
    () => items.filter((i) => !i.isArchived && i.isPinned).length,
    [items]
  );
  const vaultCount = useMemo(
    () => items.filter((i) => !i.isArchived && i.isPrivate).length,
    [items]
  );
  const archiveCount = useMemo(
    () => items.filter((i) => i.isArchived).length,
    [items]
  );

  // Filtered Items for active view
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 1. Tab check
      if (currentTab === 'inbox') {
        if (item.isArchived || item.isPrivate) return false;
      } else if (currentTab === 'favorites') {
        if (item.isArchived || !item.isPinned) return false;
      } else if (currentTab === 'vault') {
        if (item.isArchived || !item.isPrivate) return false;
      } else if (currentTab === 'archive') {
        if (!item.isArchived) return false;
      }

      // 2. Type filter
      if (selectedType !== 'all' && item.type !== selectedType) {
        return false;
      }

      // 3. Tag filter
      if (selectedTag && !item.tags?.includes(selectedTag)) {
        return false;
      }

      // 4. Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesContent = item.content.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        const matchesDomain = item.domain?.toLowerCase().includes(query);
        const matchesTag = item.tags?.some((t) => t.toLowerCase().includes(query));
        return matchesTitle || matchesContent || matchesDesc || matchesDomain || matchesTag;
      }

      return true;
    });
  }, [items, currentTab, selectedType, selectedTag, searchQuery]);

  return (
    <PhoneFrame
      onOpenGuide={() => setIsGuideOpen(true)}
      onOpenShareSim={() => setIsShareSimOpen(true)}
      onOpenSyncInspector={() => setIsSyncInspectorOpen(true)}
      syncState={syncState}
    >
      <div className="flex-1 flex flex-col min-h-full bg-slate-950 relative">
        {/* Top Header & Search Bar */}
        <TopBar
          currentTab={currentTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedType={selectedType}
          onSelectType={setSelectedType}
          availableTags={availableTags}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
          user={user}
          onOpenSettings={() => setIsSettingsOpen(true)}
          syncState={syncState}
          onOpenSyncInspector={() => setIsSyncInspectorOpen(true)}
          totalFilteredCount={filteredItems.length}
        />

        {/* Stage 1/2/3 Quick Milestone Announcement Banner */}
        <div className="px-4 py-2 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-violet-950/60 border-b border-slate-800/60 flex items-center justify-between text-[11px] text-slate-300">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse flex-shrink-0" />
            <span className="truncate">
              {currentTab === 'inbox' && 'Stage 1 Local Storage & Offline-First Active'}
              {currentTab === 'favorites' && 'Pinned Bookmarks Quick-Access'}
              {currentTab === 'vault' && 'Stage 2 Private Vault Protected (4-digit PIN)'}
              {currentTab === 'archive' && 'Archived Items (Safe & Restorable)'}
            </span>
          </div>
          <button
            onClick={() => setIsGuideOpen(true)}
            className="text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 hover:underline flex-shrink-0 ml-2"
          >
            How it works →
          </button>
        </div>

        {/* Scrollable Item Stream */}
        <main className="flex-1 p-3 sm:p-4 space-y-3 overflow-y-auto">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onOpenReader={(it) => setReadingItem(it)}
                onTogglePin={handleTogglePin}
                onToggleArchive={handleToggleArchive}
                onEdit={(it) => setEditingItem(it)}
                onDelete={handleDeleteItem}
                onShare={handleShareItem}
                isVaultLocked={item.isPrivate && !isVaultUnlocked}
              />
            ))
          ) : (
            // Empty State
            <div className="py-16 px-4 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 shadow-inner">
                {currentTab === 'inbox' ? (
                  <Inbox className="w-7 h-7" />
                ) : currentTab === 'favorites' ? (
                  <BookmarkCheck className="w-7 h-7 text-amber-500/50" />
                ) : currentTab === 'vault' ? (
                  <Lock className="w-7 h-7 text-rose-500/50" />
                ) : (
                  <Archive className="w-7 h-7 text-cyan-500/50" />
                )}
              </div>
              <div>
                <h4 className="font-bold text-slate-300 text-sm">
                  {searchQuery || selectedTag || selectedType !== 'all'
                    ? 'No matching saved items'
                    : currentTab === 'inbox'
                    ? 'Your inbox is empty'
                    : currentTab === 'favorites'
                    ? 'No pinned favorites yet'
                    : currentTab === 'vault'
                    ? 'No private vault items'
                    : 'No archived items'}
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                  {searchQuery || selectedTag || selectedType !== 'all'
                    ? 'Try adjusting your search query, type filters, or clearing tags.'
                    : 'Tap the (+) button below or test Phone Share to save links, notes, or images.'}
                </p>
              </div>

              {/* Action shortcuts */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setIsAddOpen(true)}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save Something</span>
                </button>
                <button
                  onClick={() => setIsShareSimOpen(true)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-medium border border-slate-700/60"
                >
                  Test Phone Share
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Global Floating Toast with Undo */}
        {toastMessage && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 max-w-xs sm:max-w-md w-[92%] bg-slate-900 border border-slate-700/80 rounded-2xl p-3 shadow-2xl flex items-center justify-between gap-2 text-xs text-slate-100 animate-in slide-in-from-bottom duration-200">
            <span className="truncate">{toastMessage}</span>
            {deletedItemUndo && (
              <button
                onClick={handleUndoDelete}
                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold text-[11px] flex-shrink-0 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Undo</span>
              </button>
            )}
          </div>
        )}

        {/* Bottom Navigation Bar */}
        <BottomNav
          currentTab={currentTab}
          onChangeTab={handleTabChange}
          onOpenAddModal={() => setIsAddOpen(true)}
          inboxCount={inboxCount}
          favoritesCount={favoritesCount}
          vaultCount={vaultCount}
          archiveCount={archiveCount}
        />

        {/* Stage 1: Add Item Modal */}
        <AddItemModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onSave={handleAddItem}
        />

        {/* Stage 1: Edit Item Modal */}
        <EditItemModal
          item={editingItem}
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          onSave={handleUpdateItem}
          onDelete={handleDeleteItem}
        />

        {/* Stage 3 Advanced Feature: Distraction-Free Article Clean Reader & Audio */}
        <ReaderModal
          item={readingItem}
          onClose={() => setReadingItem(null)}
          onShare={handleShareItem}
        />

        {/* Stage 3: Phone Share Simulator Modal */}
        <ShareSimulatorModal
          isOpen={isShareSimOpen}
          onClose={() => setIsShareSimOpen(false)}
          onReceiveShare={handleReceiveShare}
        />

        {/* Stage 2: Cloud Sync & DB Inspector Modal */}
        <SyncInspectorModal
          isOpen={isSyncInspectorOpen}
          onClose={() => setIsSyncInspectorOpen(false)}
          items={items}
          user={user}
          syncState={syncState}
          lastSyncedAt={lastSyncedAt}
          onTriggerSync={handleForceSync}
          isSimulatedOffline={isSimulatedOffline}
          onToggleOffline={handleToggleOffline}
        />

        {/* Stage 2: 4-Digit Passcode Vault Lock Modal */}
        <VaultLockModal
          isOpen={isVaultModalOpen}
          onClose={() => setIsVaultModalOpen(false)}
          onSuccess={handleVaultUnlockSuccess}
          savedPin={vaultPin}
        />

        {/* Stage 2: Account & Settings Modal */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          items={items}
          user={user}
          onChangeUser={handleChangeUser}
          vaultPin={vaultPin}
          onUpdateVaultPin={handleUpdateVaultPin}
          onResetData={handleResetData}
          onImportData={handleImportData}
          syncEnabled={syncEnabled}
          onToggleSync={setSyncEnabled}
        />

        {/* Beginner Guide / Stages Explained Simply */}
        <StageGuideModal
          isOpen={isGuideOpen}
          onClose={() => setIsGuideOpen(false)}
        />
      </div>
    </PhoneFrame>
  );
}
