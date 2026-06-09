import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { laadAlles } from './store/leadStore';

// Laad de leads één keer uit Supabase bij het opstarten.
void laadAlles();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
