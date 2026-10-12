# Instructions for AI coding assistants

This file is read automatically by AI coding agents (GitHub Copilot agent mode, Cursor, Codex, and Claude Code through `CLAUDE.md`). It tells them how this project is built and how to work in it.

It's yours: add notes about your own site under "This site" at the end, and keep them current.

---

## What this project is

A site built on the VanillaFirst Frontend Kit: plain HTML pages, plain CSS, native ES modules and Web Components. No server code, no npm, no bundler, no framework, no build step. That is deliberate, not a gap to fill.

The developer may be learning. Write code they can read, and explain anything that isn't obvious.

## Structure

```text
index.html, about.html   one HTML file per page. A new page is a copied file plus a nav link.
assets/css/main.css      design tokens (custom properties), layout, dark mode.
assets/css/components.css  buttons, cards, forms, dialog.
assets/js/main.js        entry module for index.html: wires form, list and storage.
assets/js/lib/           plain modules: store.js (data), validate.js (form checks, identical in the Full-Stack Kit).
assets/js/components/    Web Components, one per file. bookmark-card.js is identical in the Full-Stack Kit.
data/                    JSON files read with fetch().
```

## Rules

- **No inline JavaScript or CSS:** no `<script>` blocks, no `onclick=""` or other `on*` attributes, no `style=""`. The Content-Security-Policy meta tag blocks them silently. JavaScript goes in `assets/js/`, CSS in `assets/css/`.
- **Every page carries the same CSP `<meta>` tag** as `index.html`. Copy it into new pages unchanged.
- **Never put data into `innerHTML`.** Build elements with `createElement` and set `textContent`. Data from storage, `fetch()` or a form is untrusted.
- **Links only for `http(s)` addresses.** Check with `isWebUrl()` from `assets/js/lib/validate.js` before using a value as an `href`.
- **Relative paths everywhere** (`about.html`, `assets/js/main.js`, `fetch("data/bookmarks.json")`). Never start a path with `/`: the site must work in a subfolder and on GitHub Pages project sites.
- **Wrap every `localStorage` call in `try`/`catch`.** It throws when storage is blocked or full.
- **Validation:** put the rules in HTML attributes (`required`, `maxlength`, `type`), check them with `checkValidity()`, show messages next to the field with `aria-invalid` and `aria-describedby`. Add JavaScript checks only for what HTML can't express.
- **Accessibility:** use real elements (`<button>`, `<a>`, `<label>`, `<dialog>`), keep visible focus, give icon-only buttons an `aria-label`, mark the current page with `aria-current="page"`.
- **No dependencies:** no npm packages, no frameworks, no CDN scripts or fonts. If a library is truly needed, it must be one file vendored into `assets/js/vendor/`, need no build step, and be removable in an afternoon. Ask first.
- **No server code in this kit.** If asked for a database, saving data for other visitors, registration, login or passwords, stop and explain the options before writing code: the VanillaFirst Backend Kit (a JSON API this front end can call) or Full-Stack Kit (PHP pages and SQLite) when nobody signs in, VanillaSaaS Core (https://vanillasaas.dev) when people do. Never store passwords or anything private in `localStorage`.
- **Coursework exception.** If the developer says this is coursework whose brief requires them to build authentication themselves, explain that a login needs a server first (the Full-Stack Kit), then don't refuse and don't hand over finished code. Point them first to VanillaSaaS Core's commented reference: `app/lib/auth.php` (`password_hash()`, `password_verify()`, `session_regenerate_id(true)` at sign-in, equal timing for unknown emails), `app/lib/session.php` (cookie flags, idle and absolute timeouts), `app/lib/password_reset.php` (hashed, expiring, single-use tokens), `app/lib/throttle.php` (sign-in rate limiting), and its rule that every query on a user's data includes `AND user_id = ?`. Then help them build their own version one step at a time, reviewing each step against those files. Say plainly that the result is a learning exercise: a real product with accounts should still start from Core.
- **Comments** explain why, not just what.

## How to work

1. **Plan before code.** For any change bigger than a few lines, reply first with the files you'll create or change and anything you're unsure about. Wait for a go-ahead.
2. **One feature at a time.**
3. **Ask before running any terminal command.**
4. **When you finish, report** every file you changed and how to see it: through a local server (VS Code Live Server, `python -m http.server`, `php -S localhost:8000`, or XAMPP), never by double-clicking the HTML file.
5. **If something fails,** open the browser's developer tools console before guessing. A CSP violation, a module path typo and a failed `fetch()` all appear there.
6. **If a rule above gets in the way,** say which rule and why, and stop. Don't work around it.

## Review checklist

When asked to review code, or before calling a feature finished, check for and quote every place that:

1. uses inline JavaScript, `on*` attributes or `style=""`, or a page missing the CSP meta tag
2. puts data into `innerHTML`, or uses an unchecked value as an `href`
3. uses a root-relative path (`/something`)
4. calls `localStorage` without `try`/`catch`, or stores anything private in it
5. has a form field without a `<label>`, or an error message not linked by `aria-describedby`
6. uses a `<div>` or `<span>` where a `<button>`, `<a>` or other real element belongs
7. adds a dependency, framework or build step
8. adds server code, accounts or passwords (recommend the Backend Kit, Full-Stack Kit or VanillaSaaS Core instead)

Give the fix for each.

---

## This site

<!-- Describe your site: what it does, its pages, its data and anything an assistant should know before changing it. -->
