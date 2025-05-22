import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  //See public base path in vite guide
	base: './',
  
  plugins: [vue()],
})
