import type { Branche } from '../types';

/**
 * Mailtemplates. Makkelijk te bewerken. {bedrijfsnaam} en {naam} worden
 * vervangen bij het opstellen. Pas teksten gerust aan.
 */

export type TemplateSleutel =
  | 'eerste'
  | 'follow_up_1'
  | 'afsluiter'
  | 'leeg';

export interface MailTemplate {
  onderwerp: string;
  bericht: string;
}

const eersteMailPerBranche: Record<Branche, MailTemplate> = {
  foodproducent: {
    onderwerp: 'Sterkere productbeelden voor {bedrijfsnaam}',
    bericht:
      'Beste {naam},\n\n' +
      'Ik ben fotograaf gespecialiseerd in food- en productfotografie. Ik zag de producten van {bedrijfsnaam} en zou graag laten zien hoe sterke beelden jullie schap- en online-presentatie kunnen versterken.\n\n' +
      'Zou een korte kennismaking de moeite waard zijn? Dan stuur ik vrijblijvend een paar voorbeelden uit mijn portfolio mee.\n\n' +
      'Hartelijke groet,\n{afzender}',
  },
  webshop: {
    onderwerp: 'Productfotografie die meer verkoopt — {bedrijfsnaam}',
    bericht:
      'Beste {naam},\n\n' +
      'Voor webshops maakt goede productfotografie direct verschil in conversie. Ik fotografeer food en producten met een heldere, smaakvolle stijl.\n\n' +
      'Ik denk dat ik de beelden van {bedrijfsnaam} kan versterken. Zin in een vrijblijvend gesprek?\n\n' +
      'Hartelijke groet,\n{afzender}',
  },
  horeca: {
    onderwerp: 'Aantrekkelijke gerechtfotografie voor {bedrijfsnaam}',
    bericht:
      'Beste {naam},\n\n' +
      'Ik maak food- en sfeerfotografie voor de horeca — beelden die jullie gerechten en plek laten spreken op menukaart, socials en website.\n\n' +
      'Lijkt het {bedrijfsnaam} wat om hier eens over te sparren? Ik kom graag langs.\n\n' +
      'Hartelijke groet,\n{afzender}',
  },
  bureau: {
    onderwerp: 'Food- & productfotograaf voor jullie projecten',
    bericht:
      'Beste {naam},\n\n' +
      'Ik ben food- en productfotograaf en werk graag samen met bureaus zoals {bedrijfsnaam} voor campagnes en klantprojecten.\n\n' +
      'Zullen we kennismaken? Dan weten jullie me te vinden zodra er beeld nodig is.\n\n' +
      'Hartelijke groet,\n{afzender}',
  },
  overig: {
    onderwerp: 'Food- & productfotografie voor {bedrijfsnaam}',
    bericht:
      'Beste {naam},\n\n' +
      'Ik ben fotograaf gespecialiseerd in food- en productfotografie en denk dat ik {bedrijfsnaam} kan helpen aan sterkere beelden.\n\n' +
      'Zou een korte kennismaking interessant zijn?\n\n' +
      'Hartelijke groet,\n{afzender}',
  },
};

const followUp1: MailTemplate = {
  onderwerp: 'Even een korte herinnering — {bedrijfsnaam}',
  bericht:
    'Beste {naam},\n\n' +
    'Ik kom graag nog even terug op mijn vorige bericht. Mocht sterke food- of productfotografie voor {bedrijfsnaam} interessant zijn, dan denk ik graag mee.\n\n' +
    'Zal ik een paar voorbeelden sturen die bij jullie passen?\n\n' +
    'Hartelijke groet,\n',
};

const afsluiter: MailTemplate = {
  onderwerp: 'Laatste berichtje — {bedrijfsnaam}',
  bericht:
    'Beste {naam},\n\n' +
    'Ik wil niet blijven aandringen, dus dit is mijn laatste bericht. Mocht er in de toekomst behoefte zijn aan food- of productfotografie, dan hoor ik het graag.\n\n' +
    'Veel succes met {bedrijfsnaam}!\n\n' +
    'Hartelijke groet,\n',
};

const leeg: MailTemplate = {
  onderwerp: '',
  bericht: '',
};

export function getTemplate(
  sleutel: TemplateSleutel,
  branche: Branche,
): MailTemplate {
  switch (sleutel) {
    case 'eerste':
      return eersteMailPerBranche[branche];
    case 'follow_up_1':
      return followUp1;
    case 'afsluiter':
      return afsluiter;
    case 'leeg':
    default:
      return leeg;
  }
}

export const TEMPLATE_CHIPS: { sleutel: TemplateSleutel; label: string }[] = [
  { sleutel: 'eerste', label: 'Eerste mail' },
  { sleutel: 'follow_up_1', label: 'Follow-up 1' },
  { sleutel: 'afsluiter', label: 'Afsluiter' },
  { sleutel: 'leeg', label: 'Leeg' },
];

/** Vervangt {bedrijfsnaam}, {naam} en {afzender} in een tekst. */
export function vulIn(
  tekst: string,
  bedrijfsnaam: string,
  naam: string,
  afzender = '',
): string {
  return tekst
    .replaceAll('{bedrijfsnaam}', bedrijfsnaam)
    .replaceAll('{naam}', naam || 'team')
    .replaceAll('{afzender}', afzender);
}
