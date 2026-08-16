import type { APIRoute } from 'astro';
import { getPublishedProducts } from '@/lib/db/products';

export const prerender = false;

export const GET: APIRoute = async ({ cookies }) => {
  try {
    const products = await getPublishedProducts(cookies);
    return new Response(JSON.stringify(products), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500 });
  }
};