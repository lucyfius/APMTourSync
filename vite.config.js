import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin']
      }
    })
  ],
  base: './',
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist',
    assetsDir: '.',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      external: [
        '@emotion/serialize',
        '@emotion/styled',
        '@emotion/react'
      ]
    },
    chunkSizeWarningLimit: 1000
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
}); 