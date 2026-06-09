import type { LeadStatus } from '../types';
import { STATUS_LABELS } from '../types';

export function StatusBadge({ status }: { status: LeadStatus }) {
  return <span className={`badge badge-${status}`}>{STATUS_LABELS[status]}</span>;
}
