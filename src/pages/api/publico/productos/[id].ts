import type { APIRoute } from 'astro';
import { getPublishedProductById } from '@/lib/db/products';

export const prerender = false;

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const GET: APIRoute = async ({ cookies, params }) => {
  const id = params.id ?? '';
  if (!UUID_REGEX.test(id)) {
    return new Response(JSON.stringify({ error: 'Producto no encontrado.' }), { status: 404 });
  }

  try {
    const product = await getPublishedProductById(cookies, id);
    if (!product) {
      return new Response(JSON.stringify({ error: 'Producto no encontrado.' }), { status: 404 });
    }
    return new Response(JSON.stringify(product), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500 });
  }
};