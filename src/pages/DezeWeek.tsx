import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { useLeads, useStoreStatus } from '../store/useLeads';
import { saveLead } from '../store/leadStore';
import {
  isVandaagBucket,
  isLaterDezeWeek,
  isVerlopen,
  sorteerVandaag,
  sorteerLaterDezeWeek,
  snooze,
} from '../logic/leadLogic';
import type { Lead } from '../types';
import { BRANCHE_LABELS } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { MetricTile } from '../components/MetricTile';
import { Star } from '../components/Star';
import { SnoozeMenu } from '../components/SnoozeMenu';
import { NieuweLeadForm } from '../components/NieuweLeadForm';
import { MailOpstellen } from '../components/MailOpstellen';

export function DezeWeek() {
  const leads = useLeads();
  const storeStatus = useStoreStatus();
  const navigate = useNavigate();
  const [nieuwOpen, setNieuwOpen] = useState(false);
  const [mailLead, setMailLead] = useState<Lead | null>(null);

  const vandaag = useMemo(
    () => sorteerVandaag(leads.filter((l) => isVandaagBucket(l))),
    [leads],
  );
  const later = useMemo(
    () => sorteerLaterDezeWeek(leads.filter((l) => isLaterDezeWeek(l))),
    [leads],
  );

  const metrics = useMemo(() => {
    const vandaagAantal = leads.filter((l) => isVandaagBucket(l)).length;
    const dezeWeek = leads.filter(
      (l) => isVandaagBucket(l) || isLaterDezeWeek(l),
    ).length;
    const inGesprek = leads.filter((l) => l.status === 'in_gesprek').length;
    const klant = leads.filter((l) => l.status === 'klant').length;
    return { vandaagAantal, dezeWeek, inGesprek, klant };
  }, [leads]);

  function doeSnooze(lead: Lead, hoeveel: '1week' | '1maand') {
    saveLead(snooze(lead, hoeveel));
  }

  function wisselPrioriteit(lead: Lead) {
    saveLead({ ...lead, prioriteit: !lead.prioriteit });
  }

  const heeftLeads = leads.length > 0;
  const aanHetLaden = storeStatus === 'laden' && !heeftLeads;
  const laadFout = storeStatus === 'fout' && !heeftLeads;

  return (
    <div className="pagina">
      <header className="app-kop">
        <div className="app-kop-titel">
          <span className="studio-naam">Photography &amp; Images</span>
          <span className="app-kop-sub">Deze week</span>
        </div>
        <button className="knop knop-rustig" onClick={() => setNieuwOpen(true)}>
          + Nieuwe lead
        </button>
      </header>

      <section className="metrics">
        <MetricTile
          label="Vandaag opvolgen"
          waarde={metrics.vandaagAantal}
          toon="danger"
        />
        <MetricTile label="Deze week" waarde={metrics.dezeWeek} />
        <MetricTile label="In gesprek" waarde={metrics.inGesprek} />
        <MetricTile label="Klant geworden" waarde={metrics.klant} toon="success" />
      </section>

      {aanHetLaden ? (
        <div className="leeg-vlak">
          <p>Bezig met laden…</p>
        </div>
      ) : laadFout ? (
        <div className="leeg-vlak">
          <p>Kon de leads niet laden. Ververs de pagina of probeer het later opnieuw.</p>
        </div>
      ) : !heeftLeads ? (
        <div className="leeg-vlak">
          <p>Nog geen leads.</p>
          <button className="knop knop-primair" onClick={() => setNieuwOpen(true)}>
            Voeg je eerste lead toe →
          </button>
        </div>
      ) : (
        <>
          <section className="sectie">
            <h2 className="sectie-titel">Vandaag — actie nodig</h2>
            {vandaag.length === 0 ? (
              <p className="rustige-tekst">Niets om vandaag op te volgen.</p>
            ) : (
              <ul className="lijst">
                {vandaag.map((lead) => (
                  <VandaagRij
                    key={lead.id}
                    lead={lead}
                    onOpen={() => navigate(`/lead/${lead.id}`)}
                    onMail={() => setMailLead(lead)}
                    onSnooze={(h) => doeSnooze(lead, h)}
                    onPrioriteit={() => wisselPrioriteit(lead)}
                  />
                ))}
              </ul>
            )}
          </section>

          <section className="sectie">
            <h2 className="sectie-titel">Later deze week</h2>
            {later.length === 0 ? (
              <p className="rustige-tekst">Niets later deze week.</p>
            ) : (
              <ul className="lijst lijst-compact">
                {later.map((lead) => (
                  <li
                    key={lead.id}
                    className="rij rij-compact"
                    onClick={() => navigate(`/lead/${lead.id}`)}
                  >
                    <span className="rij-naam">
                      {lead.prioriteit && <span className="ster-inline">★</span>}
                      {lead.bedrijfsnaam}
                    </span>
                    <span className="rij-datum">{datumLabel(lead)}</span>
                    <StatusBadge status={lead.status} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}

      {nieuwOpen && (
        <NieuweLeadForm
          onSluit={() => setNieuwOpen(false)}
          onToegevoegd={(id) => {
            setNieuwOpen(false);
            navigate(`/lead/${id}`);
          }}
        />
      )}

      {mailLead && (
        <MailOpstellen
          lead={mailLead}
          onSluit={() => setMailLead(null)}
          onVerstuurd={() => setMailLead(null)}
        />
      )}
    </div>
  );
}

function VandaagRij({
  lead,
  onOpen,
  onMail,
  onSnooze,
  onPrioriteit,
}: {
  lead: Lead;
  onOpen: () => void;
  onMail: () => void;
  onSnooze: (h: '1week' | '1maand') => void;
  onPrioriteit: () => void;
}) {
  const verlopen = isVerlopen(lead);
  return (
    <li className={`rij ${verlopen ? 'rij-verlopen' : ''}`} onClick={onOpen}>
      <div className="rij-links" onClick={(e) => e.stopPropagation()}>
        <Star actief={lead.prioriteit} onClick={onPrioriteit} />
      </div>
      <div className="rij-midden" onClick={onOpen}>
        <span className="rij-naam">{lead.bedrijfsnaam}</span>
        <span className="rij-context">
          {BRANCHE_LABELS[lead.branche]} · {datumLabel(lead)}
        </span>
      </div>
      <StatusBadge status={lead.status} />
      <div className="rij-acties" onClick={(e) => e.stopPropagation()}>
        {lead.telefoon && (
          <a
            className="icoon-knop"
            href={`tel:${lead.telefoon}`}
            title="Bellen"
            onClick={(e) => e.stopPropagation()}
          >
            ☎
          </a>
        )}
        <button className="icoon-knop" title="Mailen" onClick={onMail}>
          ✉
        </button>
        <SnoozeMenu onSnooze={onSnooze} />
      </div>
    </li>
  );
}

function datumLabel(lead: Lead): string {
  if (!lead.volgendeActieOp) return 'geen datum';
  const d = new Date(lead.volgendeActieOp);
  const prefix = isVerlopen(lead) ? 'Verlopen: ' : '';
  return prefix + format(d, 'd MMM', { locale: nl });
}
