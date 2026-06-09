interface StarProps {
  actief: boolean;
  onClick?: (e: React.MouseEvent) => void;
  titel?: string;
}

export function Star({ actief, onClick, titel }: StarProps) {
  return (
    <button
      type="button"
      className={`ster ${actief ? 'ster-aan' : 'ster-uit'}`}
      aria-pressed={actief}
      title={titel ?? (actief ? 'Prioriteit aan' : 'Prioriteit uit')}
      onClick={onClick}
    >
      {actief ? '★' : '☆'}
    </button>
  );
}
