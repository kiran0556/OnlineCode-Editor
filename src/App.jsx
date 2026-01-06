// src/App.jsx
import React, { useState, useMemo, useCallback, useEffect } from "react";

import EditorPanel from "./components/EditorPanel";
import Preview from "./components/Preview";
import Toolbar from "./components/Toolbar";
import { loadFromUrl, saveToUrl } from "./utils/share";
import { TEMPLATES } from "./utils/templates";
import "./App.css";

export default function App() {
  const [theme, setTheme] = useState("vs-dark");
  const [layout, setLayout] = useState("vertical"); // "vertical" | "horizontal"

  const [shareUrl, setShareUrl] = useState("");
  const [showToast, setShowToast] = useState(false);

  const initial = loadFromUrl() || {
    html: TEMPLATES.basic.html,
    css: TEMPLATES.basic.css,
    js: TEMPLATES.basic.js,
  };

  const [html, setHtml] = useState(initial.html);
  const [css, setCss] = useState(initial.css);
  const [js, setJs] = useState(initial.js);

  // which tab is active: "html" | "css" | "js"
  const [active, setActive] = useState("html");

  // console messages captured from iframe (currently unused, but kept)
  const [consoleLines, setConsoleLines] = useState([]);

  /* ---------- Share / Template / Download ---------- */

  const updateShareUrl = useCallback(() => {
    const url = saveToUrl({ html, css, js });

    if (url) {
      setShareUrl(url);
      setShowToast(true);

      // Hide toast automatically after 4 sec
      setTimeout(() => setShowToast(false), 4000);
    }

    return url;
  }, [html, css, js]);

  const onLoadTemplate = (name) => {
    const t = TEMPLATES[name];
    if (!t) return;
    setHtml(t.html);
    setCss(t.css);
    setJs(t.js);
  };

  const onDownload = () => {
    const content = `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${html}<script>${js}</script></body></html>`;
    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "snippet.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ---------- Build iframe document ---------- */

  const srcDoc = useMemo(
    () => `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      ${css || ""}
    </style>
  </head>
  <body>
    ${html || ""}
    <script>
      ${js || ""}
    </script>
  </body>
</html>`,
    [html, css, js]
  );

  /* ---------- Listen for console messages from iframe (currently no sender) ---------- */
  useEffect(() => {
    function onMessage(e) {
      const d = e.data;
      if (!d || !d.__cw_console) return;
      const level = d.level || "log";
      const args = d.args || [];
      const text = args
        .map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a)))
        .join(" ");
      setConsoleLines((prev) => {
        const next = [...prev, { level, text, ts: Date.now() }];
        if (next.length > 200) next.shift();
        return next;
      });
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const clearConsole = () => setConsoleLines([]);

  return (
    <div className="app">
      <Toolbar
        onShare={updateShareUrl}
        layout={layout}
        onLayoutChange={setLayout}
        onLoadTemplate={onLoadTemplate}
        theme={theme}
        onThemeToggle={() =>
          setTheme((t) => (t === "vs-dark" ? "light" : "vs-dark"))
        }
        onDownload={onDownload}
      />

      <main className={`content layout-${layout}`}>
        {/* editor + preview together so we can switch between stacked / side-by-side */}
        <div className="main-pane">
          {/* SINGLE tabbed editor card */}
          <section className="editor-wrapper">
            <EditorPanel
              active={active}
              setActive={setActive}
              html={html}
              setHtml={setHtml}
              css={css}
              setCss={setCss}
              js={js}
              setJs={setJs}
              theme={theme}
            />
          </section>

          {/* Live preview */}
          <section className="preview-area">
            <Preview srcDoc={srcDoc} />
          </section>
        </div>

        {/* Console output stays below */}
        <section className="console-area">
          <div className="console-header">
            <div>
              <span className="dot" /> Console
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn ghost" onClick={clearConsole}>
                Clear
              </button>
              <div className="small">{consoleLines.length} lines</div>
            </div>
          </div>
          <div className="console-body">
            {consoleLines.length === 0 ? (
              <div className="console-empty">
                Console output will appear here (console.log from preview)
              </div>
            ) : (
              consoleLines.map((ln, i) => (
                <div key={i} className="console-line">
                  <span className={`console-level ${ln.level}`}>
                    [{ln.level}]
                  </span>
                  <span className="console-text">{ln.text}</span>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* Share URL toast in corner */}
      {showToast && (
        <div className="share-toast">
          <div className="toast-content">
            <span className="toast-title">Share URL ready</span>
            <input type="text" value={shareUrl} readOnly />
            <button
              className="copy-btn"
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(shareUrl);
                }
              }}
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
