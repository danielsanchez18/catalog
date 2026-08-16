import type { APIRoute } from 'astro';
import { createClient } from '@/lib/supabase/server';
import { createProduct, getProducts } from '@/lib/db/products';
import type { ProductCategory, ProductTag } from '@/lib/types';

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
    const products = await getProducts(cookies);
    return new Response(JSON.stringify(products), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  const supabase = createClient(cookies);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: 'No autorizado.' }), { status: 401 });
  }

  const body = await request.json().catch(() => null);

  const nombre = typeof body?.nombre === 'string' ? body.nombre.trim() : '';
  const descripcion_corta =
    typeof body?.descripcion_corta === 'string' ? body.descripcion_corta.trim() : '';
  const descripcion_larga =
    typeof body?.descripcion_larga === 'string' ? body.descripcion_larga.trim() : '';
  const precio = Number(body?.precio);
  const categoria = body?.categoria as ProductCategory;
  const etiqueta = body?.etiqueta as ProductTag | undefined;
  const estado = body?.estado as 'borrador' | 'publicado' | 'eliminado';
  const imagen_url = typeof body?.imagen_url === 'string' ? body.imagen_url.trim() : '';

  if (!nombre || !descripcion_corta || !Number.isFinite(precio) || precio <= 0) {
    return new Response(
      JSON.stringify({ error: 'Nombre, descripción corta y precio (mayor a 0) son obligatorios.' }),
      { status: 400 }
    );
  }

  try {
    const product = await createProduct(cookies, {
      nombre,
      descripcion_corta,
      descripcion_larga,
      precio,
      categoria,
      etiqueta: etiqueta || undefined,
      estado: estado === 'eliminado' ? 'borrador' : estado ?? 'borrador',
      imagen_url: imagen_url || undefined,
    });

    return new Response(JSON.stringify(product), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500 });
  }
};