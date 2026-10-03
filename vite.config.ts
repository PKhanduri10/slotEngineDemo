import { defineConfig } from 'vite';

export default defineConfig({
    base: '/slotEngineDemo/',
    root: './',
    publicDir: 'public',
    build: {
        outDir: 'dist',
        sourcemap: true,
        target: 'esnext'
    },
    server: {
        port: 3000,
        open: true
    }
});