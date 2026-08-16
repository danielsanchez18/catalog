import type { AstroCookies } from 'astro';
import { createClient } from '@/lib/supabase/server';
import type { Service } from '@/lib/types';

export interface ServiceInput {
  nombre: string;
  descripcion_corta: string;
  descripcion_larga: string;
  precio_minimo: number;
  estado: 'borrador' | 'publicado' | 'eliminado';
  imagen_url?: string;
}

const SELECT =
  'id, nombre, descripcion_corta, descripcion_larga, precio_minimo, estado, imagen_url, created_at, updated_at';

function mapRow(row: Record<string, unknown>): Service {
  return {
    id: row.id as string,
    nombre: row.nombre as string,
    descripcion_corta: row.descripcion_corta as string,
    descripcion_larga: row.descripcion_larga as string,
    precio_minimo: Number(row.precio_minimo),
    estado: row.estado as Service['estado'],
    imagen_url: (row.imagen_url as string | null) ?? undefined,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

export async function getServices(cookies: AstroCookies): Promise<Service[]> {
  const supabase = createClient(cookies);
  const { data, error } = await supabase
    .from('servicios')
    .select(SELECT)
    .neq('estado', 'eliminado')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapRow);
}

export async function getServiceById(
  cookies: AstroCookies,
  id: string
): Promise<Service | null> {
  const supabase = createClient(cookies);
  const { data, error } = await supabase
    .from('servicios')
    .select(SELECT)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapRow(data) : null;
}

export async function createService(
  cookies: AstroCookies,
  input: ServiceInput
): Promise<Service> {
  const supabase = createClient(cookies);
  const { data, error } = await supabase
    .from('servicios')
    .insert({
      nombre: input.nombre,
      descripcion_corta: input.descripcion_corta,
      descripcion_larga: input.descripcion_larga,
      precio_minimo: input.precio_minimo,
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

export async function updateService(
  cookies: AstroCookies,
  id: string,
  input: ServiceInput
): Promise<Service> {
  const supabase = createClient(cookies);
  const { data, error } = await supabase
    .from('servicios')
    .update({
      nombre: input.nombre,
      descripcion_corta: input.descripcion_corta,
      descripcion_larga: input.descripcion_larga,
      precio_minimo: input.precio_minimo,
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

export async function softDeleteService(cookies: AstroCookies, id: string): Promise<void> {
  const supabase = createClient(cookies);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('No autorizado.');
  }

  const { error } = await supabase
    .from('servicios')
    .update({ estado: 'eliminado' })
    .eq('id', id)
    .eq('owner_id', user.id);

  if (error) {
    throw new Error(error.message);
  }
}