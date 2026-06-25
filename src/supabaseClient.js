import { createClient } from '@supabase/supabase-js';

// ════════════════════════════════════════════════════════════════════
// COLE AQUI AS SUAS CHAVES DO SUPABASE
// (Settings → API no painel do Supabase)
// ════════════════════════════════════════════════════════════════════
const SUPABASE_URL = "https://vfkfbcnjiguecucdtuch.supabase.co/rest/v1/";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZma2ZiY25qaWd1ZWN1Y2R0dWNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMzAzMTEsImV4cCI6MjA5NzkwNjMxMX0.M7nFWd-Hkp7Xz2GIai78DVuAhrDS-igwWm9oisGeVoE";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
