# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Dev Commands

```bash
python3 -m http.server 8000   # Start local server (http://localhost:8000)
# Or simply open index.html directly in a browser
```

No build step, package manager, or dependencies required — pure static site.

## Architecture

Single-page marketing website for MMA Klub Ratnik (combat sports club, Dobrinja, Sarajevo). Built with vanilla HTML5, CSS3, and ES5 JavaScript — no frameworks.

**Page composition** (`index.html`): Navbar → Hero → About → Programs → Schedule → Trainers → Gallery → Contact → Footer. All sections in a single HTML file with anchor-based navigation.

**Bilingual system**: `js/translations.js` exports a flat translation object keyed by `data-i18n` attributes. Language toggle (BS/EN) persists in localStorage (`"selectedLanguage"`). Switching calls `applyTranslations()` which walks DOM elements with `data-i18n`.

**Styling** (`css/style.css`): CSS custom properties for theming, mobile-first responsive design, dark combat aesthetic. External deps: Google Fonts (Oswald + Inter), Font Awesome 6.5.1 via CDN.

**Interactivity** (`js/main.js`): 9 behavioral modules — language switcher, navbar scroll class, smooth scroll nav, mobile hamburger menu, IntersectionObserver scroll animations, counter animation, gallery lightbox, contact form validation, active nav highlighting.

## Color Scheme (Combat Dark Theme)

| Role | Hex | Usage |
|------|-----|-------|
| Background | `#0A0A0A` | Primary bg |
| Accent | `#DC2626` | Buttons, highlights, active states |
| Text primary | `#F5F5F5` | Headings, body text |
| Text secondary | `#A3A3A3` | Subtitles, descriptions |
| Text muted | `#737373` | Fine print, metadata |

## Key Patterns

- **Fonts**: Oswald (headings, 700 weight, uppercase) + Inter (body, 300-600 weights)
- **Layout**: Container max-width 1200px, section padding 100px vertical, fixed navbar 70px
- **Responsive**: Mobile-first with hamburger menu, schedule table → card layout on mobile
- **Gallery lightbox**: Click to open, arrow/escape keyboard navigation
- **Contact form**: Frontend-only validation — no backend submission yet
- **Images**: `images/` folder exists but is empty (using `.gitkeep`), all visual content is placeholder

## Content Updates

- **Translations**: Edit `js/translations.js` — both BS and EN keys must stay in sync
- **Programs**: Edit the programs section in `index.html` (MMA, Women's Kickboxing, Women's BJJ, Children's, Functional Training)
- **Schedule**: Edit the schedule table in `index.html`
- **Contact info**: Hardcoded in `index.html` — address: Dobrinjske bolnice br. 17, Instagram: @klub_ratnik_sarajevo

## Session Start Checklist

1. Read `~/.claude/projects/.../memory/MEMORY.md` for context
2. Check `docs/BACKLOG.md` for pending work
3. Run `git log --oneline -10` to see recent changes
4. Report current status briefly

## Continuity Files

- **MEMORY.md**: `~/.claude/projects/C--Users-anesk-source-repos-MMA-Klub-Ratnik/memory/MEMORY.md` (session context, decisions)
- **BACKLOG.md**: `docs/BACKLOG.md` (prioritized task list)
- **Plans**: `docs/plans/` (design docs, implementation plans)
- **Codex Audit**: `docs/2026-03-09-codex-audit-enhancements.md` (code audit report with improvement roadmap)
