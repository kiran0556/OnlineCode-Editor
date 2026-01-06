// src/components/EditorPanel.jsx
import React from "react";
import Editor from "@monaco-editor/react";

export default function EditorPanel({
  active,
  setActive,
  html,
  setHtml,
  css,
  setCss,
  js,
  setJs,
  theme,
}) {
  const options = {
    minimap: { enabled: false },
    automaticLayout: true,
    wordWrap: "on",
    fontSize: 13,
    scrollBeyondLastLine: false,
    lineNumbers: "on",
  };

  const renderEditor = () => {
    if (active === "html") {
      return (
        <Editor
          language="html"
          value={html}
          onChange={(v) => setHtml(v || "")}
          theme={theme}
          options={options}
        />
      );
    }
    if (active === "css") {
      return (
        <Editor
          language="css"
          value={css}
          onChange={(v) => setCss(v || "")}
          theme={theme}
          options={options}
        />
      );
    }
    return (
      <Editor
        language="javascript"
        value={js}
        onChange={(v) => setJs(v || "")}
        theme={theme}
        options={options}
      />
    );
  };

  return (
    <div className="editor-card">
      {/* Tabs row */}
      <div className="editor-tabs" role="tablist" aria-label="Code tabs">
        <button
          type="button"
          className={`tab ${active === "html" ? "active" : ""}`}
          onClick={() => setActive("html")}
        >
          HTML
        </button>
        <button
          type="button"
          className={`tab ${active === "css" ? "active" : ""}`}
          onClick={() => setActive("css")}
        >
          CSS
        </button>
        <button
          type="button"
          className={`tab ${active === "js" ? "active" : ""}`}
          onClick={() => setActive("js")}
        >
          JS
        </button>
      </div>

      {/* Monaco editor area */}
      <div className="editor-body">{renderEditor()}</div>
    </div>
  );
}
