# Meme Toggle Feature Implementation Plan

## Context

The user wants to add a fun easter egg feature to their presentation deck: pressing the **M key** should toggle the visibility of meme images on 5 specific slides. The images already exist in the `img/` folder but need to be dynamically injected into the slides without modifying the HTML source structure.

**Why this is needed:**
- Adds personality and humor to technical presentation
- Provides optional visual breaks during the talk
- Demonstrates understanding of component architecture
- Keeps professional version (memes off) separate from casual version

**Key Requirements:**
1. M key toggles all memes on/off together
2. No modification to existing HTML structure
3. Images must be positioned correctly per specification
4. Content must not overlap
5. State should persist across page refreshes

## Architecture Overview

The presentation uses a custom web component (`deck-stage.js`) that manages slide navigation via shadow DOM, with slides living in light DOM as slotted `<section>` elements. The component follows clear patterns:

- **Keyboard handling**: Centralized in `_onKey` method (lines 561-592)
- **State tracking**: `this._slides` array, `this._index` for current slide
- **Visibility control**: CSS via `data-deck-active` attribute
- **Persistence**: localStorage keyed by pathname
- **Event feedback**: `_flashOverlay()` for visual confirmation

## Implementation Approach

### 1. Configuration Data Structure

Create a constant mapping slide indices to meme configuration:

```javascript
const MEME_CONFIG = {
  4: {  // Slide 05 - My Journey
    image: 'img/wolf-meme.gif',
    selector: '.s-journey .anchor h2',
    position: 'after',
    width: '400px',
    marginTop: '32px'
  },
  5: {  // Slide 06 - Section Divider (Two Sides)
    image: 'img/claude-meme.png',
    selector: '.s-section .body .label',
    position: 'after',
    width: '500px',
    marginTop: '24px',
    marginBottom: '32px'
  },
  8: {  // Slide 09 - Token Tab
    image: 'img/one-shot-meme.webp',
    selector: '.s-token .top h2',
    position: 'after',
    width: '420px',
    marginTop: '36px'
  },
  10: {  // Slide 11 - Section Divider (Demo)
    image: 'img/production-meme.webp',
    selector: '.s-section .body .label',
    position: 'after',
    width: '450px',
    marginTop: '24px',
    marginBottom: '32px'
  },
  13: {  // Slide 15 - Recap
    image: 'img/context-meme.jpeg',
    selector: '.s-recap .top h2',
    position: 'after',
    width: '480px',
    marginTop: '36px'
  }
};
```

**Rationale for this structure:**
- Array indices match slide positions (0-based)
- Selector targets the anchor element to insert after
- Width and margins prevent overlap with existing content
- Declarative configuration makes it easy to modify

### 2. CSS Strategy

Add styles to the `stylesheet` constant in deck-stage.js (after line 60):

```css
/* Meme toggle support */
.deck-meme-img {
  display: none;
  max-width: 100%;
  height: auto;
  pointer-events: none;
}

[data-deck-memes-visible] .deck-meme-img {
  display: block;
}

/* Print mode: hide memes by default, show if toggled on */
@media print {
  .deck-meme-img {
    display: none !important;
  }
  [data-deck-memes-visible] .deck-meme-img {
    display: block !important;
  }
}
```

**Rationale:**
- Single data attribute on body controls all memes
- Follows existing pattern (`data-deck-active`)
- Instant toggle (no transitions needed for easter eggs)
- Print-friendly: respects toggle state

### 3. Component State Extensions

Add to constructor (around line 272):

```javascript
this._memesVisible = false;
this._memesInjected = false;
this._memeStorageKey = STORAGE_PREFIX + 'memes:' + (location.pathname || '/');
```

### 4. Image Injection Method

New method to inject all meme images (add after `_onSlotChange`):

```javascript
_injectMemes() {
  if (this._memesInjected) return;

  Object.entries(MEME_CONFIG).forEach(([slideIndex, config]) => {
    try {
      const slide = this._slides[parseInt(slideIndex, 10)];
      if (!slide) {
        console.warn(`[deck-stage:memes] Slide ${slideIndex} not found`);
        return;
      }

      const anchor = slide.querySelector(config.selector);
      if (!anchor) {
        console.warn(`[deck-stage:memes] Anchor "${config.selector}" not found in slide ${slideIndex}`);
        return;
      }

      const img = document.createElement('img');
      img.src = config.image;
      img.className = 'deck-meme-img';
      img.alt = '';
      img.style.width = config.width;
      img.style.marginTop = config.marginTop;
      if (config.marginBottom) img.style.marginBottom = config.marginBottom;
      img.setAttribute('aria-hidden', 'true');

      img.onerror = () => {
        console.warn(`[deck-stage:memes] Failed to load: ${config.image}`);
      };

      anchor.parentNode.insertBefore(img, anchor.nextSibling);
    } catch (e) {
      console.warn(`[deck-stage:memes] Error injecting meme for slide ${slideIndex}:`, e);
    }
  });

  this._memesInjected = true;
  this._restoreMemeState();
}
```

Call from `_onSlotChange` (add after `_applyIndex` call, around line 409):

```javascript
this._injectMemes();
```

### 5. Toggle Logic

Add to keyboard handler in `_onKey` method (around line 586, before the `else { handled = false; }` line):

```javascript
} else if (key === 'm' || key === 'M') {
  this._toggleMemes();
```

New toggle methods:

