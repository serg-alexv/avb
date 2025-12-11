import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
            ui: ['framer-motion', 'lucide-react', 'clsx', 'tailwind-merge', '@radix-ui/react-slot', 'class-variance-authority'],
            firebase: ['firebase/app', 'firebase/firestore', 'firebase/auth', 'firebase/database', 'firebase/analytics'],
            ai: ['@google/genai']
          }
        }
      }
    }
  };
});
