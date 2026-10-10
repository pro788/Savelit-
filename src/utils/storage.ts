import { SavedItem, UserProfile } from '../types';
import { INITIAL_ITEMS, INITIAL_USER } from '../data/initialData';

const STORAGE_KEYS = {
  ITEMS: 'saveit_items_v1',
  USER: 'saveit_user_v1',
  VAULT_PIN: 'saveit_vault_pin_v1',
  CLOUD_SYNC: 'saveit_cloud_sync_enabled',
};

// --- Storage Handlers ---
export function loadSavedItems(): SavedItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ITEMS);
    if (!raw) {
      saveSavedItems(INITIAL_ITEMS);
      return INITIAL_ITEMS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_ITEMS;
  } catch (error) {
    console.warn('Failed to load items from localStorage, using initial data:', error);
    return INITIAL_ITEMS;
  }
}

export function saveSavedItems(items: SavedItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save items to localStorage:', error);
  }
}

export function loadUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) return INITIAL_USER;
    return JSON.parse(raw);
  } catch {
    return INITIAL_USER;
  }
}

export function saveUserProfile(user: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error('Failed to save user profile:', error);
  }
}

export function loadVaultPin(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.VAULT_PIN) || '1234';
  } catch {
    return '1234';
  }
}

export function saveVaultPin(pin: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.VAULT_PIN, pin);
  } catch (error) {
    console.error('Failed to save vault PIN:', error);
  }
}

// --- Metadata Extraction Simulation ---
export function extractMetadataFromUrl(url: string): Partial<SavedItem> {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    const hostname = parsed.hostname.replace(/^www\./, '');

    let title = hostname;
    let coverImage = '';
    let readTime = 3;

    if (hostname.includes('github.com')) {
      const parts = parsed.pathname.split('/').filter(Boolean);
      title = parts.length >= 2 ? `${parts[0]}/${parts[1]}` : 'GitHub Repository';
      coverImage = 'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?w=800&auto=format&fit=crop&q=80';
    } else if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      title = 'Video: ' + (parsed.searchParams.get('v') || 'YouTube Stream');
      coverImage = 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80';
      readTime = 8;
    } else if (hostname.includes('medium.com') || hostname.includes('substack')) {
      title = 'Article on ' + hostname;
      coverImage = 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&auto=format&fit=crop&q=80';
      readTime = 5;
    } else {
      // Clean path to form readable title
      const pathWords = parsed.pathname
        .replace(/[-_]/g, ' ')
        .split('/')
        .filter(Boolean)
        .pop();
      if (pathWords && pathWords.length > 2) {
        title = pathWords.charAt(0).toUpperCase() + pathWords.slice(1);
      } else {
        title = `Saved Link: ${hostname}`;
      }
      coverImage = 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=800&auto=format&fit=crop&q=80';
    }

    return {
      domain: hostname,
      favicon: `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`,
      coverImage,
      estimatedReadTimeMinutes: readTime,
    };
  } catch {
    return {
      domain: 'web',
      favicon: '',
    };
  }
}

// --- Export & Import Tools ---
export function exportDataAsJson(items: SavedItem[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(items, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `saveit-backup-${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function exportDataAsMarkdown(items: SavedItem[]): void {
  let md = `# Saveit Export (${new Date().toLocaleDateString()})\n\nTotal Items: ${items.length}\n\n`;

  items.forEach((item, index) => {
    md += `## ${index + 1}. [${item.type.toUpperCase()}] ${item.title}\n`;
    md += `- **Date:** ${new Date(item.createdAt).toLocaleDateString()}\n`;
    if (item.tags.length > 0) md += `- **Tags:** ${item.tags.map(t => `#${t}`).join(' ')}\n`;
    if (item.domain) md += `- **Domain:** ${item.domain}\n`;
    md += `\n**Content:**\n${item.content}\n\n`;
    if (item.articleBody) {
      md += `**Article Text:**\n${item.articleBody}\n\n`;
    }
    md += `---\n\n`;
  });

  const dataStr = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(md);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `saveit-notes-${new Date().toISOString().slice(0, 10)}.md`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// --- Outgoing Share API ---
export async function triggerSystemShare(title: string, text: string, url: string): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url: url || window.location.href,
      });
      return true;
    } catch (err: any) {
      // Ignore user abort
      if (err.name === 'AbortError') return false;
    }
  }

  // Fallback: copy to clipboard
  try {
    const copyText = `${title}\n${url || text}`;
    await navigator.clipboard.writeText(copyText);
    return false; // indicates fallback copied
  } catch {
    return false;
  }
}
