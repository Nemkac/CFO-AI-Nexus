import { defineConfig } from 'vite'
import { resolve } from 'path'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    plugins: [
        tsconfigPaths({ projects: ['./tsconfig.json'] }),
        tailwindcss(),
        viteReact(),
    ],
    build: {
        rollupOptions: {
            input: resolve(__dirname, 'promo.html'),
        },
        outDir: 'dist-promo',
        emptyOutDir: true,
    },
    server: {
        port: 3001,
        open: '/promo.html',
    },
})
