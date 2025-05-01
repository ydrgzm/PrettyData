import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/PrettyData/", // Base path for GitHub Pages
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    // Increase chunk size warning limit to 1000kB to avoid unnecessary warnings
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        "editor.worker": path.resolve(__dirname, 'src/monaco-workers/editor.worker.ts'),
        "json.worker": path.resolve(__dirname, 'src/monaco-workers/json.worker.ts'),
        "html.worker": path.resolve(__dirname, 'src/monaco-workers/html.worker.ts'),
      },
      output: {
        entryFileNames(chunkInfo) {
          return chunkInfo.name.includes('.worker')
            ? '[name].js'
            : 'assets/[name]-[hash].js';
        },
        // Implement more granular manual chunking for better code splitting
        manualChunks: (id) => {
          // Split Monaco Editor into smaller chunks
          if (id.includes('monaco-editor')) {
            if (id.includes('/language/')) {
              // Group by language features
              if (id.includes('/json/')) {
                return 'monaco-json';
              }
              if (id.includes('/html/')) {
                return 'monaco-html';
              }
              if (id.includes('/css/')) {
                return 'monaco-css';
              }
              if (id.includes('/typescript/')) {
                return 'monaco-ts';
              }
              return 'monaco-languages';
            }
            
            if (id.includes('/editor/contrib/')) {
              // Split editor contributions (features) into chunks
              if (id.includes('/snippet/')) {
                return 'monaco-feature-snippets';
              }
              if (id.includes('/hover/')) {
                return 'monaco-feature-hover';
              }
              if (id.includes('/codeAction/')) {
                return 'monaco-feature-actions';
              }
              if (id.includes('/inlineCompletions/')) {
                return 'monaco-feature-completions';
              }
              if (id.includes('/find/')) {
                return 'monaco-feature-find';
              }
              return 'monaco-features';
            }
            
            if (id.includes('/basic-languages/')) {
              return 'monaco-basic-languages';
            }
            
            // Core editor components
            if (id.includes('/editor/browser/')) {
              return 'monaco-editor-browser';
            }
            if (id.includes('/editor/common/')) {
              return 'monaco-editor-common';
            }
            if (id.includes('/editor/standalone/')) {
              return 'monaco-editor-standalone';
            }
            
            // Base platform components
            if (id.includes('/base/common/')) {
              return 'monaco-base-common';
            }
            if (id.includes('/base/browser/')) {
              return 'monaco-base-browser';
            }

            // Default for other Monaco files
            return 'monaco-core';
          }
          
          // Put React and related packages in the vendor chunk
          if (id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom/') || 
              id.includes('node_modules/scheduler/')) {
            return 'vendor-react';
          }
          
          // Put UI component library in its own chunk
          if (id.includes('@radix-ui/') || 
              id.includes('lucide-react/')) {
            return 'vendor-ui';
          }
          
          // Put formatter libraries in a separate chunk
          if (id.includes('node_modules/yaml') ||
              id.includes('node_modules/prettier') ||
              id.includes('node_modules/xml-formatter')) {
            return 'formatters';
          }
          
          // Default vendor chunking for other node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  },
}));
