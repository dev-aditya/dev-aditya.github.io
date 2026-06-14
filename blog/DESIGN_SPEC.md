# project_dev_blog — Design & Implementation Specification

> **Project codename:** `project_dev_blog`
> **Purpose:** A pedagogical blog where every research paper gets a deep, visual, tutorial-style companion post.

---

## 1. Design Philosophy

The blog exists because research papers are optimized for experts, not learners. Every post takes one paper and rebuilds its core insight from the ground up — with intuition, visual explanations, and runnable intuition-checks.

Key principles:
- **One paper, one post.** No summaries of ten papers. Depth over breadth.
- **Assume curiosity, not expertise.** The reader knows physics exists and wants to understand *this* result.
- **Show the work.** Equations are not decoration — they are steps in a derivation, each justified.
- **No paywalls, no ads, no tracking.** Static HTML served fast.

---

## 2. Visual Design

### 2.1 Typography (inspired by colah.github.io)

| Element | Specification | Rationale |
|---|---|---|
| **Body font** | Computer Modern Serif (via `font-family: 'CMU Serif', 'Latin Modern Roman', Georgia, serif`) | Academic authority, screen-optimized |
| **Heading font** | Same as body (serif hierarchy via weight and size) | Visual consistency |
| **Code font** | `JetBrains Mono` or `Fira Code` at 0.85em | Legible, distinguishes `O` vs `0` |
| **Base font size** | 18px on desktop, 16px on mobile | Comfortable reading without zooming |
| **Line height** | 1.7 (body), 1.3 (headings) | Generous whitespace for long-form |
| **Max content width** | 720px | Optimal line length (~65–75 characters) |
| **Paragraph spacing** | 1.5em margin-bottom | Clear paragraph breaks without indent |
| **Math font** | `KaTeX_Math` or `Latin Modern Math` | Consistent with body serif |

### 2.2 Layout

- **Single column.** No sidebar, no multi-column text, no distracting navigation.
- **Generous margins.** 2rem on mobile, 4rem on desktop.
- **Footnotes, not endnotes.** Click to reveal, click again to close. (Inspired by Distill.pub)
- **Figures centered** with captions below in slightly smaller, gray text.
- **Table of contents** floated right on desktop (>1200px), collapsible on mobile.

### 2.3 Color Palette

| Role | Hex | Usage |
|---|---|---|
| Background | `#fdfdfd` | Near-white, reduces eye strain |
| Body text | `#222222` | Near-black, maximum contrast without glare |
| Heading text | `#111111` | Slightly darker for hierarchy |
| Accent / links | `#0066cc` | Classic academic blue |
| Link hover | `#004499` | Darker blue on hover |
| Secondary text | `#666666` | Captions, metadata, asides |
| Border / dividers | `#e0e0e0` | Subtle structural lines |
| Code background | `#f5f5f5` | Light gray for inline and block code |
| Highlight / mark | `#fff3cd` | Soft yellow for emphasized passages |

No dark mode. The aesthetic is intentionally paper-like.

---

## 3. Animation

### Intro Animation (inspired by Hydejack)

When a reader opens a post, the content performs a **staggered entrance**:

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.post-content > * {
  animation: fadeInUp 0.5s ease-out forwards;
  opacity: 0; /* start hidden */
}

