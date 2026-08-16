-- 0002_servicios.sql
-- Esquema: tabla servicios con RLS para vendedor único (owner_id).

create extension if not exists "pgcrypto";

create table if not exists public.servicios (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  nombre text not null,
  descripcion_corta text not null,
  descripcion_larga text not null default '',
  precio_minimo numeric(12, 2) not null check (precio_minimo > 0),
  estado text not null default 'borrador' check (estado in ('borrador', 'publicado', 'eliminado')),
  imagen_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists servicios_owner_idx on public.servicios (owner_id);
create index if not exists servicios_estado_idx on public.servicios (estado);

-- Trigger updated_at (la funcion set_updated_at ya existe desde 0001_productos)
drop trigger if exists servicios_set_updated_at on public.servicios;
create trigger servicios_set_updated_at
  before update on public.servicios
  for each row
  execute function public.set_updated_at();

-- RLS
alter table public.servicios enable row level security;

-- Lectura pública: solo servicios publicados
drop policy if exists "servicios_select_public" on public.servicios;
create policy "servicios_select_public"
  on public.servicios
  for select
  using (estado = 'publicado');

-- Lectura del propietario: todos sus servicios (incl. borrador y eliminado)
drop policy if exists "servicios_select_owner" on public.servicios;
create policy "servicios_select_owner"
  on public.servicios
  for select
  using (auth.uid() = owner_id);

-- Inserción: solo el propietario
drop policy if exists "servicios_insert_owner" on public.servicios;
create policy "servicios_insert_owner"
  on public.servicios
  for insert
  with check (auth.uid() = owner_id);

-- Actualización: solo el propietario
drop policy if exists "servicios_update_owner" on public.servicios;
create policy "servicios_update_owner"
  on public.servicios
  for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- No hay política de delete: el borrado es lógico (estado = 'eliminado').