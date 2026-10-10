export type ItemType = 'link' | 'note' | 'image';

export interface SavedItem {
  id: string;
  type: ItemType;
  title: string;
  content: string; // URL for link, text for note, image source for image
  description?: string;
  tags: string[];
  isPinned: boolean;
  isArchived: boolean;
  isPrivate: boolean; // Vault protected
  createdAt: number;
  updatedAt: number;
  // Link specific metadata
  domain?: string;
  favicon?: string;
  coverImage?: string;
  estimatedReadTimeMinutes?: number;
  articleBody?: string; // Content for Distraction-Free Reader
  // Image specific metadata
  imageCaption?: string;
}

export type ViewTab = 'inbox' | 'favorites' | 'vault' | 'archive';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  plan: 'free' | 'cloud_pro';
}

export type SyncState = 'synced' | 'syncing' | 'offline' | 'pending';

export interface SyncStats {
  status: SyncState;
  lastSyncedAt: number;
  pendingCount: number;
  cloudItemCount: number;
}

export interface ReaderSettings {
  theme: 'light' | 'sepia' | 'dark' | 'slate';
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
  fontFamily: 'serif' | 'sans';
  speechRate: number;
}
