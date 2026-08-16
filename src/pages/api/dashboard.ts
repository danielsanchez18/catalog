import type { APIRoute } from 'astro';
import { createClient } from '@/lib/supabase/server';
import { getDashboardStats, getRecentProducts } from '@/lib/db/dashboard';

export const prerender = false;

export const GET: APIRoute = async ({ cookies }) => {
  const supabase = createClient(cookies);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: 'No autorizado.' }), { status: 401 });
  }

  try {
    const [stats, recentProducts] = await Promise.all([
      getDashboardStats(cookies),
      getRecentProducts(cookies, 5),
    ]);

    return new Response(JSON.stringify({ stats, recentProducts }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500 });
  }
};