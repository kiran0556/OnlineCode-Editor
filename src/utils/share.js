// src/utils/share.js
import LZString from "lz-string";

const KEY = "codeShare";

export function saveToUrl({ html, css, js }) {
  try {
    const payload = JSON.stringify({ html, css, js });
    const compressed = LZString.compressToEncodedURIComponent(payload);
    const url = `${location.origin}${location.pathname}?code=${compressed}`;
    history.replaceState(null, "", url);
    localStorage.setItem(KEY, compressed);
    return url;
  } catch (e) {
    console.error("saveToUrl error", e);
    return null;
  }
}

export function loadFromUrl() {
  try {
    const params = new URLSearchParams(location.search);
    const code = params.get("code") || localStorage.getItem(KEY);
    if (!code) return null;
    const json = LZString.decompressFromEncodedURIComponent(code);
    if (!json) return null;
    return JSON.parse(json);
  } catch (e) {
    console.error("loadFromUrl error", e);
    return null;
  }
}
