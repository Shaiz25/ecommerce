import { defineConfig } from "vite";
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'
// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(),tailwindcss()],
	
	server: {
		proxy: {
			"/api": {
				target: "http://localhost:5000",
				
			},
		},
	},
	 build: {
    outDir: 'dist', // Optional: specify if framework/tool expects this
  }
});