```javascript
_toggleMemes() {
  this._memesVisible = !this._memesVisible;
  this._applyMemeState();
  this._persistMemeState();
  this._flashOverlay();
}

_applyMemeState() {
  if (this._memesVisible) {
    document.body.setAttribute('data-deck-memes-visible', '');
  } else {
    document.body.removeAttribute('data-deck-memes-visible');
  }
}

_restoreMemeState() {
  try {
    const raw = localStorage.getItem(this._memeStorageKey);
    if (raw === 'true') {
      this._memesVisible = true;
      this._applyMemeState();
    }
  } catch (e) { /* ignore */ }
}

_persistMemeState() {
  try {
    localStorage.setItem(this._memeStorageKey, String(this._memesVisible));
  } catch (e) { /* ignore */ }
}
```

## Critical Files

- `/Users/sangeeky/softserve/talk/slides/deck-stage.js` - Main component file to modify
- `/Users/sangeeky/softserve/talk/slides/img/wolf-meme.gif` (90.8 KB)
- `/Users/sangeeky/softserve/talk/slides/img/claude-meme.png` (748.1 KB)
- `/Users/sangeeky/softserve/talk/slides/img/one-shot-meme.webp` (134.6 KB)
- `/Users/sangeeky/softserve/talk/slides/img/production-meme.webp` (22.2 KB)
- `/Users/sangeeky/softserve/talk/slides/img/context-meme.jpeg` (161.9 KB)

## Implementation Sequence

1. **Add MEME_CONFIG** constant after line 56 in deck-stage.js
2. **Update stylesheet** constant (lines 60-266) with CSS rules
3. **Update constructor** with state variables (around line 272)
4. **Add `_injectMemes()` method** after `_onSlotChange` method
5. **Call `_injectMemes()`** from `_onSlotChange` (after line 409)
6. **Add M key handler** to `_onKey` method (around line 586)
7. **Add toggle and persistence methods** after `_onKey` method

## Testing & Verification

### Manual Testing Steps:

1. Open `index.html` in browser
2. Navigate to slide 05 (My Journey) - press arrow keys to get there
3. Press **M** key - verify wolf meme appears below title in left column
4. Navigate to slide 06 (Two Sides section divider)
5. Verify Claude meme appears after label, before title
6. Navigate to slide 09 (Token Tab)
7. Verify one-shot meme appears below title "Every bad prompt shows up on the bill"
8. Navigate to slide 11 (Demo section divider)
9. Verify production meme appears after label
10. Navigate to slide 15 (Recap)
11. Verify context meme appears after title "Four things to remember tomorrow"
12. Press **M** again - verify all memes disappear
13. Press **M** once more - verify all memes reappear
14. Refresh page - verify memes remain visible (localStorage persistence)
15. Press **M** to hide, refresh - verify memes stay hidden
16. Open browser DevTools Console - check for any warnings about missing images or selectors

### Print Mode Testing:

1. Toggle memes ON
2. Open Print Preview (Cmd/Ctrl+P)
3. Verify memes are visible in print view
4. Close print preview, toggle memes OFF
5. Open Print Preview again
6. Verify memes are hidden in print view

### Error Handling Testing:

1. Temporarily rename one image file (e.g., wolf-meme.gif → wolf-meme-backup.gif)
2. Refresh page
3. Check console for graceful warning (not error)
4. Verify other 4 memes still work
5. Restore filename
6. Verify all 5 memes work again

### Accessibility Testing:

1. Enable screen reader
2. Navigate through slides with memes visible
3. Verify memes are not announced (aria-hidden="true")
4. Check that alt="" attribute is present (marks as decorative)

## Design Decisions & Rationale

### Global Toggle vs. Per-Slide
**Choice:** Global toggle (all memes on/off together)

**Rationale:**
- Simpler UX - single key press
- Memes are easter eggs, not core content
- Easier state management
- Can extend to per-slide later if needed

### Inject on Mount vs. On-Demand
**Choice:** Inject on mount (when slides are collected)

**Rationale:**
- Instant toggle response (no loading delay)
- Images cached by browser immediately
- No layout shift when first toggled
- Total size ~1.7 MB acceptable for local presentation

### Print Mode Behavior
**Choice:** Hide by default, show if toggled on

**Rationale:**
- Professional PDF export by default
- Respects user intent (if on, they want it)
- Avoids potential copyright issues in distribution

### Positioning Strategy
**Choice:** Use `insertBefore(img, anchor.nextSibling)` with margin-based spacing

**Rationale:**
- Doesn't modify existing elements
- Respects document flow
- margin-top/margin-bottom provide predictable spacing
- Works with existing absolute positioning patterns

## Error Handling

All operations wrapped in try/catch blocks:
- Missing image files → console warning, other memes still work
- Missing selector → console warning, other memes still work
- localStorage disabled → feature works without persistence
- Malformed config → graceful degradation

## Performance Considerations

- **Initial load:** +1.7 MB for 5 images (acceptable for local presentation)
- **Toggle speed:** O(1) - single attribute change
- **Memory:** 5 additional DOM nodes + browser image cache
- **Navigation:** No impact - images stay mounted but hidden

## Accessibility

- `alt=""` marks images as decorative
- `aria-hidden="true"` hides from screen readers
- No keyboard traps or focus management needed
- Visual-only enhancement (doesn't affect functionality)

## Future Enhancements (Out of Scope)

- Visual indicator for M key availability
- Per-slide toggle
- Animation transitions
- External configuration file
- Image optimization (convert PNG to WebP)
- Lazy loading for images

## Summary

This implementation:
- ✅ Adds M key toggle functionality
- ✅ Injects images programmatically (no HTML changes)
- ✅ Positions correctly per specification
- ✅ Prevents content overlap with explicit sizing
- ✅ Persists state across refreshes
- ✅ Follows existing component patterns
- ✅ Handles errors gracefully
- ✅ Remains accessible
- ✅ Works in print mode

**Estimated implementation time:** 45-60 minutes
**Lines of code added:** ~120 lines to deck-stage.js
**Files modified:** 1 (deck-stage.js)