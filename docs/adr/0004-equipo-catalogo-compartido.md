# 0004: Equipo con catálogo compartido (multi-admin)

Fecha: 2026-08-15
Estado: aceptado

## Contexto

El proyecto era de vendedor único: un solo admin (Daniel Sanchez) gestionaba productos y servicios,
y el RLS de `productos` y `servicios` restringía cada fila a su `owner_id` (`auth.uid() = owner_id`).
El dueño quiere invitar más personas al equipo para que también puedan iniciar sesión y gestionar el
mismo catálogo, no cada quien el suyo.

## Decisión

- Nueva tabla `public.team` que registra los ids de `auth.users` que son miembros del equipo
  (referencia con `on delete cascade`).
- Función `public.is_team_member()` (security definer) que comprueba si el usuario autenticado está
  en `team`.
- El RLS de `productos` y `servicios` deja de usar `owner_id` y pasa a permitir SELECT/INSERT/UPDATE
  a cualquier miembro del equipo (`is_team_member()`). El catálogo es **compartido**: todos ven y
  editan los mismos registros.
- La gestión del equipo (crear/editar/eliminar miembros) usa la **service role key** de Supabase
  (`auth.admin.*`) desde `src/lib/supabase/admin.ts`, expuesta únicamente en endpoints/páginas del
  servidor. Eliminar un miembro borra físicamente la cuenta (`auth.admin.deleteUser`); el registro en
  `team` se elimina por cascade.
- El borrado de productos/servicios sigue siendo lógico (estado `eliminado`, ver ADR-0003).

## Consecuencias

- (+) Varias personas pueden operar el mismo catálogo con sus propias credenciales.
- (+) El `owner_id` se conserva como dato histórico sin condicionar el acceso.
- (−) Cualquier miembro del equipo tiene control total sobre el catálogo (no hay roles finos todavía).
- (−) La service role key debe manejarse con cuidado: solo se usa del lado del servidor y nunca debe
  filtrarse al cliente ni versionarse en el repositorio (está en `.env`, no versionado).
- (−) No se puede eliminar la propia cuenta desde el dashboard (protección en la API).