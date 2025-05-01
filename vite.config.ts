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
          // Handle Monaco Editor with a simplified approach to prevent dependency issues
          if (id.includes('monaco-editor')) {
            // Core editor API - this needs to be loaded first
            if (id.includes('/editor/editor.api')) {
              return 'monaco-editor-core';
            }
            
            // Base modules that are required by the editor
            if (id.includes('/base/')) {
              return 'monaco-base';
            }
            
            // Group language modules 
            if (id.includes('/basic-languages/')) {
              // Only separate the languages we actually use
              if (id.includes('/json/') || id.includes('/yaml/') || id.includes('/xml/')) {
                return 'monaco-used-languages';
              }
              return 'monaco-other-languages';
            }
            
            // Main editor functionality
            if (id.includes('/editor/')) {
              return 'monaco-editor-features';
            }
            
            // Other Monaco modules
            return 'monaco-extras';
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
