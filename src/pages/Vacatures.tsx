import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { useLeads, useStoreStatus } from '../store/useLeads';
import { scoreTier } from '../logic/leadLogic';
import { BRANCHE_LABELS } from '../types';
import { StatusBadge } from '../components/StatusBadge';

export function Vacatures() {
  const alle = useLeads();
  const storeStatus = useStoreStatus();
  const navigate = useNavigate();
  const [zoek, setZoek] = useState('');

  const resultaat = useMemo(() => {
    const z = zoek.trim().toLowerCase();
    return alle
      .filter((l) => l.bron === 'vacature')
      .filter((l) => !z || `${l.bedrijfsnaam} ${l.plaats ?? ''}`.toLowerCase().includes(z))
      .sort((a, b) => b.score - a.score || a.bedrijfsnaam.localeCompare(b.bedrijfsnaam, 'nl'));
  }, [alle, zoek]);

  return (
    <div className="pagina">
      <header className="app-kop">
        <div className="app-kop-titel">
          <span className="studio-naam">Vacatures</span>
          <span className="app-kop-sub">Bedrijven die een fotograaf zoeken</span>
        </div>
        <button className="knop knop-rustig" onClick={() => navigate('/')}>
          ← Deze week
        </button>
      </header>

      <p className="rustige-tekst" style={{ marginBottom: 12 }}>
        Deze bedrijven hebben een vacature voor een fotograaf — een teken dat ze
        beeld nodig hebben. Ze staan los van je gewone leads.
      </p>

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
          <p>Nog geen vacature-bedrijven in de lijst.</p>
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
                  <span className="rij-naam">{lead.bedrijfsnaam}</span>
                  <span className="rij-context">
                    {BRANCHE_LABELS[lead.branche]}
                    {lead.plaats ? ` · ${lead.plaats}` : ''}
                    {lead.aangemaaktOp
                      ? ` · toegevoegd ${format(new Date(lead.aangemaaktOp), 'd MMM', { locale: nl })}`
                      : ''}
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
