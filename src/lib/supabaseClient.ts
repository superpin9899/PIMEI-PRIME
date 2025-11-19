import { createClient } from '@supabase/supabase-js';

type SupabaseRuntimeConfig = {
  url: string;
  anonKey: string;
};

declare global {
  interface Window {
    __SUPABASE_CONFIG__?: SupabaseRuntimeConfig;
  }
}

function loadSupabaseConfig(): SupabaseRuntimeConfig {
  const url = import.meta.env.VITE_SUPABASE_URL || window.__SUPABASE_CONFIG__?.url;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || window.__SUPABASE_CONFIG__?.anonKey;

  const fallbackUrl = 'https://inxjgpzndhtetnctofbs.supabase.co';
  const fallbackAnon =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlueGpncHpuZGh0ZXRuY3RvZmJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MzgyMzEsImV4cCI6MjA3OTAxNDIzMX0.G_IjwZ5h_rIHcZ_a0i_5BjLlN6wvG0kSM-BtiHb4tX8';

  return {
    url: url || fallbackUrl,
    anonKey: anonKey || fallbackAnon,
  };
}

const { url, anonKey } = loadSupabaseConfig();

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

