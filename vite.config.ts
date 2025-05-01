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
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 2000,
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
        // Simpler manual chunking strategy to prevent dependency issues
        manualChunks: (id) => {
          // Keep all Monaco editor related code in one chunk to avoid dependency issues
          if (id.includes('monaco-editor')) {
            return 'monaco-editor';
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
          
          // Default vendor chunking for other node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  },
}));
