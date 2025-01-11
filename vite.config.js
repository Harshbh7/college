import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: 'My PWA App',
        short_name: 'PWA App',
        description: 'A React + Vite PWA application',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'https://png.pngtree.com/thumb_back/fh260/background/20240724/pngtree-green-trees-and-a-cloudy-blue-sky-image_16036912.jpg',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'https://png.pngtree.com/thumb_back/fh260/background/20240724/pngtree-green-trees-and-a-cloudy-blue-sky-image_16036912.jpg',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'https://png.pngtree.com/thumb_back/fh260/background/20240724/pngtree-green-trees-and-a-cloudy-blue-sky-image_16036912.jpg',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
});
