import type { APIRoute } from 'astro';
import { getPublishedServiceById } from '@/lib/db/services';

export const prerender = false;

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const GET: APIRoute = async ({ cookies, params }) => {
  const id = params.id ?? '';
  if (!UUID_REGEX.test(id)) {
    return new Response(JSON.stringify({ error: 'Servicio no encontrado.' }), { status: 404 });
  }

  try {
    const service = await getPublishedServiceById(cookies, id);
    if (!service) {
      return new Response(JSON.stringify({ error: 'Servicio no encontrado.' }), { status: 404 });
    }
    return new Response(JSON.stringify(service), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500 });
  }
};