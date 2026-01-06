// src/components/Preview.jsx
import React from "react";

export default function Preview({ srcDoc }) {
  return (
    <div className="preview">
      <div className="preview-header">
        <div>Live Preview</div>
        <div className="preview-subtitle">Sandboxed</div>
      </div>
      <iframe
        title="preview"
        className="preview-frame"
        srcDoc={srcDoc}
        // IMPORTANT: add allow-modals so alert() works
        sandbox="allow-scripts allow-same-origin allow-modals"
      />
    </div>
  );
}
