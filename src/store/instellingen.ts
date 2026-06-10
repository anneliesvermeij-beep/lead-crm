import { useSyncExternalStore } from 'react';
import { supabase } from '../supabaseClient';
import type { Instellingen } from '../types';

/** App-instellingen (standaard e-mail), één rij in Supabase (crm_instellingen). */

const LEEG: Instellingen = {
  afzenderNaam: '',
  defaultOnderwerp: '',
  defaultBericht: '',
};

let cache: Instellingen = LEEG;
const luisteraars = new Set<() => void>();

function meld() {
  luisteraars.forEach((l) => l());
}

export function getInstellingen(): Instellingen {
  return cache;
}

export async function laadInstellingen(): Promise<void> {
  try {
    const { data } = await supabase
      .from('crm_instellingen')
      .select('*')
      .eq('id', 1)
      .maybeSingle();
    if (data) {
      cache = {
        afzenderNaam: data.afzender_naam ?? '',
        defaultOnderwerp: data.default_onderwerp ?? '',
        defaultBericht: data.default_bericht ?? '',
      };
      meld();
    }
  } catch {
    // tabel bestaat misschien nog niet; standaard blijft leeg
  }
}

export async function bewaarInstellingen(i: Instellingen): Promise<void> {
  cache = i;
  meld();
  await supabase.from('crm_instellingen').upsert({
    id: 1,
    afzender_naam: i.afzenderNaam,
    default_onderwerp: i.defaultOnderwerp,
    default_bericht: i.defaultBericht,
  });
}

export function useInstellingen(): Instellingen {
  return useSyncExternalStore(
    (cb) => {
      luisteraars.add(cb);
      return () => luisteraars.delete(cb);
    },
    getInstellingen,
    getInstellingen,
  );
}
