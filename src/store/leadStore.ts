import type { Lead, ContactMoment } from '../types';
import { genId } from '../logic/leadLogic';
import { supabase, CRM_TABEL } from '../supabaseClient';

/**
 * Opslag via Supabase. Zelfde functienamen als voorheen, zodat de schermen
 * onveranderd blijven.
 *
 * Aanpak: we houden één in-memory `cache` aan (stabiele referentie voor
 * useSyncExternalStore). Bij opstarten laden we alles één keer. Mutaties
 * passen we direct in de cache toe (zodat het scherm meteen reageert) en
 * schrijven we op de achtergrond naar Supabase.
 */

export type StoreStatus = 'laden' | 'klaar' | 'fout';

type Luisteraar = () => void;
const luisteraars = new Set<Luisteraar>();

let cache: Lead[] = [];
let status: StoreStatus = 'laden';

function meld(): void {
  luisteraars.forEach((l) => l());
}

export function abonneer(luisteraar: Luisteraar): () => void {
  luisteraars.add(luisteraar);
  return () => {
    luisteraars.delete(luisteraar);
  };
}

export function getLeads(): Lead[] {
  return cache;
}

export function getStatus(): StoreStatus {
  return status;
}

export function getLead(id: string): Lead | undefined {
  return cache.find((l) => l.id === id);
}

// --- Mapping tussen Lead (camelCase) en de Supabase-rij (snake_case) --------

interface CrmRij {
  id: string;
  bedrijfsnaam: string;
  branche: Lead['branche'];
  plaats: string | null;
  email: string | null;
  telefoon: string | null;
  website: string | null;
  status: Lead['status'];
  prioriteit: boolean;
  volgende_actie_op: string | null;
  contact_momenten: ContactMoment[] | null;
  aangemaakt_op: string;
}

function vanRij(r: CrmRij): Lead {
  return {
    id: r.id,
    bedrijfsnaam: r.bedrijfsnaam,
    branche: r.branche,
    plaats: r.plaats ?? undefined,
    email: r.email ?? undefined,
    telefoon: r.telefoon ?? undefined,
    website: r.website ?? undefined,
    status: r.status,
    prioriteit: r.prioriteit,
    volgendeActieOp: r.volgende_actie_op ?? undefined,
    contactMomenten: r.contact_momenten ?? [],
    aangemaaktOp: r.aangemaakt_op,
  };
}

function naarRij(l: Lead): CrmRij {
  return {
    id: l.id,
    bedrijfsnaam: l.bedrijfsnaam,
    branche: l.branche,
    plaats: l.plaats ?? null,
    email: l.email ?? null,
    telefoon: l.telefoon ?? null,
    website: l.website ?? null,
    status: l.status,
    prioriteit: l.prioriteit,
    volgende_actie_op: l.volgendeActieOp ?? null,
    contact_momenten: l.contactMomenten,
    aangemaakt_op: l.aangemaaktOp,
  };
}

// --- Laden ------------------------------------------------------------------

export async function laadAlles(): Promise<void> {
  status = 'laden';
  meld();
  const { data, error } = await supabase.from(CRM_TABEL).select('*');
  if (error) {
    console.error('Supabase laden mislukt:', error.message);
    status = 'fout';
    meld();
    return;
  }
  cache = (data as CrmRij[]).map(vanRij);
  status = 'klaar';
  meld();
}

function zetCache(next: Lead[]): void {
  cache = next;
  meld();
}

async function schrijf(lead: Lead): Promise<void> {
  const { error } = await supabase.from(CRM_TABEL).upsert(naarRij(lead));
  if (error) console.error('Supabase opslaan mislukt:', error.message);
}

// --- Mutaties (optimistisch: eerst cache, dan Supabase) ---------------------

export function saveLead(lead: Lead): Lead {
  const bestaat = cache.some((l) => l.id === lead.id);
  zetCache(bestaat ? cache.map((l) => (l.id === lead.id ? lead : l)) : [...cache, lead]);
  void schrijf(lead);
  return lead;
}

export type NieuweLeadInvoer = Pick<
  Lead,
  'bedrijfsnaam' | 'branche' | 'plaats' | 'email' | 'telefoon' | 'website'
>;

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
    volgendeActieOp: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
    contactMomenten: [],
    aangemaaktOp: new Date().toISOString(),
  };
  zetCache([...cache, nieuweLead]);
  void schrijf(nieuweLead);
  return nieuweLead;
}

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
  const next = cache.map((l) => {
    if (l.id !== leadId) return l;
    bijgewerkt = { ...l, contactMomenten: [moment, ...l.contactMomenten] };
    return bijgewerkt;
  });
  if (bijgewerkt) {
    zetCache(next);
    void schrijf(bijgewerkt);
  }
  return bijgewerkt;
}

// --- Duplicaatcheck ---------------------------------------------------------

function normaliseer(s: string | undefined): string {
  return (s ?? '')
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '')
    .trim();
}

export function vindMogelijkDuplicaat(
  bedrijfsnaam: string,
  website?: string,
): Lead | undefined {
  const naam = normaliseer(bedrijfsnaam);
  const site = normaliseer(website);
  return cache.find((l) => {
    if (naam && normaliseer(l.bedrijfsnaam) === naam) return true;
    if (site && l.website && normaliseer(l.website) === site) return true;
    return false;
  });
}
