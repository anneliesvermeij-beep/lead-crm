import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { useLeads, useStoreStatus } from '../store/useLeads';
import { heeftNieuws, scoreTier } from '../logic/leadLogic';
import type { Branche, LeadStatus } from '../types';
import { BRANCHE_LABELS, STATUS_LABELS, STATUS_VOLGORDE } from '../types';
import { StatusBadge } from '../components/StatusBadge';

type StatusFilter = LeadStatus | 'alle';
type BrancheFilter = Branche | 'alle';
type SoortFilter = 'alle' | 'opvolging' | 'voorraad';

export function AlleLeads() {
  const leads = useLeads();
  const storeStatus = useStoreStatus();
  const navigate = useNavigate();

  const [zoek, setZoek] = useState('');
  const [status, setStatus] = useState<StatusFilter>('alle');
  const [branche, setBranche] = useState<BrancheFilter>('alle');
  const [soort, setSoort] = useState<SoortFilter>('alle');
  const [sorteer, setSorteer] = useState<'score' | 'naam' | 'nieuwste'>('score');

  const branches = useMemo(
    () => Array.from(new Set(leads.map((l) => l.branche))),
    [leads],
  );

  const resultaat = useMemo(() => {
    const z = zoek.trim().toLowerCase();
    return leads
      .filter((l) => {
        if (l.status === 'vervallen') return false; // vervallen tonen we nergens
        if ((l.bron ?? 'finder') !== 'finder') return false; // aparte bronnen: eigen tabblad
        if (status !== 'alle' && l.status !== status) return false;
        if (branche !== 'alle' && l.branche !== branche) return false;
        if (soort === 'opvolging' && !l.volgendeActieOp) return false;
        if (soort === 'voorraad' && l.volgendeActieOp) return false;
        if (z && !`${l.bedrijfsnaam} ${l.plaats ?? ''}`.toLowerCase().includes(z)) return false;
        return true;
      })
      .sort((a, b) => {
        if (sorteer === 'score') {
          return b.score - a.score || a.bedrijfsnaam.localeCompare(b.bedrijfsnaam, 'nl');
        }
        if (sorteer === 'nieuwste') {
          return (b.aangemaaktOp || '').localeCompare(a.aangemaaktOp || '');
        }
        return a.bedrijfsnaam.localeCompare(b.bedrijfsnaam, 'nl');
      });
  }, [leads, zoek, status, branche, soort, sorteer]);

  return (
    <div className="pagina">
      <header className="app-kop">
        <div className="app-kop-titel">
          <span className="studio-naam">Alle leads</span>
          <span className="app-kop-sub">{leads.length} in totaal</span>
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
        <select value={status} onChange={(e) => setStatus(e.target.value as StatusFilter)}>
          <option value="alle">Alle statussen</option>
          {STATUS_VOLGORDE.filter((s) => s !== 'vervallen').map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <select value={branche} onChange={(e) => setBranche(e.target.value as BrancheFilter)}>
          <option value="alle">Alle branches</option>
          {branches.map((b) => (
            <option key={b} value={b}>
              {BRANCHE_LABELS[b]}
            </option>
          ))}
        </select>
        <select value={soort} onChange={(e) => setSoort(e.target.value as SoortFilter)}>
          <option value="alle">Alles</option>
          <option value="opvolging">In opvolging</option>
          <option value="voorraad">Voorraad</option>
        </select>
        <select
          value={sorteer}
          onChange={(e) => setSorteer(e.target.value as 'score' | 'naam' | 'nieuwste')}
        >
          <option value="score">Sorteer: score</option>
          <option value="naam">Sorteer: naam</option>
          <option value="nieuwste">Sorteer: nieuwste</option>
        </select>
      </div>

      <p className="rustige-tekst" style={{ marginBottom: 10 }}>
        {storeStatus === 'laden' && leads.length === 0
          ? 'Bezig met laden…'
          : `${resultaat.length} resultaten`}
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
                {heeftNieuws(lead) && <span className="nieuws-badge" title="Recent nieuws">📰</span>}
              </span>
              <span className="rij-context">
                {BRANCHE_LABELS[lead.branche]}
                {lead.plaats ? ` · ${lead.plaats}` : ''}
                {!lead.volgendeActieOp ? ' · voorraad' : ''}
                {lead.aangemaaktOp
                  ? ` · toegevoegd ${format(new Date(lead.aangemaaktOp), 'd MMM', { locale: nl })}`
                  : ''}
              </span>
            </div>
            <StatusBadge status={lead.status} />
          </li>
        ))}
      </ul>
    </div>
  );
}
