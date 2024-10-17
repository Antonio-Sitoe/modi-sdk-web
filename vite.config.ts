import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  base: '/', // Certifique-se que isso esteja correto,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Aqui você define o alias '@' para apontar para 'src'
    },
  },
});
