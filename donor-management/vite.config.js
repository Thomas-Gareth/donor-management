import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: ".",  // Ensure it points to the project root
  plugins: [react()]
});
