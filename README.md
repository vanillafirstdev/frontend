# VanillaFirst Frontend Kit

> A zero-dependency, zero-build-step template for websites in plain HTML, CSS and JavaScript.

No `npm install`. No bundler, no transpiler, no framework, no server code. What you write is what the browser runs.

---

## Which one do I need?

The VanillaFirst Frontend, Backend and Full-Stack Kits and VanillaSaaS Core follow the same conventions, but they are different starting points. Choose one before you write any code.

Ask two questions: **does anything need saving on a server?** and **will anyone sign in?**

| Your project | Start from |
|---|---|
| Nothing is saved on a server: a portfolio, a static site, a front-end exercise, a page that reads someone else's API | **VanillaFirst Frontend Kit** |
| Data is saved on a server, but this project serves no pages: an API for a separate front end, a mobile app or another service | **VanillaFirst Backend Kit** |
| Data is saved on a server, the same project serves the pages, and nobody signs in: a content site with a contact form, docs, a calculator, an internal tool behind your host's password protection | **VanillaFirst Full-Stack Kit** |
| People sign in, and the public side is a few pages (home, pricing, terms) | **VanillaSaaS Core** on its own. A public page is a page that doesn't call `require_auth()`. |
| People sign in, and the public side is a real content site (docs, a blog, dozens of pages) | **Full-Stack Kit and Core, as two separate sites:** the kit at `example.com`, Core at `app.example.com`. The site's "Sign in" button links to the app. |

Moving between the kits is cheap, because they share files. The Frontend Kit's CSS, `validate.js` and `<bookmark-card>` are identical in the Full-Stack Kit; only its `localStorage` module is swapped for one that calls the server, and the Full-Stack Kit's `/client` page is exactly that swap. The Backend Kit's router, `Bookmark` rules and API controller are identical in the Full-Stack Kit, which serves the same JSON API. Moving between any kit and Core means rewriting every page, because the kits send every request through one front controller and a router, while Core uses one PHP file per address.

The kits double as a learning sequence: front end, back end, full stack. Core is not a fourth step in that sequence. It's where a real project with accounts starts, and its commented code is the reference to read when coursework asks you to build a login yourself.

Don't add registration, login or passwords to any kit. Accounts need password hashing, reset tokens that expire, rate limiting on sign-in, session timeouts, and every query scoped to the user who owns the row. Core has all of that written, commented and free under the MIT licence. Starting on a kit because it looks simpler, then bolting on a login in month two, is the mistake this section exists to prevent.

