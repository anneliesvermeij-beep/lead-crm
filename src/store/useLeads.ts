import { useSyncExternalStore } from 'react';
import { abonneer, getLeads } from './leadStore';

/** Reactieve lijst van alle leads; her-rendert bij elke store-wijziging. */
export function useLeads() {
  return useSyncExternalStore(abonneer, getLeads, getLeads);
}
