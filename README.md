# Lead CRM — Photography & Images

Een minimalistische lead-CRM voor één gebruiker (een fotografiestudio, food- en
productfotografie). Doel: geen enkele lead vergeten op te volgen. Elke actie zet
automatisch een status én een volgende-actie-datum.

## Twee schermen

- **Deze week** (`/`) — startscherm met opvolgacties (vandaag / later deze week)
- **Lead-detail** (`/lead/:id`) — status/datum beheren, contactmomenten loggen, mail opstellen

Leads voeg je handmatig toe via de knop "Nieuwe lead". Mail opstellen en het
nieuwe-lead-formulier zijn overlays.

## Techniek

- React (Vite) + TypeScript
- `date-fns` voor datums
- Opslag via een kleine `leadStore`-abstractie (nu `localStorage`; later te
  vervangen door een echte backend zonder UI-wijziging)

## Starten

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # productie-build
npm run preview  # preview van de build
```

## Structuur

```
src/
  types.ts                 # Lead, status, branche, labels
  data/seed.ts             # ~8 voorbeeldleads
  store/
    leadStore.ts           # getLeads/getLead/saveLead/addLead/logContact (localStorage)
    useLeads.ts            # React-hook (useSyncExternalStore)
  logic/leadLogic.ts       # buckets, snooze, mail-verstuurd-logica
  mail/mailTemplates.ts    # bewerkbare mailteksten met {bedrijfsnaam}/{naam}
  components/              # StatusBadge, Star, MetricTile, SnoozeMenu,
                          # NieuweLeadForm, MailOpstellen
  pages/                  # DezeWeek, LeadDetail
```

## Belangrijkste regels (in `leadLogic.ts`)

- Verschijnt op "deze week" als de lead actief is (niet klant/afgewezen) en
  `volgendeActieOp` <= einde van deze week.
- Vandaag-bucket = `volgendeActieOp` <= vandaag (incl. verlopen datums; die staan bovenaan).
- Snooze schuift de datum +1 week of +1 maand; verandert de status niet.
- Mail verstuurd: status → benaderd (nooit terug van in gesprek/klant), voegt een
  contactmoment toe, en zet de volgende actie op de gekozen herinner-termijn.
