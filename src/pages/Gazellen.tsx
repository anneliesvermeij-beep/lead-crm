import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeads, useStoreStatus } from '../store/useLeads';
import { scoreTier } from '../logic/leadLogic';
import { BRANCHE_LABELS } from '../types';
import { StatusBadge } from '../components/StatusBadge';

export function Gazellen() {
  const alle = useLeads();
  const storeStatus = useStoreStatus();
  const navigate = useNavigate();
  const [zoek, setZoek] = useState('');

  const resultaat = useMemo(() => {
    const z = zoek.trim().toLowerCase();
    return alle
      .filter((l) => l.bron === 'gazelle')
      .filter((l) => !z || `${l.bedrijfsnaam} ${l.plaats ?? ''}`.toLowerCase().includes(z))
      .sort((a, b) => b.score - a.score || a.bedrijfsnaam.localeCompare(b.bedrijfsnaam, 'nl'));
  }, [alle, zoek]);

  return (
    <div className="pagina">
      <header className="app-kop">
        <div className="app-kop-titel">
          <span className="studio-naam">Gazellen</span>
          <span className="app-kop-sub">FD Gazellen — snelgroeiende bedrijven</span>
        </div>
        <button className="knop knop-rustig" onClick={() => navigate('/')}>
          ← Deze week
        </button>
      </header>

      <div className="filterbalk">
        <input
          className="zoek"
          placeholder="Zoek op naam of plaats…"
          value={zoek}
          onChange={(e) => setZoek(e.target.value)}
        />
      </div>

      {storeStatus === 'laden' && alle.length === 0 ? (
        <p className="rustige-tekst">Bezig met laden…</p>
      ) : resultaat.length === 0 ? (
        <div className="leeg-vlak">
          <p>Nog geen Gazellen in de lijst.</p>
        </div>
      ) : (
        <>
          <p className="rustige-tekst" style={{ marginBottom: 10 }}>
            {resultaat.length} bedrijven
          </p>
          <ul className="lijst lijst-compact">
            {resultaat.map((lead) => (
              <li
                key={lead.id}
                className="rij rij-alle"
                onClick={() => navigate(`/lead/${lead.id}`)}
              >
                <span className={`score-bol ${scoreTier(lead.score)}`} title={`Score ${lead.score}`}>
                  {lead.score}
                </span>
                <div className="rij-midden">
                  <span className="rij-naam">
                    {lead.prioriteit && <span className="ster-inline">★</span>}
                    {lead.bedrijfsnaam}
                    {lead.email && (
                      <span className="mail-indicator" title={`E-mail bekend: ${lead.email}`}>
                        ✉
                      </span>
                    )}
                  </span>
                  <span className="rij-context">
                    {BRANCHE_LABELS[lead.branche]}
                    {' · '}
                    {lead.website ? new URL(lead.website).hostname.replace('www.', '') : 'geen website'}
                  </span>
                </div>
                <StatusBadge status={lead.status} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
