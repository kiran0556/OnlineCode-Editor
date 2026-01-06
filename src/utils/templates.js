// src/utils/templates.js
export const TEMPLATES = {
  basic: {
    html: "<h1>Hello world</h1><p>Edit the code!</p>",
    css: "body { font-family: Arial, sans-serif; padding: 20px; }",
    js: "console.log('Welcome to CodeWave');"
  },
  reactLike: {
    html: '<div id="root"></div>',
    css: `
      body { margin: 0; font-family: system-ui, sans-serif; }
      #root { padding: 20px; }
    `,
    js: `
      const root = document.getElementById("root");
      root.innerHTML = "<h1>React-like Template</h1><p>Start coding JS here.</p>";
      console.log("React-like template loaded");
    `
  }
};
