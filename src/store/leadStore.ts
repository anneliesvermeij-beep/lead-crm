import type { Lead, ContactMoment } from '../types';
import { genId } from '../logic/leadLogic';
import { maakSeedLeads } from '../data/seed';
import { startOfDay } from 'date-fns';

/**
 * Kleine opslag-abstractie. Nu localStorage; later zonder UI-wijziging te
 * vervangen door een echte backend (zelfde functiehandtekeningen).
 *
 * Belangrijk: we houden één in-memory `cache`-array vast en geven die als
 * stabiele referentie terug via getLeads(). Pas bij een mutatie maken we een
 * NIEUWE array — zo werkt useSyncExternalStore zonder oneindige loop.
 */

const SLEUTEL = 'lead-crm:leads:v1';

type Luisteraar = () => void;
const luisteraars = new Set<Luisteraar>();

let cache: Lead[] | null = null;

function laad(): Lead[] {
  if (cache) return cache;
  try {
    const ruw = localStorage.getItem(SLEUTEL);
    if (ruw) {
      cache = JSON.parse(ruw) as Lead[];
      return cache;
    }
  } catch {
    // val terug op seed
  }
  cache = maakSeedLeads();
  bewaar(cache);
  return cache;
}

function bewaar(leads: Lead[]): void {
  localStorage.setItem(SLEUTEL, JSON.stringify(leads));
}

/** Zet de nieuwe lijst als cache (nieuwe referentie), persisteer en meld. */
function commit(leads: Lead[]): void {
  cache = leads;
  bewaar(leads);
  luisteraars.forEach((l) => l());
}

/** Abonneer op wijzigingen (voor React useSyncExternalStore). */
export function abonneer(luisteraar: Luisteraar): () => void {
  luisteraars.add(luisteraar);
  return () => {
    luisteraars.delete(luisteraar);
  };
}

export function getLeads(): Lead[] {
  return laad();
}

export function getLead(id: string): Lead | undefined {
  return laad().find((l) => l.id === id);
}

/** Slaat een bestaande lead op (vervangt op id); maakt een nieuwe array. */
export function saveLead(lead: Lead): Lead {
  const huidig = laad();
  const bestaat = huidig.some((l) => l.id === lead.id);
  const nieuw = bestaat
    ? huidig.map((l) => (l.id === lead.id ? lead : l))
    : [...huidig, lead];
  commit(nieuw);
  return lead;
}

export type NieuweLeadInvoer = Pick<
  Lead,
  'bedrijfsnaam' | 'branche' | 'plaats' | 'email' | 'telefoon' | 'website'
>;

/** Voegt een nieuwe lead toe: status 'nieuw', volgendeActieOp = vandaag. */
export function addLead(invoer: NieuweLeadInvoer): Lead {
  const nieuweLead: Lead = {
    id: genId(),
    bedrijfsnaam: invoer.bedrijfsnaam.trim(),
    branche: invoer.branche,
    plaats: invoer.plaats?.trim() || undefined,
    email: invoer.email?.trim() || undefined,
    telefoon: invoer.telefoon?.trim() || undefined,
    website: invoer.website?.trim() || undefined,
    status: 'nieuw',
    prioriteit: false,
    volgendeActieOp: startOfDay(new Date()).toISOString(),
    contactMomenten: [],
    aangemaaktOp: new Date().toISOString(),
  };
  commit([...laad(), nieuweLead]);
  return nieuweLead;
}

/** Voegt een contactmoment toe aan een lead (nieuwste boven in de UI). */
export function logContact(
  leadId: string,
  kanaal: ContactMoment['kanaal'],
  notitie: string,
): Lead | undefined {
  const moment: ContactMoment = {
    id: genId(),
    datum: new Date().toISOString(),
    kanaal,
    notitie: notitie.trim(),
  };
  let bijgewerkt: Lead | undefined;
  const nieuw = laad().map((l) => {
    if (l.id !== leadId) return l;
    bijgewerkt = { ...l, contactMomenten: [moment, ...l.contactMomenten] };
    return bijgewerkt;
  });
  if (bijgewerkt) commit(nieuw);
  return bijgewerkt;
}

/** Normaliseer voor lichte duplicaatcheck. */
function normaliseer(s: string | undefined): string {
  return (s ?? '')
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '')
    .trim();
}

/** Geeft een bestaande lead terug als naam of website al lijkt te bestaan. */
export function vindMogelijkDuplicaat(
  bedrijfsnaam: string,
  website?: string,
): Lead | undefined {
  const naam = normaliseer(bedrijfsnaam);
  const site = normaliseer(website);
  return laad().find((l) => {
    if (naam && normaliseer(l.bedrijfsnaam) === naam) return true;
    if (site && l.website && normaliseer(l.website) === site) return true;
    return false;
  });
}
