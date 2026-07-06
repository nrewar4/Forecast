import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// These are read from Vite env at build time. When both are present the app uses
// a shared Supabase database. When either is missing the app falls back to
// browser storage so it always runs out of the box.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null;

export const SHIPMENTS_TABLE = "shipments";
