import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';

// Only execute in browser environment
if (typeof self !== 'undefined') {
  self.MonacoEnvironment = {
    getWorker: function (_moduleId: string, label: string) {
      return new editorWorker();
    }
  };

  // Use try-catch to handle potential errors when accessing Monaco features
  try {
    monaco.editor.onDidCreateEditor(() => {
      // This is needed to make sure the editor worker is loaded
    });
  } catch (e) {
    console.warn('Monaco editor not fully initialized yet');
  }
}