import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base = '/lead-crm/' omdat de app op https://<gebruiker>.github.io/lead-crm/ staat.
export default defineConfig({
  base: '/lead-crm/',
  plugins: [react()],
});
