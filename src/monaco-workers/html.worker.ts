import * as monaco from 'monaco-editor';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';

// Only execute in browser environment
if (typeof self !== 'undefined') {
  self.MonacoEnvironment = {
    getWorker: function () {
      return new htmlWorker();
    }
  };
}