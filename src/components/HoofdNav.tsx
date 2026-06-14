import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

/**
 * Vaste hoofdnavigatie op de drie lijstschermen. De actieve tab is opgelicht,
 * zodat je altijd ziet waar je bent. 'Werkvoorraad' = wat nu opgevolgd moet
 * worden, 'Bureaus' = totale lijst, 'Opkomende Bedrijven' = catalogus.
 */
export function HoofdNav({ onNieuweLead }: { onNieuweLead?: () => void }) {
  const navigate = useNavigate();
  return (
    <nav className="hoofd-nav">
      <div className="hoofd-nav-tabs">
        <NavLink to="/" end className="nav-tab">
          Werkvoorraad
        </NavLink>
        <NavLink to="/alle" className="nav-tab">
          Bureaus
        </NavLink>
        <NavLink to="/gazellen" className="nav-tab">
          Opkomende Bedrijven
        </NavLink>
      </div>
      <div className="hoofd-nav-acties">
        {onNieuweLead && (
          <button className="knop knop-rustig" onClick={onNieuweLead}>
            + Nieuwe lead
          </button>
        )}
        <button className="knop knop-rustig" onClick={() => navigate('/instellingen')}>
          Instellingen
        </button>
        <button className="knop knop-rustig" onClick={() => supabase.auth.signOut()}>
          Uitloggen
        </button>
      </div>
    </nav>
  );
}
