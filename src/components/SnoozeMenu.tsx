import { useEffect, useRef, useState } from 'react';

interface SnoozeMenuProps {
  onSnooze: (hoeveel: '1week' | '1maand') => void;
}

/** Icoonknop met klein menu: +1 week / +1 maand. */
export function SnoozeMenu({ onSnooze }: SnoozeMenuProps) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function bijKlik(e: MouseEvent) {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', bijKlik);
    return () => document.removeEventListener('mousedown', bijKlik);
  }, [open]);

  return (
    <div className="snooze-wrap" ref={wrap}>
      <button
        type="button"
        className="icoon-knop"
        title="Snooze"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        ⏰
      </button>
      {open && (
        <div className="snooze-menu" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => {
              onSnooze('1week');
              setOpen(false);
            }}
          >
            +1 week
          </button>
          <button
            type="button"
            onClick={() => {
              onSnooze('1maand');
              setOpen(false);
            }}
          >
            +1 maand
          </button>
        </div>
      )}
    </div>
  );
}
