import { addDays, startOfDay, subDays } from 'date-fns';
import type { Lead } from '../types';
import { genId } from '../logic/leadLogic';

// ~8 voorbeeldleads in verschillende statussen en buckets, zodat de schermen
// meteen gevuld zijn. Datums zijn relatief aan vandaag.
export function maakSeedLeads(nu: Date = new Date()): Lead[] {
  const vandaag = startOfDay(nu);
  const iso = (d: Date) => d.toISOString();

  return [
    {
      id: genId(),
      bedrijfsnaam: 'De Verse Hoeve',
      branche: 'foodproducent',
      plaats: 'Utrecht',
      email: 'info@deversehoeve.nl',
      telefoon: '030 123 4567',
      website: 'https://deversehoeve.nl',
      status: 'benaderd',
      prioriteit: true,
      volgendeActieOp: iso(subDays(vandaag, 3)), // verlopen -> bovenaan vandaag
      aangemaaktOp: iso(subDays(vandaag, 20)),
      contactMomenten: [
        {
          id: genId(),
          datum: iso(subDays(vandaag, 10)),
          kanaal: 'email',
          notitie: 'Eerste mail gestuurd met portfolio-link.',
        },
      ],
    },
    {
      id: genId(),
      bedrijfsnaam: 'Smaakvol Webshop',
      branche: 'webshop',
      plaats: 'Amsterdam',
      email: 'hallo@smaakvol.nl',
      website: 'https://smaakvol.nl',
      status: 'nieuw',
      prioriteit: false,
      volgendeActieOp: iso(vandaag), // vandaag
      aangemaaktOp: iso(subDays(vandaag, 1)),
      contactMomenten: [],
    },
    {
      id: genId(),
      bedrijfsnaam: 'Bistro Noord',
      branche: 'horeca',
      plaats: 'Groningen',
      email: 'reserveren@bistronoord.nl',
      telefoon: '050 765 4321',
      status: 'in_gesprek',
      prioriteit: true,
      volgendeActieOp: iso(vandaag), // vandaag
      aangemaaktOp: iso(subDays(vandaag, 14)),
      contactMomenten: [
        {
          id: genId(),
          datum: iso(subDays(vandaag, 2)),
          kanaal: 'telefoon',
          notitie: 'Gebeld — interesse in menukaart-fotografie, offerte gevraagd.',
        },
        {
          id: genId(),
          datum: iso(subDays(vandaag, 7)),
          kanaal: 'email',
          notitie: 'Eerste mail, kreeg vriendelijke reactie terug.',
        },
      ],
    },
    {
      id: genId(),
      bedrijfsnaam: 'Studio Bureau Vorm',
      branche: 'bureau',
      plaats: 'Rotterdam',
      email: 'contact@bureauvorm.nl',
      website: 'https://bureauvorm.nl',
      status: 'benaderd',
      prioriteit: false,
      volgendeActieOp: iso(addDays(vandaag, 2)), // later deze week
      aangemaaktOp: iso(subDays(vandaag, 9)),
      contactMomenten: [
        {
          id: genId(),
          datum: iso(subDays(vandaag, 5)),
          kanaal: 'email',
          notitie: 'Follow-up gestuurd, nog geen reactie.',
        },
      ],
    },
    {
      id: genId(),
      bedrijfsnaam: 'Pure Sappen',
      branche: 'foodproducent',
      plaats: 'Eindhoven',
      email: 'marketing@puresappen.nl',
      website: 'https://puresappen.nl',
      status: 'nieuw',
      prioriteit: false,
      volgendeActieOp: iso(addDays(vandaag, 3)), // later deze week
      aangemaaktOp: iso(subDays(vandaag, 2)),
      contactMomenten: [],
    },
    {
      id: genId(),
      bedrijfsnaam: 'Lekker Lokaal',
      branche: 'horeca',
      plaats: 'Den Haag',
      email: 'info@lekkerlokaal.nl',
      status: 'klant',
      prioriteit: false,
      volgendeActieOp: undefined,
      aangemaaktOp: iso(subDays(vandaag, 60)),
      contactMomenten: [
        {
          id: genId(),
          datum: iso(subDays(vandaag, 30)),
          kanaal: 'email',
          notitie: 'Opdracht bevestigd — eerste shoot ingepland.',
        },
      ],
    },
    {
      id: genId(),
      bedrijfsnaam: 'SnelSnack BV',
      branche: 'foodproducent',
      plaats: 'Tilburg',
      email: 'inkoop@snelsnack.nl',
      status: 'afgewezen',
      prioriteit: false,
      volgendeActieOp: undefined,
      aangemaaktOp: iso(subDays(vandaag, 40)),
      contactMomenten: [
        {
          id: genId(),
          datum: iso(subDays(vandaag, 25)),
          kanaal: 'email',
          notitie: 'Geen interesse, werken met vaste fotograaf.',
        },
      ],
    },
    {
      id: genId(),
      bedrijfsnaam: 'Hoeve Webwinkel',
      branche: 'webshop',
      plaats: 'Zwolle',
      email: 'service@hoevewebwinkel.nl',
      website: 'https://hoevewebwinkel.nl',
      status: 'nieuw',
      prioriteit: false,
      volgendeActieOp: iso(subDays(vandaag, 1)), // gisteren -> verlopen
      aangemaaktOp: iso(subDays(vandaag, 4)),
      contactMomenten: [],
    },
  ];
}
