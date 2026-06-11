import {
  addWeeks,
  addMonths,
  addDays,
  endOfWeek,
  endOfDay,
  startOfDay,
  isAfter,
  isBefore,
  max as maxDate,
} from 'date-fns';
import type { Lead, LeadStatus, ContactMoment } from '../types';

// Rang van een status, om nooit terug te vallen naar een eerdere fase.
const STATUS_RANG: Record<LeadStatus, number> = {
  nieuw: 0,
  afgewezen: 0,
  vervallen: 0,
  benaderd: 1,
  in_gesprek: 2,
  klant: 3,
};

// Week start op maandag.
export function eindeVanDezeWeek(nu: Date = new Date()): Date {
  return endOfWeek(nu, { weekStartsOn: 1 });
}

function actieDatum(lead: Lead): Date | null {
  return lead.volgendeActieOp ? new Date(lead.volgendeActieOp) : null;
}

/** Lead is actief op te volgen (niet klant, afgewezen of vervallen). */
export function isActief(lead: Lead): boolean {
  return (
    lead.status !== 'klant' &&
    lead.status !== 'afgewezen' &&
    lead.status !== 'vervallen'
  );
}

/** Heeft deze lead recent nieuws? (nieuwste contactmoment begint met 📰) */
export function heeftNieuws(lead: Lead): boolean {
  const nieuwste = lead.contactMomenten[0];
  return !!nieuwste && nieuwste.notitie.trim().startsWith('📰');
}

/** Kleurklasse voor de score-bol: groen (≥70), oranje (40-69), rood (<40). */
export function scoreTier(score: number): string {
  if (score >= 70) return 'score-groen';
  if (score >= 40) return 'score-oranje';
  return 'score-rood';
}

/** Verschijnt op "deze week": actief én volgendeActieOp <= einde van deze week. */
export function verschijntOpDezeWeek(lead: Lead, nu: Date = new Date()): boolean {
  if (!isActief(lead)) return false;
  const datum = actieDatum(lead);
  if (!datum) return false;
  return !isAfter(datum, eindeVanDezeWeek(nu));
}

/** Vandaag-bucket: volgendeActieOp <= vandaag (incl. verlopen uit het verleden). */
export function isVandaagBucket(lead: Lead, nu: Date = new Date()): boolean {
  if (!isActief(lead)) return false;
  const datum = actieDatum(lead);
  if (!datum) return false;
  return !isAfter(datum, endOfDay(nu));
}

/** Later-deze-week-bucket: na vandaag maar vóór einde week. */
export function isLaterDezeWeek(lead: Lead, nu: Date = new Date()): boolean {
  if (!isActief(lead)) return false;
  const datum = actieDatum(lead);
  if (!datum) return false;
  return isAfter(datum, endOfDay(nu)) && !isAfter(datum, eindeVanDezeWeek(nu));
}

/** Een opvolgdatum die in het verleden ligt (vóór vandaag). */
export function isVerlopen(lead: Lead, nu: Date = new Date()): boolean {
  const datum = actieDatum(lead);
  if (!datum) return false;
  return isBefore(datum, startOfDay(nu));
}

export function isDatumVerlopen(iso: string | undefined, nu: Date = new Date()): boolean {
  if (!iso) return false;
  return isBefore(new Date(iso), startOfDay(nu));
}

/**
 * Sorteer de vandaag-bucket: verlopen eerst, dan prioriteit, dan op datum.
 */
export function sorteerVandaag(leads: Lead[], nu: Date = new Date()): Lead[] {
  return [...leads].sort((a, b) => {
    const aVerlopen = isVerlopen(a, nu) ? 0 : 1;
    const bVerlopen = isVerlopen(b, nu) ? 0 : 1;
    if (aVerlopen !== bVerlopen) return aVerlopen - bVerlopen;

    const aPrio = a.prioriteit ? 0 : 1;
    const bPrio = b.prioriteit ? 0 : 1;
    if (aPrio !== bPrio) return aPrio - bPrio;

    const aDatum = actieDatum(a)?.getTime() ?? Infinity;
    const bDatum = actieDatum(b)?.getTime() ?? Infinity;
    return aDatum - bDatum;
  });
}

export function sorteerLaterDezeWeek(leads: Lead[]): Lead[] {
  return [...leads].sort((a, b) => {
    const aDatum = actieDatum(a)?.getTime() ?? Infinity;
    const bDatum = actieDatum(b)?.getTime() ?? Infinity;
    return aDatum - bDatum;
  });
}

/**
 * Snooze: schuift volgendeActieOp vooruit. Basis is de latere van (vandaag,
 * huidige actiedatum) zodat een snooze altijd echt vooruit gaat — ook bij
 * verlopen datums. Verandert de status niet.
 */
export function snooze(lead: Lead, hoeveel: '1week' | '1maand', nu: Date = new Date()): Lead {
  const huidig = actieDatum(lead);
  const basis = huidig ? maxDate([startOfDay(nu), huidig]) : startOfDay(nu);
  const nieuw = hoeveel === '1week' ? addWeeks(basis, 1) : addMonths(basis, 1);
  return { ...lead, volgendeActieOp: nieuw.toISOString() };
}

/**
 * Mail verstuurd vanuit het detailscherm:
 * - status -> 'benaderd', maar nooit terug van in_gesprek/klant
 * - voegt een ContactMoment toe (kanaal email)
 * - zet volgendeActieOp op vandaag + herinnerDagen
 */
export function markeerMailVerstuurd(
  lead: Lead,
  herinnerDagen: number,
  notitie: string,
  nu: Date = new Date(),
): Lead {
  const nieuweStatus: LeadStatus =
    STATUS_RANG[lead.status] >= STATUS_RANG['in_gesprek'] ? lead.status : 'benaderd';

  const moment: ContactMoment = {
    id: genId(),
    datum: nu.toISOString(),
    kanaal: 'email',
    notitie: notitie.trim() || 'Mail verstuurd',
  };

  return {
    ...lead,
    status: nieuweStatus,
    volgendeActieOp: addDays(startOfDay(nu), herinnerDagen).toISOString(),
    contactMomenten: [moment, ...lead.contactMomenten],
  };
}

export function genId(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  );
}
