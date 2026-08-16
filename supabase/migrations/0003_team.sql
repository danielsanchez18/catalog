-- 0003_team.sql
-- Equipo: tabla team + RLS compartido de catálogo (productos y servicios).
-- Cualquier miembro del equipo puede ver y gestionar el mismo catálogo.

create extension if not exists "pgcrypto";

-- Tabla de miembros del equipo (los ids referencian auth.users)
create table if not exists public.team (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  created_at timestamptz not null default now()
);

create index if not exists team_created_idx on public.team (created_at);

-- Función helper: ¿el usuario autenticado es miembro del equipo?
-- security definer para evitar recursión de RLS al consultar la propia tabla.
create or replace function public.is_team_member()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.team where user_id = auth.uid()
  );
$$;

grant execute on function public.is_team_member() to authenticated, anon;

-- RLS de la tabla team: solo miembros del equipo la leen y administran
alter table public.team enable row level security;

drop policy if exists "team_select_member" on public.team;
create policy "team_select_member"
  on public.team
  for select
  using (public.is_team_member());

drop policy if exists "team_insert_member" on public.team;
create policy "team_insert_member"
  on public.team
  for insert
  with check (public.is_team_member());

drop policy if exists "team_update_member" on public.team;
create policy "team_update_member"
  on public.team
  for update
  using (public.is_team_member())
  with check (public.is_team_member());

drop policy if exists "team_delete_member" on public.team;
create policy "team_delete_member"
  on public.team
  for delete
  using (public.is_team_member());

-- Seed: el admin inicial (Daniel Sanchez) queda como miembro
insert into public.team (user_id, email, full_name)
values ('2b031022-1195-49fd-af86-655bab272e17', 'dsanchez151r@gmail.com', 'Daniel Sanchez')
on conflict (user_id) do nothing;

-- ── RLS compartido en productos ──────────────────────────────────────────────

-- Reemplaza la política "owner" por "miembro del equipo"
drop policy if exists "productos_select_owner" on public.productos;
create policy "productos_select_member"
  on public.productos
  for select
  using (public.is_team_member());

drop policy if exists "productos_insert_owner" on public.productos;
create policy "productos_insert_member"
  on public.productos
  for insert
  with check (public.is_team_member());

drop policy if exists "productos_update_owner" on public.productos;
create policy "productos_update_member"
  on public.productos
  for update
  using (public.is_team_member())
  with check (public.is_team_member());

-- ── RLS compartido en servicios ──────────────────────────────────────────────

drop policy if exists "servicios_select_owner" on public.servicios;
create policy "servicios_select_member"
  on public.servicios
  for select
  using (public.is_team_member());

drop policy if exists "servicios_insert_owner" on public.servicios;
create policy "servicios_insert_member"
  on public.servicios
  for insert
  with check (public.is_team_member());

drop policy if exists "servicios_update_owner" on public.servicios;
create policy "servicios_update_member"
  on public.servicios
  for update
  using (public.is_team_member())
  with check (public.is_team_member());

-- Nota: el borrado físico de un miembro se hace con auth.admin.deleteUser
-- (service role) y el registro en team se elimina por cascade.
-- No hay política de delete en productos/servicios: el borrado es lógico.