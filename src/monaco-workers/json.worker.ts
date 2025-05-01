import * as monaco from 'monaco-editor';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';

// Only execute in browser environment
if (typeof self !== 'undefined') {
  self.MonacoEnvironment = {
    getWorker: function () {
      return new jsonWorker();
    }
  };
}