/* Stagger: each child delays by 0.05s */
.post-content > *:nth-child(1) { animation-delay: 0.00s; }
.post-content > *:nth-child(2) { animation-delay: 0.05s; }
.post-content > *:nth-child(3) { animation-delay: 0.10s; }
/* ... etc, or use a SCSS loop */
```

**Parameters:**
- **Duration:** 500ms (0.5s)
- **Easing:** `ease-out` (deceleration, feels natural)
- **Translate distance:** 20px (subtle, not theatrical)
- **Stagger:** 50ms between elements
- **Trigger:** On page load (not scroll-triggered; articles are read top-to-bottom)
- **Respects preference:** If `prefers-reduced-motion: reduce`, animation is disabled entirely.

**What this is NOT:** A sidebar slide-in, a hero banner, or a parallax scroll. It is exclusively the *content entrance* on first load.

---

## 4. Tech Stack

### Chosen: Python + Jinja2 + Markdown

| Layer | Tool | Reason |
|---|---|---|
| **Templating** | Jinja2 | Python-native, powerful macros, easy custom filters |
| **Markdown parsing** | `markdown` + `pymdownx` extensions | Tables, footnotes, math blocks, fenced code |
| **Math rendering** | KaTeX (server-side or build-time) | Faster than MathJax, no FOUC |
| **Syntax highlighting** | Pygments (build-time) | No JS needed for code blocks |
| **CSS** | Plain CSS (no framework) | ~200 lines, no bloat, full control |
| **Build script** | Python `build.py` | Reads `posts/`, applies template, writes `site/` |
| **Hosting** | GitHub Pages (via `gh-pages` branch) or Cloudflare Pages | Free, fast CDN, custom domain ready |

### Why not Jekyll or Hugo?

Jekyll and Hugo are excellent, but they impose their own directory structures, plugin architectures, and theming systems. For a blog with *one writer* and *one aesthetic*, a 200-line Python build script is:
- Faster to modify than a Jekyll theme
- Easier to debug than Hugo's Go template errors
- More portable (any machine with Python)
- Simpler to extend (e.g., custom LaTeX→SVG figure pipeline)

### Directory Structure

```
project_dev_blog/
├── build.py                 # Static site generator
├── requirements.txt         # Python deps
├── config.yaml              # Site metadata, author info
├── templates/
│   ├── base.html            # Layout wrapper (header, footer, CSS/JS links)
│   ├── post.html            # Single post template
│   ├── index.html           # Homepage (list of posts)
│   └── partials/
│       ├── head.html        # <head> content (fonts, meta, KaTeX CSS)
│       ├── nav.html         # Minimal navigation (home, about, rss)
│       ├── footer.html      # Copyright, license, links
│       └── toc.html         # Table of contents generator
├── static/
│   ├── css/
│   │   ├── main.css         # Typography, layout, color palette
│   │   └── katex.min.css    # KaTeX styles (vendor)
│   ├── fonts/
│   │   ├── cmu-serif/
│   │   └── jetbrains-mono/
│   └── js/
│       └── entrance.js      # Hydejack-inspired fade-in animation
├── posts/
│   ├── 2026-06-09-spin-hamiltonian-as-matrix-free-linear-map/
│   │   ├── index.md         # Post content (Markdown + LaTeX)
│   │   └── figures/         # Paper-derived SVGs, diagrams
│   └── YYYY-MM-DD-slug/
│       └── ...
├── site/                    # Generated HTML (gitignored, deployed)
└── DESIGN_SPEC.md           # This file
```

---

## 5. Post Format (Frontmatter + Markdown)

Every post is a Markdown file with YAML frontmatter:

```yaml
---
title: "Spin Hamiltonian as Matrix-Free Linear Map"
date: 2026-06-09
arxiv: "2606.02169"
tags: [spin-dynamics, matrix-free-methods, mixed-radix-indexing, julia]
paper_authors: ["Aditya Dev"]
co_authors: []
status: published  # or draft, review
abstract: |
  A pedagogical walkthrough of representing spin Hamiltonians as matrix-free
  linear maps using mixed-radix indexing, with on-the-fly matrix-vector
  products and zero assembly cost.
---
```

### Body conventions

- Use `##` for major sections, `###` for subsections.
- Equations: `$$ ... $$` for display, `\( ... \)` for inline.
- Figures: `![Figure caption](figures/diagram.svg)` — all figures are SVG, generated from paper or recreated in Illustrator/Excalidraw.
- Code blocks: fenced with language tag, e.g. ` ```julia ... ``` `.
- Citations: `[Author Year](url)` or `[[Paper Title]]` for wiki-style internal links.
- Footnotes: `[^1]` with `[^1]: Footnote text.` at bottom.

---

