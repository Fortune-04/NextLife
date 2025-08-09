import { defineConfig } from 'vite';
import path from 'node:path';
import electron from 'vite-plugin-electron/simple';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    electron({
      main: {
        // Path to Electron main process entry (TypeScript)
        entry: 'electron/main.ts',
        vite: {
          build: {
            outDir: 'dist-electron',       // <- Compiled Electron output
            emptyOutDir: false             // <- Keep existing Vite dist/
          },
        },
      },
      preload: {
        // Path to preload script
        input: path.join(__dirname, 'electron/preload.ts'),
        vite: {
          build: {
            outDir: 'dist-electron',       // <- Keep preload with main
            emptyOutDir: false
          },
        },
      },
      renderer: {},
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',                        // <- React frontend output
  },
});