[Frontend Kit](https://github.com/vanillafirstdev/frontend) · [Backend Kit](https://github.com/vanillafirstdev/backend) · [Full-Stack Kit](https://github.com/vanillafirstdev/fullstack) · [VanillaSaaS Core](https://vanillasaas.dev)

---

## Quick start

Download or clone the kit, then open it **through a local web server**:

| You have | Run | Then open |
|---|---|---|
| VS Code | Install the Live Server extension, right-click `index.html`, "Open with Live Server" | the tab it opens |
| Python | `python -m http.server 8000` in the kit's folder | `http://localhost:8000` |
| PHP | `php -S localhost:8000` in the kit's folder | `http://localhost:8000` |
| XAMPP | put the folder in `htdocs` | `http://localhost/<folder>/` |

Edit any file and refresh.

**Why not just double-click `index.html`?** The page opens from a `file://` address, and browsers refuse to load ES modules or `fetch()` JSON from `file://` (both count as cross-origin requests with no origin to compare). The HTML and CSS still appear, so it looks half-working: the list says "Loading bookmarks…" and never changes. That message is there on purpose. If you see it stay, you're on `file://`.

---

## What's in the box

A bookmark list that exercises every layer once:

- **HTML:** two pages with semantic landmarks, labelled form fields, `aria-current` on the active link, and a fallback message that stays visible if JavaScript fails.
- **CSS:** design tokens as custom properties, native nesting, Grid, a container query (each card sizes its buttons by its own width), automatic dark mode, and hover effects only when the visitor hasn't asked for reduced motion.
- **Modules:** `main.js` imports `lib/store.js` (data) and `lib/validate.js` (form checks). The browser resolves the imports itself.
- **Data:** the starter list is `data/bookmarks.json`, read with `fetch()`. Changes are saved in `localStorage`, with every call wrapped in `try`/`catch` and a visible warning when the browser blocks storage.
- **Forms:** rules live in HTML attributes (`required`, `maxlength`, `type="url"`). JavaScript asks the browser with `checkValidity()`, adds the one rule HTML can't express (only `http(s)` addresses, because `type="url"` accepts `javascript:`), and shows each message beside its field.
- **Web Component:** `<bookmark-card>` builds its DOM with `textContent`, so stored data is never parsed as HTML. It opens a native `<dialog>` and announces removal with a `CustomEvent` that one listener on the list handles.
- **Security:** a Content-Security-Policy `<meta>` tag on every page, so no inline script or style runs. That's why the kit has none.
- **AI instructions:** `AGENTS.md` tells Copilot, Cursor, Codex and Claude Code the rules of this codebase and how to review against them.

---

## Directory structure

```text
my-site/
├── index.html                  # Home: the bookmark list
├── about.html                  # A second page, to copy for new ones
├── AGENTS.md / CLAUDE.md       # Instructions for AI coding assistants
├── assets/
│   ├── css/
│   │   ├── main.css            # Tokens, layout, dark mode
│   │   └── components.css      # Buttons, cards, forms, dialog
│   └── js/
│       ├── main.js             # Entry module for index.html
│       ├── lib/
│       │   ├── store.js        # fetch() the starter list, save to localStorage
│       │   └── validate.js     # checkValidity(), isWebUrl(), field messages
│       └── components/
│           └── bookmark-card.js
└── data/
    └── bookmarks.json          # Starter data
```

---

## Adding a page

1. Copy `about.html` to `contact.html`. Keep the CSP `<meta>` tag as it is.
2. Change the `<title>`, the content, and which nav link has `aria-current="page"`.
3. Add `<li><a href="contact.html">Contact</a></li>` to the nav in every page.

Link to it as `contact.html`, not `/contact.html`. Relative links are what make the site work in a subfolder and on GitHub Pages.

---

## Deployment

Upload the folder to any static host: GitHub Pages, Netlify (drag the folder onto its dashboard), Cloudflare Pages, or the `public_html` folder of shared hosting. There is nothing to build first.

GitHub Pages serves project sites from a subfolder (`username.github.io/my-site/`). Every path in the kit is relative, so that works unchanged.

---

## Limits you should know

- **`localStorage` is one browser on one device.** Another visitor, another browser or a cleared cache sees the starter list. Data that should be shared, or that must survive, belongs on a server: that's the Backend or Full-Stack Kit.
- **Never put anything private in `localStorage`.** Any script on the page can read it.
- **Some protection needs real headers.** A `<meta>` CSP can't set `frame-ancestors`, so it can't stop other sites putting yours in an `<iframe>`. If that matters, set the header on your host (Netlify `_headers`, Cloudflare Pages `_headers`, or Apache `.htaccess`).
- **One file per page means repeated headers and footers.** Change the nav and you change it in every page. That's the trade for having no build step and no server. When it starts to hurt, the Full-Stack Kit's layout file solves it.

---

## From this kit to the Backend and Full-Stack Kits

The Backend Kit serves the same bookmarks as a JSON API, and the Full-Stack Kit builds the same list with PHP pages and SQLite. Compare them to see exactly what a back end adds: the list moves from `localStorage` to a database every visitor shares, `data/bookmarks.json` becomes `GET /api/bookmarks`, and the `http(s)` check runs on the server as well, because anything in the browser can be bypassed. Your CSS, `validate.js` and the component are already in the Full-Stack Kit, byte for byte. Its `/client` page is this kit's page with `store.js` swapped for `api.js`: `localStorage` calls become `fetch()` calls, each one async because each is a network round trip that can fail, and the server checks every rule again because anything in the browser can be bypassed.

---

## License

MIT. Free for personal, open-source and commercial use.
