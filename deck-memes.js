/**
 * Global meme toggle for the deck: visibility is driven by `data-deck-memes-visible`
 * on `document.body`. Styles live in index.html (light DOM).
 */

const STORAGE_PREFIX = 'deck-stage:memes:';

function memeStorageKey() {
  return STORAGE_PREFIX + (location.pathname || '/');
}

let memesVisible = false;

function syncBodyAttribute() {
  if (memesVisible) {
    document.body.setAttribute('data-deck-memes-visible', '');
  } else {
    document.body.removeAttribute('data-deck-memes-visible');
  }
}

function persistMemeState() {
  try {
    localStorage.setItem(memeStorageKey(), String(memesVisible));
  } catch (e) { /* ignore */ }
}

/** Toggle memes on/off and persist. */
export function toggleMemes() {
  memesVisible = !memesVisible;
  syncBodyAttribute();
  persistMemeState();
}

/** Restore visibility from localStorage (call once after DOM is ready). */
export function restoreMemeState() {
  try {
    const raw = localStorage.getItem(memeStorageKey());
    if (raw === 'true') {
      memesVisible = true;
      syncBodyAttribute();
    }
  } catch (e) { /* ignore */ }
}
