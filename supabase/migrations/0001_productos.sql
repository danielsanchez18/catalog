-- 0001_productos.sql
-- Esquema inicial: tabla productos con RLS para vendedor único (owner_id).

create extension if not exists "pgcrypto";

create table if not exists public.productos (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  nombre text not null,
  descripcion_corta text not null,
  descripcion_larga text not null default '',
  precio numeric(12, 2) not null check (precio > 0),
  categoria text not null default 'papeleria' check (categoria in ('papeleria', 'bisuteria', 'cuidado_personal')),
  etiqueta text check (etiqueta in ('nuevo', 'promocion')),
  estado text not null default 'borrador' check (estado in ('borrador', 'publicado', 'eliminado')),
  imagen_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists productos_owner_idx on public.productos (owner_id);
create index if not exists productos_estado_idx on public.productos (estado);

-- Trigger updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists productos_set_updated_at on public.productos;
create trigger productos_set_updated_at
  before update on public.productos
  for each row
  execute function public.set_updated_at();

-- RLS
alter table public.productos enable row level security;

-- Lectura pública: solo productos publicados
drop policy if exists "productos_select_public" on public.productos;
create policy "productos_select_public"
  on public.productos
  for select
  using (estado = 'publicado');

-- Lectura del propietario: todos sus productos (incl. borrador y eliminado)
drop policy if exists "productos_select_owner" on public.productos;
create policy "productos_select_owner"
  on public.productos
  for select
  using (auth.uid() = owner_id);

-- Inserción: solo el propietario
drop policy if exists "productos_insert_owner" on public.productos;
create policy "productos_insert_owner"
  on public.productos
  for insert
  with check (auth.uid() = owner_id);

-- Actualización: solo el propietario
drop policy if exists "productos_update_owner" on public.productos;
create policy "productos_update_owner"
  on public.productos
  for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- No hay política de delete: el borrado es lógico (estado = 'eliminado').