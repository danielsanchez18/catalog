import type { AstroCookies } from 'astro';
import { createClient } from '@/lib/supabase/server';
import type { Product, ProductCategory, ProductTag } from '@/lib/types';

export interface ProductInput {
  nombre: string;
  descripcion_corta: string;
  descripcion_larga: string;
  precio: number;
  categoria: ProductCategory;
  etiqueta?: ProductTag;
  estado: 'borrador' | 'publicado' | 'eliminado';
  imagen_url?: string;
}

const SELECT = 'id, nombre, descripcion_corta, descripcion_larga, precio, categoria, etiqueta, estado, imagen_url, created_at, updated_at';

function mapRow(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    nombre: row.nombre as string,
    descripcion_corta: row.descripcion_corta as string,
    descripcion_larga: row.descripcion_larga as string,
    precio: Number(row.precio),
    categoria: row.categoria as ProductCategory,
    etiqueta: (row.etiqueta as ProductTag | null) ?? undefined,
    estado: row.estado as Product['estado'],
    imagen_url: (row.imagen_url as string | null) ?? undefined,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

export async function getProducts(cookies: AstroCookies): Promise<Product[]> {
  const supabase = createClient(cookies);
  const { data, error } = await supabase
    .from('productos')
    .select(SELECT)
    .neq('estado', 'eliminado')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapRow);
}

export async function getProductById(cookies: AstroCookies, id: string): Promise<Product | null> {
  const supabase = createClient(cookies);
  const { data, error } = await supabase
    .from('productos')
    .select(SELECT)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapRow(data) : null;
}

export async function createProduct(cookies: AstroCookies, input: ProductInput): Promise<Product> {
  const supabase = createClient(cookies);
  const { data, error } = await supabase
    .from('productos')
    .insert({
      nombre: input.nombre,
      descripcion_corta: input.descripcion_corta,
      descripcion_larga: input.descripcion_larga,
      precio: input.precio,
      categoria: input.categoria,
      etiqueta: input.etiqueta ?? null,
      estado: input.estado,
      imagen_url: input.imagen_url ?? null,
    })
    .select(SELECT)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapRow(data);
}

export async function updateProduct(
  cookies: AstroCookies,
  id: string,
  input: ProductInput
): Promise<Product> {
  const supabase = createClient(cookies);
  const { data, error } = await supabase
    .from('productos')
    .update({
      nombre: input.nombre,
      descripcion_corta: input.descripcion_corta,
      descripcion_larga: input.descripcion_larga,
      precio: input.precio,
      categoria: input.categoria,
      etiqueta: input.etiqueta ?? null,
      estado: input.estado,
      imagen_url: input.imagen_url ?? null,
    })
    .eq('id', id)
    .select(SELECT)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapRow(data);
}

export async function softDeleteProduct(cookies: AstroCookies, id: string): Promise<void> {
  const supabase = createClient(cookies);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('No autorizado.');
  }

  const { error } = await supabase
    .from('productos')
    .update({ estado: 'eliminado' })
    .eq('id', id)
    .eq('owner_id', user.id);

  if (error) {
    throw new Error(error.message);
  }
}