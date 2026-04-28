# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a custom HTML presentation deck for the "Going Dutch Code" talk about AI-assisted software development. The presentation uses a custom web component (`<deck-stage>`) to create a slide deck with keyboard navigation, speaker notes, and live styling controls.

## Architecture

### Core Components

1. **Going Dutch Code.html**: Main HTML presentation file containing all slides
   - Uses inline styles for slide-specific layouts (cover, menu, section dividers, journey timeline, comparison grids, etc.)
   - Embeds speaker notes and interactive controls
   - Self-contained single-file architecture

2. **deck-stage.js**: Custom web component for slide deck functionality
   - Handles keyboard navigation (←/→, PgUp/PgDn, Space, Home/End, number keys)
   - Auto-scales slides (default 1920×1080) to fit viewport with letterboxing
   - Preserves slide state across navigation (videos, iframes, React trees stay mounted but hidden)
   - Dispatches `slidechange` events with detail.index, detail.slide, detail.reason
   - Persists current slide index to localStorage keyed by document path
   - Print-friendly: `@media print` lays each slide as its own page

3. **tweaks-panel.jsx**: React-based live editing UI
   - Provides TweaksPanel component with form controls (slider, toggle, radio, color picker, select)
   - Communicates via `__activate_edit_mode` / `__deactivate_edit_mode` messages
   - Persists tweaks to `TWEAK_DEFAULTS` object marked with `/*EDITMODE-BEGIN*/.../*EDITMODE-END*/`
   - Allows live customization of section divider styles (gradient, numeral size/position, title case)

4. **colors_and_type.css**: Brand design tokens
   - SoftServe's Ascend OS color system (Austin Orange, Lviv Blue, neutrals)
   - Font loading: Azurio (display), Replica LL (sans), Roboto Mono (mono)
   - CSS custom properties for --fg, --bg, --border, --chamfer-diagonal-* clip paths

### Slide Structure

Each slide is a `<section>` with:
- `.s-{type}` class (e.g., `.s-cover`, `.s-menu`, `.s-section`, `.s-journey`, `.s-lore`, `.s-two`, `.s-token`, `.s-rules`, `.s-demo`, `.s-payoff`, `.s-recap`)
- `data-screen-label` attribute for navigation labels
- `data-om-validate` for validation rules
- `data-deck-slide` for explicit slide numbering

Slide types:
- **Cover**: Title slide with gradient trajectory SVG, ledger table
- **Menu**: Table of contents with numbered grid items
- **Section dividers**: Between-course breaks with large numeral, gradient background
- **Journey**: Vertical timeline with rail/dot visualization
- **Lore**: Three-pillar layout with eyebrow + hero text
- **Two**: Split comparison (Cursor vs Claude Code) with bordered columns
- **Token**: Receipt-style breakdown with line items
- **Rules**: Card grid layout
- **Demo**: Checklist cards with chamfered corners
- **Payoff**: Side-by-side deal breakdown
- **Recap**: Four-column takeaway grid

### Chrome & Footer Pattern

Most slides include:
```html
<div class="chrome">
  <div class="lockup">
    <svg>...</svg> <!-- SoftServe logo -->
    <span class="wm">SoftServe</span>
  </div>
  <div class="meta"><span>Going Dutch Code</span><span class="sep">/</span><span>NN</span></div>
</div>
<div class="footer">
  <span class="left">DAVID PINCHAO · SOFTSERVE</span>
  <span>NN / 14</span>
</div>
```

## Development Workflow

### Viewing the Presentation

Open `Going Dutch Code.html` in a browser. No build step required.

**Keyboard controls:**
- `←/→` or `PgUp/PgDn` or `Space`: Navigate slides
- `Home/End`: Jump to first/last slide
- `R`: Reset to slide 0
- Number keys: Jump to slide N

### Editing Slides

1. Open the HTML file directly - all slides are inline
2. Find the slide section by its `data-screen-label` or `.s-{type}` class
3. Edit HTML/CSS inline within the `<style>` blocks or `<section>` elements
4. Refresh browser to see changes

**No build tools.** All assets are either inline, CDN-linked (React, Babel), or local font files.

### Live Style Tweaking

