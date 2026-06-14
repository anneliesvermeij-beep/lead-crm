import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInstellingen, bewaarInstellingen } from '../store/instellingen';

export function Instellingen() {
  const huidig = useInstellingen();
  const navigate = useNavigate();
  const [naam, setNaam] = useState(huidig.afzenderNaam);
  const [onderwerp, setOnderwerp] = useState(huidig.defaultOnderwerp);
  const [bericht, setBericht] = useState(huidig.defaultBericht);
  const [bezig, setBezig] = useState(false);
  const [bewaard, setBewaard] = useState(false);

  async function opslaan() {
    setBezig(true);
    setBewaard(false);
    await bewaarInstellingen({
      afzenderNaam: naam,
      defaultOnderwerp: onderwerp,
      defaultBericht: bericht,
    });
    setBezig(false);
    setBewaard(true);
  }

  return (
    <div className="pagina">
      <header className="app-kop">
        <div className="app-kop-titel">
          <span className="studio-naam">Instellingen</span>
          <span className="app-kop-sub">Standaard e-mail</span>
        </div>
        <button className="knop knop-rustig" onClick={() => navigate('/')}>
          ← Werkvoorraad
        </button>
      </header>

      <div className="kaart">
        <p className="rustige-tekst" style={{ marginTop: 0 }}>
          Dit is de e-mail die standaard wordt voorgevuld bij “Mail opstellen”. Gebruik{' '}
          <code>{'{bedrijfsnaam}'}</code> en <code>{'{naam}'}</code> — die worden automatisch
          ingevuld.
        </p>

        <label className="veld">
          <span>Jouw naam (onder de groet)</span>
          <input
            value={naam}
            onChange={(e) => {
              setNaam(e.target.value);
              setBewaard(false);
            }}
            placeholder="Bijv. Annelies"
          />
        </label>

        <label className="veld" style={{ marginTop: 14 }}>
          <span>Standaard onderwerp</span>
          <input
            value={onderwerp}
            onChange={(e) => {
              setOnderwerp(e.target.value);
              setBewaard(false);
            }}
            placeholder="Bijv. Sterkere beelden voor {bedrijfsnaam}"
          />
        </label>

        <label className="veld" style={{ marginTop: 14 }}>
          <span>Standaard bericht</span>
          <textarea
            rows={12}
            value={bericht}
            onChange={(e) => {
              setBericht(e.target.value);
              setBewaard(false);
            }}
            placeholder={'Beste {naam},\n\n…\n\nHartelijke groet,'}
          />
        </label>

        <div className="form-acties">
          {bewaard && <span className="rustige-tekst" style={{ marginRight: 'auto' }}>✓ Opgeslagen</span>}
          <button className="knop knop-primair" onClick={opslaan} disabled={bezig}>
            {bezig ? 'Bezig…' : 'Opslaan'}
          </button>
        </div>
      </div>
    </div>
  );
}
