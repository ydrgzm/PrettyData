import * as monaco from 'monaco-editor';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';

self.MonacoEnvironment = {
  getWorker: function () {
    return new htmlWorker();
  }
};