# Módulo: Equipo (Team)

Gestión de los usuarios que pueden iniciar sesión y administrar el catálogo. Todos los miembros del
equipo comparten el **mismo catálogo** (productos y servicios); no hay catálogos por miembro.

## Reglas de negocio

- Solo los miembros registrados en la tabla `public.team` pueden operar el dashboard.
- El catálogo es compartido: cualquier miembro ve y edita los mismos productos y servicios.
- El admin inicial (Daniel Sanchez) queda sembrado como miembro en la migración `0003_team.sql`.
- Crear/editar un miembro crea o actualiza la cuenta en `auth.users` (service role) y su fila en
  `team`.
- Eliminar un miembro **borra físicamente la cuenta** de Supabase (`auth.admin.deleteUser`); la fila
  en `team` se elimina por `on delete cascade`.
- Un miembro **no puede eliminarse a sí mismo** (protegido en la API `/api/team/[id].ts`).

## Estructura

- `supabase/migrations/0003_team.sql`: tabla `team`, función `is_team_member()`, RLS compartido en
  `productos`/`servicios` y seed del admin. Ver `docs/adr/0004-equipo-catalogo-compartido.md`.
- `src/lib/types.ts`: tipo `TeamMember`.
- `src/lib/db/team.ts`: `getTeamMembers`, `createTeamMember`, `updateTeamMember`,
  `deleteTeamMember`.
- `src/lib/supabase/admin.ts`: cliente con `SUPABASE_SERVICE_ROLE_KEY` para `auth.admin.*` (solo
  server-side; la key nunca debe llegar al cliente ni versionarse).
- `src/pages/api/team.ts` (GET/POST) y `src/pages/api/team/[id].ts` (PATCH/DELETE).
- Página: `src/pages/dashboard/team/index.astro`; secciones en `src/sections/dashboard/team/`;
  componentes en `src/components/dashboard/team/` y `src/components/dashboard/TeamTable.tsx`.
- El detalle de un miembro **no es una página**: ver, agregar y editar se hacen con dialogs
  (`TeamViewDialog`, `TeamFormDialog`, `AddMemberButton` en `TeamActions.tsx`). Al guardar/eliminar,
  los componentes disparan el evento `team:changed` para que la tabla se refresque.

## Notas de seguridad

- `SUPABASE_SERVICE_ROLE_KEY` vive solo en `.env` (no versionado) y se usa exclusivamente del lado del
  servidor.
- Los endpoints validan la sesión (`requireUser`) y el RLS de `team` restringe lectura/escritura a
  miembros.
- La función `is_team_member()` es `security definer` con `search_path = public` para evitar
  recursión de RLS.