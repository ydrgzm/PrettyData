import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';

self.MonacoEnvironment = {
  getWorker: function (_moduleId: string, label: string) {
    return new editorWorker();
  }
};

monaco.editor.onDidCreateEditor(() => {
  // This is needed to make sure the editor worker is loaded
});