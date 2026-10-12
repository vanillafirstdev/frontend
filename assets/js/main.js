// assets/js/main.js — entry module for index.html.
// Browsers resolve these imports themselves: no bundler, no node_modules.
import "./components/bookmark-card.js";
import { getBookmarks, addBookmark, removeBookmark, resetBookmarks } from "./lib/store.js";
import { validateBookmark, showErrors } from "./lib/validate.js";

const form = document.getElementById("bookmark-form");
const list = document.getElementById("bookmark-list");
const count = document.getElementById("bookmark-count");
const resetButton = document.getElementById("reset-bookmarks");

// The page's one piece of state. Every change replaces it and calls render().
let bookmarks = [];

function render() {
  const cards = bookmarks.map((bookmark) => {
    const card = document.createElement("bookmark-card");
    // setAttribute stores plain text; the component reads it back with textContent.
    card.setAttribute("bookmark-id", bookmark.id);
    card.setAttribute("label", bookmark.title);
    card.setAttribute("url", bookmark.url);
    card.setAttribute("note", bookmark.note || "");
    card.setAttribute("removable", "");
    return card;
  });

  if (cards.length === 0) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "No bookmarks yet. Add one above.";
    cards.push(empty);
  }

  list.replaceChildren(...cards);
  count.textContent = `(${bookmarks.length})`;
}

function warnIfNotSaved(saved) {
  if (!saved && !document.getElementById("storage-warning")) {
    const warning = document.createElement("p");
    warning.id = "storage-warning";
    warning.className = "notice";
    warning.textContent = "This browser is blocking storage, so changes will be lost when you leave the page.";
    list.before(warning);
  }
}

form.addEventListener("submit", (event) => {
  // Stop the browser sending the form anywhere: this page handles it.
  event.preventDefault();

  const errors = validateBookmark(form);
  showErrors(form, errors);
  if (Object.keys(errors).length > 0) return;

  const result = addBookmark(bookmarks, {
    title: form.elements.title.value,
    url: form.elements.url.value,
    note: form.elements.note.value,
  });
  bookmarks = result.bookmarks;
  warnIfNotSaved(result.saved);
  render();
  form.reset();
  form.elements.title.focus();
});

// One listener for every card's Remove button (event delegation).
list.addEventListener("bookmark-remove", (event) => {
  const result = removeBookmark(bookmarks, event.detail.id);
  bookmarks = result.bookmarks;
  warnIfNotSaved(result.saved);
  render();
});

resetButton.addEventListener("click", async () => {
  bookmarks = await resetBookmarks();
  render();
});

// Start: load saved bookmarks, or the starter list from data/bookmarks.json.
try {
  bookmarks = await getBookmarks();
  render();
} catch (error) {
  const message = document.createElement("p");
  message.className = "notice";
  message.textContent = `Couldn't load bookmarks: ${error.message}`;
  list.replaceChildren(message);
}
