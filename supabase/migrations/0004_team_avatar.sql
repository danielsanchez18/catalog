-- 0004_team_avatar.sql
-- Fotos de perfil de los miembros del equipo (como data URL base64, igual que imagen_url
-- de productos/servicios; Supabase Storage queda para una fase posterior).

alter table public.team
  add column if not exists avatar_url text;