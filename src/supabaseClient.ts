import { createClient } from '@supabase/supabase-js';

// De anon-sleutel hoort in de frontend te staan en is publiek (zo werkt Supabase).
// De beveiliging zit in Row Level Security op de tabel, niet in geheimhouding.
const SUPABASE_URL = 'https://cessgfailchvqewlnvww.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlc3NnZmFpbGNodnFld2xudnd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NDk4OTgsImV4cCI6MjA5NjQyNTg5OH0.4rXcWpbX6r8nWVg9hYM5UF7xPf8QWHGapP6NmJR1prQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const CRM_TABEL = 'crm_leads';
