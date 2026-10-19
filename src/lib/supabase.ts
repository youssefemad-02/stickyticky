import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Optional during local demo mode; configure env vars to enable Supabase. */
export const supabase = url && anonKey ? createClient(url, anonKey) : null;
