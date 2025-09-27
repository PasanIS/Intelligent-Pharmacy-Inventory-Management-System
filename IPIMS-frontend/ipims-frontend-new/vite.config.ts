import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // ADD THIS 'server' BLOCK FOR PROXYING
  server: {
    // Port 5175 is already running the React app
    // Add a proxy rule for all requests starting with /api
    proxy: {
      '/api': {
        target: 'http://localhost:8080', 
        changeOrigin: true, 
      
      },
    },
  },
  // END OF 'server' BLOCK
});
