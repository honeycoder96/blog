const STORAGE_KEY = 'rp-read';

export function getReadPosts(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

export function markPostRead(slug: string): void {
  if (typeof window === 'undefined') return;
  try {
    const slugs = getReadPosts();
    if (slugs.has(slug)) return;
    slugs.add(slug);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...slugs]));
  } catch {}
}
