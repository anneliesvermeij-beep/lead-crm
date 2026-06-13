export type LeadStatus =
  | 'nieuw'
  | 'benaderd'
  | 'in_gesprek'
  | 'klant'
  | 'afgewezen'
  | 'vervallen';

export type Branche =
  | 'webshop'
  | 'foodproducent'
  | 'horeca'
  | 'bureau'
  | 'overig';

export interface ContactMoment {
  id: string;
  datum: string; // ISO-datum
  kanaal: 'email' | 'telefoon' | 'overig';
  notitie: string;
}

export interface Lead {
  id: string;
  bedrijfsnaam: string;
  branche: Branche;
  plaats?: string;
  email?: string;
  telefoon?: string;
  website?: string;
  // Contactpersoon bij dit bedrijf (handmatig in te vullen).
  contactNaam?: string;
  contactEmail?: string;
  contactTelefoon?: string;
  status: LeadStatus; // default 'nieuw'
  prioriteit: boolean; // ster aan/uit, default false
  volgendeActieOp?: string; // ISO-datum; bepaalt of een lead op "deze week" verschijnt
  contactMomenten: ContactMoment[];
  aangemaaktOp: string;
  score: number; // lead-score uit de finder (0-100), 0 als onbekend
  bron: string; // 'finder' (standaard) of 'vacature'
}

/** App-instellingen (o.a. standaard e-mail). Eén rij in Supabase. */
export interface Instellingen {
  afzenderNaam: string;
  defaultOnderwerp: string;
  defaultBericht: string;
}

// UI-labels (Nederlands, sentence case)
export const STATUS_LABELS: Record<LeadStatus, string> = {
  nieuw: 'Nieuw',
  benaderd: 'Benaderd',
  in_gesprek: 'In gesprek',
  klant: 'Klant',
  afgewezen: 'Afgewezen',
  vervallen: 'Vervallen',
};

export const BRANCHE_LABELS: Record<Branche, string> = {
  webshop: 'Webshop',
  foodproducent: 'Foodproducent',
  horeca: 'Horeca',
  bureau: 'Bureau',
  overig: 'Overig',
};

export const STATUS_VOLGORDE: LeadStatus[] = [
  'nieuw',
  'benaderd',
  'in_gesprek',
  'klant',
  'afgewezen',
  'vervallen',
];
