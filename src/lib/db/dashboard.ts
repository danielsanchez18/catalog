import type { AstroCookies } from 'astro';
import { createClient } from '@/lib/supabase/server';
import type { Product } from '@/lib/types';

export interface DashboardStats {
  totalProductos: number;
  publicados: number;
  borradores: number;
}

export async function getDashboardStats(cookies: AstroCookies): Promise<DashboardStats> {
  const supabase = createClient(cookies);

  const [{ count: total }, { count: publicados }, { count: borradores }] = await Promise.all([
    supabase.from('productos').select('id', { count: 'exact', head: true }).neq('estado', 'eliminado'),
    supabase.from('productos').select('id', { count: 'exact', head: true }).eq('estado', 'publicado'),
    supabase.from('productos').select('id', { count: 'exact', head: true }).eq('estado', 'borrador'),
  ]);

  return {
    totalProductos: total ?? 0,
    publicados: publicados ?? 0,
    borradores: borradores ?? 0,
  };
}

export async function getRecentProducts(
  cookies: AstroCookies,
  limit = 5
): Promise<Product[]> {
  const supabase = createClient(cookies);
  const { data, error } = await supabase
    .from('productos')
    .select('id, nombre, descripcion_corta, descripcion_larga, precio, categoria, etiqueta, estado, imagen_url, created_at, updated_at')
    .neq('estado', 'eliminado')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    id: row.id as string,
    nombre: row.nombre as string,
    descripcion_corta: row.descripcion_corta as string,
    descripcion_larga: row.descripcion_larga as string,
    precio: Number(row.precio),
    categoria: row.categoria as Product['categoria'],
    etiqueta: (row.etiqueta as Product['etiqueta']) ?? undefined,
    estado: row.estado as Product['estado'],
    imagen_url: (row.imagen_url as string | null) ?? undefined,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  }));
}

export async function getProfileName(cookies: AstroCookies): Promise<string> {
  const supabase = createClient(cookies);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const fullName = user?.user_metadata?.full_name as string | undefined;
  if (fullName) {
    return fullName;
  }

  return user?.email ?? 'usuario';
}