The tweaks panel (bottom-right when viewing) allows runtime adjustments:
- Section divider gradients (white, blue, orange, neutral, inverted, black)
- Title size (72–180px)
- Uppercase title toggle
- Show/hide description
- Accent color
- Numeral size (120–720px) and position (left/right)

Changes persist to `TWEAK_DEFAULTS` in the inline script.

### Fonts

Expects these font files in a `fonts/` subdirectory:
- `RobotoMono-{Regular,Medium,Bold}.ttf`
- `ReplicaLLTT-{Regular,Bold}_*.ttf`
- Azurio (referenced but may be unused in current version)

## Style Conventions

- **Spacing units**: 96px page margins, 56px–80px section padding
- **Typography scale**:
  - Display: 96–200px (Replica or Azurio)
  - Body: 16–22px (Replica)
  - Mono: 11–16px (Roboto Mono)
- **Color palette**: See `colors_and_type.css` for full token list
  - Primary accent: `#FF5C20` (Austin Orange)
  - Secondary: `#459FDD` (Lviv Blue)
  - Foreground: `#0A0B0C`
  - Muted: `rgba(41,38,27,0.55)`
- **Grid layouts**: Most slides use CSS Grid with 1fr columns and 24–40px gaps
- **Borders**: 1–2px solid, use `var(--border)` or `var(--fg)`
- **Clip paths**: Chamfered corners via `--chamfer-diagonal-12/24` (defined in CSS)

## Editing Guidelines

1. **Preserve the single-file architecture**: Don't split slides into separate files
2. **Maintain responsive scaling**: Slides are designed at 1920×1080 and auto-scale - avoid absolute positioning outside the section bounds
3. **Keep print support**: Ensure new slides respect the `@media print` rules (one page per slide)
4. **Use semantic classes**: Follow the `.s-{type}` naming pattern for new slide types
5. **Test keyboard navigation**: Verify all slides are reachable via arrow keys after changes
6. **Consistent chrome**: New slides should include the standard header/footer unless intentionally omitted (like section dividers)
7. **Validate slide attributes**: Add `data-screen-label`, `data-om-validate`, and `data-deck-slide` to new slides

## Common Tasks

**Add a new slide:**
1. Copy an existing `<section>` with similar layout
2. Update `data-screen-label` and `data-deck-slide` attributes
3. Increment slide numbers in all following slides' chrome/footer
4. Add a new slide-specific style block if needed (e.g., `.s-newtype { ... }`)

**Change slide order:**
1. Reorder `<section>` elements in the DOM
2. Update all `data-deck-slide` attributes to match new order
3. Update footer slide counts (e.g., "05 / 14" → "05 / 15" if a slide was added)

**Customize section dividers:**
- Use the tweaks panel (live) or edit `TWEAK_DEFAULTS` object in the inline script
- Gradients are defined in the `GRADIENTS` object

**Export to PDF:**
- Use browser Print → Save as PDF
- The `@media print` rules ensure each slide becomes one page at 1920×1080

## Technical Notes

- **React/Babel loaded from CDN**: React 18.3.1, Babel 7.29.0 (for JSX in tweaks panel)
- **No bundler**: All code is vanilla JS or inline JSX with Babel transform
- **Shadow DOM**: `deck-stage.js` uses a custom element with shadow DOM for encapsulation
- **Local storage key**: `deck-stage:slide:{pathname}` stores current slide index
- **Speaker notes**: Can be embedded as `<script type="application/json" id="speaker-notes">` (deck-stage posts `{slideIndexChanged: N}` to parent window)
- **Accessibility**: Slides use semantic HTML but no explicit ARIA navigation (room for improvement)
- **Performance**: Slides stay mounted (hidden) rather than unmounting, preserving state but keeping all DOM nodes in memory


# Communication
- Be direct and concise. No verbosity or over-explanation.
- Avoid ambiguity — ask for clarification when instructions are unclear.

# Code Style
- Write clean, self-describing code. Avoid comments that overexplain.

# Git
- NEVER run `git rebase --continue`. This is the user's responsibility.
- NEVER commit changes by your own.
- SUGGEST commit messages for work-related commits.