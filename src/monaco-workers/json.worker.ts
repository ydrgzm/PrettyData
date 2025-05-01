import * as monaco from 'monaco-editor';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';

self.MonacoEnvironment = {
  getWorker: function () {
    return new jsonWorker();
  }
};