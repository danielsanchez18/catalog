import type { APIRoute } from 'astro';
import { getPublishedServices } from '@/lib/db/services';

export const prerender = false;

export const GET: APIRoute = async ({ cookies }) => {
  try {
    const services = await getPublishedServices(cookies);
    return new Response(JSON.stringify(services), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500 });
  }
};