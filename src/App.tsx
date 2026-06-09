import { HashRouter, Routes, Route } from 'react-router-dom';
import { DezeWeek } from './pages/DezeWeek';
import { LeadDetail } from './pages/LeadDetail';

// HashRouter: werkt op elke statische host (Vercel/Netlify/GitHub Pages) zonder
// server-config, en een refresh op /lead/:id blijft gewoon werken.
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<DezeWeek />} />
        <Route path="/lead/:id" element={<LeadDetail />} />
      </Routes>
    </HashRouter>
  );
}
