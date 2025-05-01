/**
 * Monaco Editor loader with progressive loading capabilities
 * 
 * This module handles dynamic loading of Monaco Editor features
 * to reduce the initial bundle size and improve loading performance.
 */

// First, import only the most essential core modules
let monacoPromise: Promise<typeof import('monaco-editor')> | null = null;
let monaco: typeof import('monaco-editor') | null = null;

// Languages we need for this app
const SUPPORTED_LANGUAGES = ['json', 'yaml', 'xml'];

// Load Monaco core and essential features
export const loadMonaco = async (): Promise<typeof import('monaco-editor')> => {
  // Return the cached instance if already loaded
  if (monaco) return monaco;
  
  // Return the existing promise if already loading
  if (monacoPromise) return monacoPromise;
  
  // Setup the monaco environment for workers
  if (typeof window !== 'undefined') {
    window.MonacoEnvironment = {
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

  // Use a more cautious loading approach to avoid initialization order issues
  monacoPromise = Promise.all([
    // Load core Monaco modules in a specific order to avoid initialization issues
    import('monaco-editor/esm/vs/editor/editor.api'),
    // Pre-load some essential Monaco modules to ensure they're available
    import('monaco-editor/esm/vs/base/common/platform'),
    import('monaco-editor/esm/vs/editor/common/core/range')
  ]).then(([monacoApi]) => {
    monaco = monacoApi;
    return monaco;
  });
  
  return monacoPromise;
};

// Load a specific language, only if needed
export const loadLanguage = async (
  language: string
): Promise<void> => {
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    console.warn(`Language '${language}' is not in the supported language list`);
    return;
  }
  
  // Ensure Monaco is loaded first
  await loadMonaco();
  
  // Dynamically load additional language features as needed
  switch (language) {
    case 'json':
      // JSON is built into Monaco core, nothing extra to load
      break;
    case 'yaml':
      try {
        // Load YAML language support
        await import('monaco-editor/esm/vs/basic-languages/yaml/yaml');
      } catch (e) {
        console.warn('Failed to load YAML language support:', e);
      }
      break;
    case 'xml':
      try {
        // Load XML/HTML language support
        await import('monaco-editor/esm/vs/basic-languages/xml/xml');
      } catch (e) {
        console.warn('Failed to load XML language support:', e);
      }
      break;
  }
};

export default {
  loadMonaco,
  loadLanguage
};