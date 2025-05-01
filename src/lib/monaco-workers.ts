// This file handles the initialization of Monaco Editor workers
// to ensure they work properly when deployed to GitHub Pages

import * as monaco from 'monaco-editor';

// Only set up MonacoEnvironment in browser contexts
if (typeof self !== 'undefined') {
  // Need to tell Monaco where to load worker JS files from
  self.MonacoEnvironment = {
    getWorkerUrl: function (_moduleId: string, label: string) {
      // Use BASE_URL from Vite for GitHub Pages compatibility
      const baseUrl = import.meta.env.BASE_URL || '/';
      
      if (label === 'json') {
        return `${baseUrl}json.worker.js`;
      }
      if (label === 'css' || label === 'scss' || label === 'less') {
        return `${baseUrl}css.worker.js`;
      }
      if (label === 'html' || label === 'handlebars' || label === 'razor' || label === 'xml') {
        return `${baseUrl}html.worker.js`;
      }
      if (label === 'typescript' || label === 'javascript') {
        return `${baseUrl}ts.worker.js`;
      }
      
      // Default worker
      return `${baseUrl}editor.worker.js`;
    },
  };
}

// Export monaco so it's properly initialized
export { monaco };