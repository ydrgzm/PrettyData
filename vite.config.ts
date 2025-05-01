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
      }
    }
  },
}));
