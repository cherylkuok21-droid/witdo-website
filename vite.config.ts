import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      optimizeDeps: {
        include: ['firebase/app', 'firebase/firestore', 'firebase/auth', 'react-signature-canvas', 'signature_pad']
      },
      ssr: {
        noExternal: ['firebase', 'react-signature-canvas', 'signature_pad']
      },
      build: {
        commonjsOptions: {
          include: [/react-signature-canvas/, /signature_pad/, /node_modules/],
          transformMixedEsModules: true
        }
      },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
          'react-signature-canvas': path.resolve(__dirname, 'node_modules/react-signature-canvas/build/index.js'),
        }
      }
    };
});
