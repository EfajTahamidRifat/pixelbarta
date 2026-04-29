export interface UserPreferences {
  language: 'en' | 'bn';
  bookmarkedArticles: string[];
  readArticles: string[];
}

const STORAGE_KEY = 'pixelbarta_preferences';

export function getPreferences(): UserPreferences {
  if (typeof window === 'undefined') {
    return {
      language: 'en',
      bookmarkedArticles: [],
      readArticles: [],
    };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('[v0] Failed to parse preferences:', error);
  }

  return {
    language: 'en',
    bookmarkedArticles: [],
    readArticles: [],
  };
}

export function savePreferences(prefs: UserPreferences): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch (error) {
    console.error('[v0] Failed to save preferences:', error);
  }
}

export function toggleBookmark(articleId: string): void {
  const prefs = getPreferences();
  const index = prefs.bookmarkedArticles.indexOf(articleId);

  if (index > -1) {
    prefs.bookmarkedArticles.splice(index, 1);
  } else {
    prefs.bookmarkedArticles.push(articleId);
  }

  savePreferences(prefs);
}

export function markAsRead(articleId: string): void {
  const prefs = getPreferences();

  if (!prefs.readArticles.includes(articleId)) {
    prefs.readArticles.push(articleId);
  }

  savePreferences(prefs);
}

export function isBookmarked(articleId: string): boolean {
  return getPreferences().bookmarkedArticles.includes(articleId);
}

export function isRead(articleId: string): boolean {
  return getPreferences().readArticles.includes(articleId);
}
