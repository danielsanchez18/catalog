import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { AstroCookies } from 'astro';
import type { SupabaseClient } from '@supabase/supabase-js';

export function createClient(
  cookies: Pick<AstroCookies, 'get' | 'set' | 'delete'>,
  options?: { cookieOptions?: Partial<CookieOptions> }
): SupabaseClient {
  const supabaseUrl = import.meta.env.SUPABASE_URL as string;
  const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY as string;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Faltan las variables de entorno SUPABASE_URL o SUPABASE_ANON_KEY.');
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name) {
        return cookies.get(name)?.value;
      },
      set(name, value, opts) {
        cookies.set(name, value, opts);
      },
      remove(name, opts) {
        cookies.delete(name, opts);
      },
    },
    ...options,
  });
}
