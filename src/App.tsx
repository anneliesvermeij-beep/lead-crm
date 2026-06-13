import { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { DezeWeek } from './pages/DezeWeek';
import { LeadDetail } from './pages/LeadDetail';
import { AlleLeads } from './pages/AlleLeads';
import { Gazellen } from './pages/Gazellen';
import { Instellingen } from './pages/Instellingen';
import { Login } from './components/Login';
import { useSession } from './auth/useSession';
import { laadAlles, startRealtime, stopRealtime } from './store/leadStore';
import { laadInstellingen } from './store/instellingen';

// HashRouter: werkt op elke statische host (Vercel/Netlify/GitHub Pages) zonder
// server-config, en een refresh op /lead/:id blijft gewoon werken.
export default function App() {
  const { session, laden } = useSession();

  // Laad de leads pas ná inloggen (anders blokkeert de database via RLS).
  // Start daarna het realtime-abonnement zodat wijzigingen live binnenkomen.
  useEffect(() => {
    if (session) {
      void laadAlles();
      void laadInstellingen();
      startRealtime();
      return () => stopRealtime();
    }
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
        <Route path="/gazellen" element={<Gazellen />} />
        <Route path="/instellingen" element={<Instellingen />} />
        <Route path="/lead/:id" element={<LeadDetail />} />
      </Routes>
    </HashRouter>
  );
}
