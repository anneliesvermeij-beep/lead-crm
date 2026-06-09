import { useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { useLeads, useStoreStatus } from '../store/useLeads';
import { saveLead, logContact } from '../store/leadStore';
import { snooze, isDatumVerlopen } from '../logic/leadLogic';
import type { ContactMoment, Lead, LeadStatus } from '../types';
import { BRANCHE_LABELS, STATUS_LABELS, STATUS_VOLGORDE } from '../types';
import { Star } from '../components/Star';
import { SnoozeMenu } from '../components/SnoozeMenu';
import { MailOpstellen } from '../components/MailOpstellen';

export function LeadDetail() {
  const { id } = useParams();
  const leads = useLeads();
  const storeStatus = useStoreStatus();
  const navigate = useNavigate();
  const lead = useMemo(() => leads.find((l) => l.id === id), [leads, id]);

  const [mailOpen, setMailOpen] = useState(false);
  const [notitie, setNotitie] = useState('');
  const [kanaal, setKanaal] = useState<ContactMoment['kanaal']>('telefoon');

  if (!lead) {
    return (
      <div className="pagina">
        <p className="rustige-tekst">
          {storeStatus === 'laden' ? 'Bezig met laden…' : 'Lead niet gevonden.'}
        </p>
        <Link className="knop knop-rustig" to="/">
          ← Terug
        </Link>
      </div>
    );
  }

  function update(velden: Partial<Lead>) {
    saveLead({ ...(lead as Lead), ...velden });
  }

  function voegMomentToe() {
    if (!notitie.trim()) return;
    logContact(lead!.id, kanaal, notitie);
    setNotitie('');
  }

  const datumVerlopen = isDatumVerlopen(lead.volgendeActieOp);

  return (
    <div className="pagina">
      <div className="detail-terug">
        <button className="knop knop-rustig" onClick={() => navigate('/')}>
          ← Deze week
        </button>
      </div>

      <div className="kaart">
        {/* Kop */}
        <div className="detail-kop">
          <div className="avatar">{initialen(lead.bedrijfsnaam)}</div>
          <div className="detail-kop-tekst">
            <div className="detail-naam-rij">
              <Star
                actief={lead.prioriteit}
                onClick={() => update({ prioriteit: !lead.prioriteit })}
              />
              <h1>{lead.bedrijfsnaam}</h1>
            </div>
            <p className="detail-sub">
              {BRANCHE_LABELS[lead.branche]}
              {lead.plaats ? ` · ${lead.plaats}` : ''}
            </p>
          </div>
          <div className="detail-kop-acties">
            <button className="knop knop-primair" onClick={() => setMailOpen(true)}>
              Mail opstellen
            </button>
            <SnoozeMenu onSnooze={(h) => update(snooze(lead, h))} />
          </div>
        </div>

        {/* Contactregel */}
        <div className="contactregel">
          {lead.email ? (
            <a href={`mailto:${lead.email}`}>✉ {lead.email}</a>
          ) : (
            <span className="rustige-tekst">Geen e-mail</span>
          )}
          {lead.telefoon && <a href={`tel:${lead.telefoon}`}>☎ {lead.telefoon}</a>}
          {lead.website && (
            <a href={lead.website} target="_blank" rel="noreferrer">
              🔗 Website
            </a>
          )}
        </div>

        {/* Statusregel */}
        <div className="statusregel">
          <label className="veld veld-inline">
            <span>Status</span>
            <select
              value={lead.status}
              onChange={(e) => update({ status: e.target.value as LeadStatus })}
            >
              {STATUS_VOLGORDE.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </label>

          <label className="veld veld-inline">
            <span>Volgende actie op</span>
            <input
              type="date"
              className={datumVerlopen ? 'datum-verlopen' : ''}
              value={lead.volgendeActieOp ? lead.volgendeActieOp.slice(0, 10) : ''}
              onChange={(e) =>
                update({
                  volgendeActieOp: e.target.value
                    ? new Date(e.target.value).toISOString()
                    : undefined,
                })
              }
            />
          </label>
        </div>

        {/* Contactmomenten */}
        <div className="momenten">
          <h2 className="sectie-titel">Contactmomenten</h2>

          <div className="moment-invoer">
            <textarea
              rows={2}
              placeholder="Notitie toevoegen — wat besproken?"
              value={notitie}
              onChange={(e) => setNotitie(e.target.value)}
            />
            <div className="moment-invoer-acties">
              <select
                value={kanaal}
                onChange={(e) => setKanaal(e.target.value as ContactMoment['kanaal'])}
              >
                <option value="telefoon">Telefoon</option>
                <option value="email">E-mail</option>
                <option value="overig">Overig</option>
              </select>
              <button
                className="knop knop-rustig"
                onClick={voegMomentToe}
                disabled={!notitie.trim()}
              >
                Toevoegen
              </button>
            </div>
          </div>

          {lead.contactMomenten.length === 0 ? (
            <p className="rustige-tekst">Nog geen contactmomenten.</p>
          ) : (
            <ul className="tijdlijn">
              {lead.contactMomenten.map((m, i) => (
                <li key={m.id} className={`moment ${i === 0 ? 'moment-nieuwste' : ''}`}>
                  <div className="moment-notitie">{m.notitie}</div>
                  <div className="moment-meta">
                    {format(new Date(m.datum), 'd MMM yyyy', { locale: nl })} ·{' '}
                    {kanaalLabel(m.kanaal)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {mailOpen && (
        <MailOpstellen
          lead={lead}
          onSluit={() => setMailOpen(false)}
          onVerstuurd={() => setMailOpen(false)}
        />
      )}
    </div>
  );
}

function initialen(naam: string): string {
  return naam
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

function kanaalLabel(k: ContactMoment['kanaal']): string {
  return k === 'email' ? 'E-mail' : k === 'telefoon' ? 'Telefoon' : 'Overig';
}