## 6. Build Pipeline

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Write or edit a post in posts/YYYY-MM-DD-slug/index.md

# 3. Build the site
python build.py
# - Reads all posts/
# - Renders Markdown → HTML with Jinja2 templates
# - Copies static/ assets
# - Generates index.html (sorted by date)
# - Outputs to site/

# 4. Preview locally
python -m http.server --directory site/ 8000

# 5. Deploy to GitHub Pages
# (script: copies site/ to gh-pages branch or uses GitHub Actions)
```

### Build script responsibilities (`build.py`)

1. Parse all `posts/*/index.md` for YAML frontmatter.
2. Convert Markdown to HTML (with KaTeX preprocessing for math).
3. Generate a table of contents from `##` headers.
4. Apply `templates/post.html` with Jinja2.
5. Generate `site/index.html` listing all posts (newest first).
6. Copy `static/` to `site/static/`.
7. Validate: broken links, missing images, unrendered math.

---

## 7. Homepage Design

The homepage (`index.html`) is intentionally minimal:

- **Header:** Site title + one-sentence description + nav links (Home, About, RSS).
- **Post list:** Reverse chronological. Each entry shows:
  - Title (linked)
  - Date
  - One-sentence abstract / teaser
  - Tags (small, comma-separated)
- **Footer:** License (CC-BY-SA), source code link, last build date.

No pagination. If posts exceed ~50, add year-based grouping.

No search bar. Assume readers arrive from external links (Twitter, arXiv, HN) or browse chronologically.

---

## 8. RSS / Atom Feed

The build script generates `site/feed.xml` (Atom 1.0). Each entry contains:
- Title, link, publication date, updated date
- Full post content (not just abstract)
- arXiv ID as a `<category>`

This lets readers subscribe in Feedly, NetNewsWire, or their aggregator of choice.

---

## 9. Accessibility

- **Semantic HTML:** `<article>`, `<header>`, `<footer>`, `<nav>`, `<figure>`, `<figcaption>`.
- **Alt text** for every figure.
- **Math accessibility:** KaTeX generates MathML alongside visual rendering; screen readers can parse it.
- **Color contrast:** All text meets WCAG AA standard (contrast ratio ≥ 4.5:1).
- **Keyboard navigation:** TOC links, footnotes, and nav are fully keyboard-accessible.
- **Reduced motion:** Animation disabled for `prefers-reduced-motion`.

---

## 10. Open Questions / Decisions

| Question | Current thinking | Needs user input? |
|---|---|---|
| Custom domain? | `blog.adityadev.com` or `adityadev.github.io` | Yes — do you own a domain? |
| Comments / discussion? | None (encourage Twitter/X threads or email) | No — keep it static |
| Analytics? | None (privacy-preserving by default) | No — consider Plausible if needed |
| Multi-author? | No (single author, single voice) | No |
| PDF export? | Pandoc → PDF via LaTeX (optional per-post) | Maybe — useful for arXiv comments? |
| Figure pipeline? | TikZ → SVG, or Excalidraw → SVG | TBD — what do you draw in? |

---

## 11. Implementation Checklist

- [ ] Set up GitHub repo `project_dev_blog`
- [ ] Write `build.py` (MVP: renders one post)
- [ ] Create `templates/base.html` with typography CSS
- [ ] Implement entrance animation (`entrance.js`)
- [ ] Configure KaTeX (server-side rendering)
- [ ] Port first post: arXiv:2606.02169
- [ ] Generate index.html and Atom feed
- [ ] Deploy to GitHub Pages
- [ ] Test on mobile (iOS Safari, Android Chrome)
- [ ] Lint: accessibility, contrast, link checks

---

## References

- [colah.github.io](https://colah.github.io) — Academic typography reference
- [Hydejack](https://hydejack.com/) — Animation reference (entrance only)
- [Distill.pub](https://distill.pub) — Footnote interaction, figure design
- [KaTeX](https://katex.org/) — Math rendering
- [Jinja2](https://jinja.palletsprojects.com/) — Templating engine
