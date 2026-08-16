import type { APIRoute } from 'astro';
import { createClient } from '@/lib/supabase/server';
import { softDeleteProduct, updateProduct } from '@/lib/db/products';
import type { ProductCategory, ProductTag } from '@/lib/types';

export const prerender = false;

export const PATCH: APIRoute = async ({ request, cookies, params }) => {
  const supabase = createClient(cookies);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: 'No autorizado.' }), { status: 401 });
  }

  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ error: 'Falta el id del producto.' }), { status: 400 });
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
    const product = await updateProduct(cookies, id, {
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
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ cookies, params }) => {
  const supabase = createClient(cookies);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: 'No autorizado.' }), { status: 401 });
  }

  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ error: 'Falta el id del producto.' }), { status: 400 });
  }

  try {
    await softDeleteProduct(cookies, id);
    return new Response(null, { status: 204 });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500 });
  }
};