import { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { DezeWeek } from './pages/DezeWeek';
import { LeadDetail } from './pages/LeadDetail';
import { AlleLeads } from './pages/AlleLeads';
import { Login } from './components/Login';
import { useSession } from './auth/useSession';
import { laadAlles } from './store/leadStore';

// HashRouter: werkt op elke statische host (Vercel/Netlify/GitHub Pages) zonder
// server-config, en een refresh op /lead/:id blijft gewoon werken.
export default function App() {
  const { session, laden } = useSession();

  // Laad de leads pas ná inloggen (anders blokkeert de database via RLS).
  useEffect(() => {
    if (session) void laadAlles();
  }, [session]);

  if (laden) {
    return (
      <div className="pagina">
        <p className="rustige-tekst">Bezig met laden…</p>
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<DezeWeek />} />
        <Route path="/alle" element={<AlleLeads />} />
        <Route path="/lead/:id" element={<LeadDetail />} />
      </Routes>
    </HashRouter>
  );
}
