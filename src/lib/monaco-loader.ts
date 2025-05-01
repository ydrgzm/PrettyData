/**
 * Monaco Editor loader with progressive loading capabilities
 * 
 * This module handles dynamic loading of Monaco Editor features
 * to reduce the initial bundle size and improve loading performance.
 */

// Import the entire Monaco editor package - this ensures proper initialization
import * as monaco from 'monaco-editor';

// Languages we need for this app
const SUPPORTED_LANGUAGES = ['json', 'yaml', 'xml'];

// Setup the Monaco environment for workers
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

// A promise that resolves when language modules are ready
const languageLoadPromises: Record<string, Promise<void>> = {};

// Load a specific language, only if needed
export const loadLanguage = async (
  language: string
): Promise<void> => {
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    console.warn(`Language '${language}' is not in the supported language list`);
    return;
  }
  
  // Return existing promise if we're already loading this language
  if (languageLoadPromises[language]) {
    return languageLoadPromises[language];
  }
  
  // Monaco core is already imported at the top, so we know it's available

  // Dynamically load language support as needed
  switch (language) {
    case 'json':
      // JSON is built into Monaco core, nothing extra to load
      languageLoadPromises[language] = Promise.resolve();
      break;
      
    case 'yaml':
      // Load YAML language support
      languageLoadPromises[language] = import('monaco-editor/esm/vs/basic-languages/yaml/yaml.contribution')
        .catch(e => {
          console.warn('Failed to load YAML language support:', e);
        });
      break;
      
    case 'xml':
      // Load XML language support
      languageLoadPromises[language] = import('monaco-editor/esm/vs/basic-languages/xml/xml.contribution')
        .catch(e => {
          console.warn('Failed to load XML language support:', e);
        });
      break;
  }
  
  return languageLoadPromises[language];
};

export default monaco;