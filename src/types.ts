export type LeadStatus =
  | 'nieuw'
  | 'benaderd'
  | 'in_gesprek'
  | 'klant'
  | 'afgewezen';

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
  status: LeadStatus; // default 'nieuw'
  prioriteit: boolean; // ster aan/uit, default false
  volgendeActieOp?: string; // ISO-datum; bepaalt of een lead op "deze week" verschijnt
  contactMomenten: ContactMoment[];
  aangemaaktOp: string;
}

// UI-labels (Nederlands, sentence case)
export const STATUS_LABELS: Record<LeadStatus, string> = {
  nieuw: 'Nieuw',
  benaderd: 'Benaderd',
  in_gesprek: 'In gesprek',
  klant: 'Klant',
  afgewezen: 'Afgewezen',
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
];
