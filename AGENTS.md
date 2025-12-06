# Repository Guidelines

This repository contains a static, GitHub Pages–hosted portfolio site. Use this guide when contributing or automating edits.

## Project Structure & Module Organization

- HTML entry points: `index.html`, `about.html`, `work.html`, `contact.html`.
- Styles: authoring in `scss/` (e.g., `main.scss`, `_config.scss`, `_menu.scss`); compiled CSS in `css/` (e.g., `main.css`).
- Scripts: client-side JavaScript in `js/` (`main.js`, `particles.js`, `typewrite.js`).
- Assets: images in `img/`, favicon in `favicon.png`, particle config in `particle/particles.json`.

## Build, Test, and Development Commands

- `npm install` – install Sass and deployment dependencies.
- `npm run sass` – watch `scss/` and compile to `css/`; always edit SCSS, not generated CSS.
- `npm run deploy` – publish the built site (expects output in `dist/` when used with `gh-pages`).
- Manual preview: open `index.html` in a browser or use a static server/Live Server for local testing.

## Coding Style & Naming Conventions

- Indentation: 2 spaces in HTML, SCSS, and JS; no tabs.
- HTML: prefer semantic tags (`header`, `main`, `footer`) and descriptive class names in `kebab-case` (e.g., `.menu-nav`, `.about-info`).
- SCSS: keep rules modular; add new partials as `_file.scss` and import them from `main.scss`.
- JavaScript: use `camelCase` for variables/functions and keep logic small and page-focused.

## Testing Guidelines

- No formal automated test suite; rely on manual testing.
- For each change, verify all main pages load correctly, navigation works, and animations/particles behave as expected.
- Check responsiveness for common breakpoints (mobile, tablet, desktop) and scan the browser console for errors.

## Commit & Pull Request Guidelines

- Commit messages: concise, present-tense summaries similar to existing history (e.g., `Update contact email`, `Refactor styles for about page`).
- Keep commits and PRs focused on a single theme (content update, style tweak, JS behavior, etc.).
- PRs should include: a short description, list of affected pages/files, any new assets or scripts, and screenshots for visible UI changes.

