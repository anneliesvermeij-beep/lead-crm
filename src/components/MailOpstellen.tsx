import { useMemo, useState } from 'react';
import type { Lead } from '../types';
import {
  TEMPLATE_CHIPS,
  getTemplate,
  vulIn,
  type TemplateSleutel,
} from '../mail/mailTemplates';
import { markeerMailVerstuurd } from '../logic/leadLogic';
import { saveLead } from '../store/leadStore';

interface Props {
  lead: Lead;
  onSluit: () => void;
  onVerstuurd: () => void;
}

const HERINNER_OPTIES = [7, 3, 14];

export function MailOpstellen({ lead, onSluit, onVerstuurd }: Props) {
  const [actieveTemplate, setActieveTemplate] = useState<TemplateSleutel>('eerste');
  const startTemplate = useMemo(
    () => getTemplate('eerste', lead.branche),
    [lead.branche],
  );
  const [onderwerp, setOnderwerp] = useState(
    vulIn(startTemplate.onderwerp, lead.bedrijfsnaam, ''),
  );
  const [bericht, setBericht] = useState(
    vulIn(startTemplate.bericht, lead.bedrijfsnaam, ''),
  );
  const [herinnerDagen, setHerinnerDagen] = useState(7);

  function kiesTemplate(sleutel: TemplateSleutel) {
    setActieveTemplate(sleutel);
    const t = getTemplate(sleutel, lead.branche);
    setOnderwerp(vulIn(t.onderwerp, lead.bedrijfsnaam, ''));
    setBericht(vulIn(t.bericht, lead.bedrijfsnaam, ''));
  }

  function openenInMail() {
    const adres = lead.email ?? '';
    const url = `mailto:${encodeURIComponent(adres)}?subject=${encodeURIComponent(
      onderwerp,
    )}&body=${encodeURIComponent(bericht)}`;
    // Open de mailclient.
    window.location.href = url;

    // Mail-verstuurd-logica: status -> benaderd (nooit terug), contactmoment, datum.
    const bijgewerkt = markeerMailVerstuurd(
      lead,
      herinnerDagen,
      `Mail verstuurd: ${onderwerp}`,
    );
    saveLead(bijgewerkt);
    onVerstuurd();
  }

  return (
    <div className="overlay" onMouseDown={onSluit}>
      <div className="paneel paneel-breed" onMouseDown={(e) => e.stopPropagation()}>
        <div className="paneel-kop">
          <h2>Mail opstellen — {lead.bedrijfsnaam}</h2>
          <button type="button" className="icoon-knop" onClick={onSluit} title="Sluiten">
            ✕
          </button>
        </div>

        <div className="chips">
          {TEMPLATE_CHIPS.map((chip) => (
            <button
              key={chip.sleutel}
              type="button"
              className={`chip ${actieveTemplate === chip.sleutel ? 'chip-actief' : ''}`}
              onClick={() => kiesTemplate(chip.sleutel)}
            >
              {chip.label}
            </button>
          ))}
        </div>

        <label className="veld">
          <span>Onderwerp</span>
          <input value={onderwerp} onChange={(e) => setOnderwerp(e.target.value)} />
        </label>

        <label className="veld">
          <span>Bericht</span>
          <textarea
            rows={10}
            value={bericht}
            onChange={(e) => setBericht(e.target.value)}
          />
        </label>

        <div className="mail-na-rij">
          <span>Na verzenden: status → Benaderd, herinner over</span>
          <div className="herinner-knoppen">
            {HERINNER_OPTIES.map((d) => (
              <button
                key={d}
                type="button"
                className={`chip ${herinnerDagen === d ? 'chip-actief' : ''}`}
                onClick={() => setHerinnerDagen(d)}
              >
                {d} dagen
              </button>
            ))}
          </div>
        </div>

        {!lead.email && (
          <p className="melding melding-waarschuwing">
            Deze lead heeft geen e-mailadres — de mailclient opent zonder ontvanger.
          </p>
        )}

        <div className="form-acties">
          <button type="button" className="knop knop-rustig" onClick={onSluit}>
            Annuleren
          </button>
          <button type="button" className="knop knop-primair" onClick={openenInMail}>
            Openen in mail
          </button>
        </div>
      </div>
    </div>
  );
}
