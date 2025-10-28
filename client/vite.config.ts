import path from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'

export default defineConfig({
  build: {
    sourcemap: true,
    rollupOptions: {
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  define: {
    global: 'globalThis',
  },
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@main': path.resolve(__dirname, 'src/features/main'),
      buffer: 'buffer',
      process: 'process/browser',
      util: 'util',
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      events: 'events',
    },
  },
  optimizeDeps: {
    include: [
      'buffer',
      'process',
      'util',
      'crypto-browserify',
      'stream-browserify',
      'events',
    ],
  },
});
