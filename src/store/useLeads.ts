import { useSyncExternalStore } from 'react';
import { abonneer, getLeads, getStatus } from './leadStore';

/** Reactieve lijst van alle leads; her-rendert bij elke store-wijziging. */
export function useLeads() {
  return useSyncExternalStore(abonneer, getLeads, getLeads);
}

/** Laadstatus van de store: 'laden' | 'klaar' | 'fout'. */
export function useStoreStatus() {
  return useSyncExternalStore(abonneer, getStatus, getStatus);
}
