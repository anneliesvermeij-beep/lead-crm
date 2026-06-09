import { useState } from 'react';
import { supabase } from '../supabaseClient';

export function Login() {
  const [email, setEmail] = useState('');
  const [wachtwoord, setWachtwoord] = useState('');
  const [fout, setFout] = useState('');
  const [bezig, setBezig] = useState(false);

  async function verstuur(e: React.FormEvent) {
    e.preventDefault();
    setBezig(true);
    setFout('');
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: wachtwoord,
    });
    setBezig(false);
    if (error) setFout('Inloggen mislukt. Controleer je e-mail en wachtwoord.');
  }

  return (
    <div className="login-scherm">
      <form className="login-kaart" onSubmit={verstuur}>
        <h1>Photography &amp; Images</h1>
        <p className="rustige-tekst">Log in om je leads te bekijken.</p>

        <label className="veld">
          <span>E-mail</span>
          <input
            type="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="naam@bedrijf.nl"
          />
        </label>

        <label className="veld">
          <span>Wachtwoord</span>
          <input
            type="password"
            value={wachtwoord}
            onChange={(e) => setWachtwoord(e.target.value)}
            placeholder="••••••••"
          />
        </label>

        {fout && <p className="melding melding-fout">{fout}</p>}

        <button type="submit" className="knop knop-primair" disabled={bezig}>
          {bezig ? 'Bezig…' : 'Inloggen'}
        </button>
      </form>
    </div>
  );
}
