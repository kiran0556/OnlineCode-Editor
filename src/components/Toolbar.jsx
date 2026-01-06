// src/components/Toolbar.jsx
import React from "react";

export default function Toolbar({
  onShare,
  layout,
  onLayoutChange,
  onLoadTemplate,
  theme,
  onThemeToggle,
  onDownload,
}) {

  // ✅ Correct Share Handler
  const handleShareClick = () => {
    const url = onShare(); // GET URL from App

    if (!url) return;

    // Copy URL to clipboard
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(url)
        .then(() => alert("Share URL copied to clipboard!"))
        .catch(() => window.prompt("Copy this URL manually:", url));
    } else {
      window.prompt("Copy this URL:", url);
    }
  };

  return (
    <div className="toolbar">

      {/* LEFT SECTION */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div className="brand">
          <div className="logo" /> coolcode
        </div>

        {/* Layout Dropdown */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="small">Layout</span>
          <select
            className="select"
            value={layout}
            onChange={(e) => onLayoutChange(e.target.value)}
          >
            <option value="vertical">Verticle view </option>
            <option value="horizontal">Horizontal view  </option>
          </select>
        </div>

        {/* Template Dropdown */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="small">Template</span>
          <select
            className="select"
            onChange={(e) => onLoadTemplate(e.target.value)}
          >
            <option value="">Blank</option>
            <option value="basic">Basic</option>
            <option value="reactLike">React-like</option>
          </select>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
         
          <button className="btn ghost" onClick={onThemeToggle}>
            {theme === "vs-dark" ? "Light" : "Dark "}
          </button>
        </div>

        {/* Share Button (FIXED) */}
        <button className="btn" onClick={handleShareClick}>
          Share
        </button>

        <button className="btn download" onClick={onDownload}>
          Download
        </button>
      </div>
    </div>
  );
}
