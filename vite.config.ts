import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
    base: '/japanese-characters',
    plugins: [react({ babel: { plugins: [['babel-plugin-react-compiler']] } }), tailwindcss()],
    resolve: {
        alias: {
            '@/convex': path.resolve(__dirname, './convex'),
            '@': path.resolve(__dirname, './src')
        }
    }
})
