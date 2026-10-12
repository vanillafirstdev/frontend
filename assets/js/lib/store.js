// assets/js/lib/store.js — where bookmarks live.
//
// The starter list comes from data/bookmarks.json. Once the visitor changes
// anything, the whole list is saved in localStorage under one key.
//
// localStorage belongs to ONE browser on ONE device. Clear site data, switch
// browser or open a private window, and the list is back to the starter set.
// That limit is the reason the full-stack kit exists: there, the list lives in
// SQLite on a server, so everyone sees the same data.

const KEY = "vf-bookmarks";

// localStorage can throw: blocked storage, private modes, a full quota.
// Every access is wrapped so the page still works, just without saving.
function readSaved() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw === null ? null : JSON.parse(raw);
  } catch {
    return null;
  }
}

function save(bookmarks) {
  try {
    localStorage.setItem(KEY, JSON.stringify(bookmarks));
    return true;
  } catch {
    return false;
  }
}

// Relative URL, so it works at a domain root, in a subfolder, or on GitHub Pages.
async function loadStarterList() {
  const response = await fetch("data/bookmarks.json");
  if (!response.ok) throw new Error(`HTTP ${response.status} loading data/bookmarks.json`);
  return response.json();
}

export async function getBookmarks() {
  const saved = readSaved();
  if (Array.isArray(saved)) return saved;
  return loadStarterList();
}

// crypto.randomUUID() only exists on https:// and http://localhost ("secure
// contexts"). Opened at http://192.168.x.x on a phone, the fallback is used.
function newId() {
  return crypto.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

// Each function returns the new list and whether it was saved, so the page
// can say so when storage is unavailable instead of failing silently.
export function addBookmark(bookmarks, { title, url, note }) {
  const next = [{ id: newId(), title, url, note }, ...bookmarks];
  return { bookmarks: next, saved: save(next) };
}

export function removeBookmark(bookmarks, id) {
  const next = bookmarks.filter((bookmark) => bookmark.id !== id);
  return { bookmarks: next, saved: save(next) };
}

export async function resetBookmarks() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Nothing saved, or storage blocked: either way the starter list is next.
  }
  return loadStarterList();
}
