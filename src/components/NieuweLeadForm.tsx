import { useState } from 'react';
import type { Branche } from '../types';
import { BRANCHE_LABELS } from '../types';
import { addLead, vindMogelijkDuplicaat } from '../store/leadStore';
import type { NieuweLeadInvoer } from '../store/leadStore';

interface Props {
  onSluit: () => void;
  onToegevoegd: (id: string) => void;
}

const BRANCHES: Branche[] = ['webshop', 'foodproducent', 'horeca', 'bureau', 'overig'];

export function NieuweLeadForm({ onSluit, onToegevoegd }: Props) {
  const [velden, setVelden] = useState<NieuweLeadInvoer>({
    bedrijfsnaam: '',
    branche: 'foodproducent',
    plaats: '',
    email: '',
    telefoon: '',
    website: '',
  });
  const [fout, setFout] = useState('');
  const [waarschuwing, setWaarschuwing] = useState('');

  function wijzig<K extends keyof NieuweLeadInvoer>(sleutel: K, waarde: NieuweLeadInvoer[K]) {
    setVelden((v) => ({ ...v, [sleutel]: waarde }));
  }

  function verstuur(e: React.FormEvent) {
    e.preventDefault();
    if (!velden.bedrijfsnaam.trim()) {
      setFout('Bedrijfsnaam is verplicht.');
      return;
    }
    const dup = vindMogelijkDuplicaat(velden.bedrijfsnaam, velden.website);
    if (dup && !waarschuwing) {
      setWaarschuwing(
        `Lijkt op een bestaande lead: "${dup.bedrijfsnaam}". Klik nogmaals op Opslaan om toch toe te voegen.`,
      );
      return;
    }
    const nieuw = addLead(velden);
    onToegevoegd(nieuw.id);
  }

  return (
    <div className="overlay" onMouseDown={onSluit}>
      <div className="paneel" onMouseDown={(e) => e.stopPropagation()}>
        <div className="paneel-kop">
          <h2>Nieuwe lead</h2>
          <button type="button" className="icoon-knop" onClick={onSluit} title="Sluiten">
            ✕
          </button>
        </div>

        <form onSubmit={verstuur} className="form">
          <label className="veld">
            <span>Bedrijfsnaam *</span>
            <input
              autoFocus
              value={velden.bedrijfsnaam}
              onChange={(e) => {
                wijzig('bedrijfsnaam', e.target.value);
                setFout('');
                setWaarschuwing('');
              }}
              placeholder="Bijv. De Verse Hoeve"
            />
          </label>

          <label className="veld">
            <span>Branche</span>
            <select
              value={velden.branche}
              onChange={(e) => wijzig('branche', e.target.value as Branche)}
            >
              {BRANCHES.map((b) => (
                <option key={b} value={b}>
                  {BRANCHE_LABELS[b]}
                </option>
              ))}
            </select>
          </label>

          <div className="veld-rij">
            <label className="veld">
              <span>Plaats</span>
              <input
                value={velden.plaats}
                onChange={(e) => wijzig('plaats', e.target.value)}
                placeholder="Plaats"
              />
            </label>
            <label className="veld">
              <span>Telefoon</span>
              <input
                value={velden.telefoon}
                onChange={(e) => wijzig('telefoon', e.target.value)}
                placeholder="06 …"
              />
            </label>
          </div>

          <label className="veld">
            <span>E-mail</span>
            <input
              type="email"
              value={velden.email}
              onChange={(e) => {
                wijzig('email', e.target.value);
                setWaarschuwing('');
              }}
              placeholder="naam@bedrijf.nl"
            />
          </label>

          <label className="veld">
            <span>Website</span>
            <input
              value={velden.website}
              onChange={(e) => {
                wijzig('website', e.target.value);
                setWaarschuwing('');
              }}
              placeholder="https://…"
            />
          </label>

          {fout && <p className="melding melding-fout">{fout}</p>}
          {waarschuwing && <p className="melding melding-waarschuwing">{waarschuwing}</p>}

          <div className="form-acties">
            <button type="button" className="knop knop-rustig" onClick={onSluit}>
              Annuleren
            </button>
            <button type="submit" className="knop knop-primair">
              Opslaan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
