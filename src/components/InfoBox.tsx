import type { ReactNode } from 'react';

/** Lichte informatiebanner, bijv. voor de verversfrequentie van een lijst. */
export function InfoBox({ children }: { children: ReactNode }) {
  return (
    <div className="infobox">
      <span className="infobox-icoon" aria-hidden="true">
        ℹ️
      </span>
      <span>{children}</span>
    </div>
  );
}
