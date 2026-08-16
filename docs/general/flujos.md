# Flujos generales de la aplicación

Estado: propuesto

## Roles

- **Visitante**: navega y consulta el catálogo. Sin cuenta.
- **Miembro del equipo (admin)**: gestiona productos y servicios, y puede invitar/eliminar a otros
  miembros. Se autentica con Supabase Auth. Todos comparten el mismo catálogo (ver
  `docs/team/README.md` y ADR-0004).

## Ciclo de vida de un producto

```
[Admin crea producto] ──▶ [estado: borrador] ──▶ [Admin publica] ──▶ [estado: publicado]
                                                                          │
[Admin despublica / elimina] ◀─────────────────────────────────────────────┘
```

- `borrador`: visible solo en el dashboard.
- `publicado`: visible en el catálogo público.
- `eliminado`: borrado lógico; no visible en ningún lado (ver ADR-0003).

## Ciclo de vida de un servicio

Idéntico al de productos: `borrador` → `publicado` (visible en el catálogo), y `eliminado` como
borrado lógico desde el dashboard.

## Flujos transversales

1. **Navegación del visitante**: home → listado del catálogo → detalle de producto.
2. **Gestión del admin**: login → panel `/dashboard` → CRUD de productos/servicios → publicar/despublicar.
3. **Gestión del equipo**: login → `/dashboard/team` → crear/editar/eliminar miembros (eliminar borra
   la cuenta de Supabase).
4. **Datos**: las mutaciones pasan por Supabase y requieren sesión; las rutas públicas solo leen.

## Protección de rutas

Toda la zona de administración y sus APIs están protegidas por el middleware en `src/middleware.ts`:

- `/dashboard/*`: sin sesión → redirige a `/login`; con sesión pero sin estar en `public.team` →
  redirige a `/login`.
- `/api/*`: solo permitido para miembros del equipo. Sin sesión → `401`; con sesión pero no-miembro →
  `403`. Excepciones públicas: `/api/auth/login` y `/api/auth/logout`.
- `/login`: si ya hay sesión y el usuario es miembro → redirige a `/dashboard`.
- El login también valida membrecía: un usuario con cuenta pero fuera de `team` recibe `403` y su
  sesión se cierra.

Los endpoints `src/pages/api/**` además verifican sesión individualmente con
`supabase.auth.getUser()` (defensa en profundidad) y todas las páginas SSR usan
`export const prerender = false` para que el middleware aplique.

## Detalle por módulo

- Autenticación: `docs/auth/README.md`
- Productos (CRUD y reglas): `docs/productos/README.md`
- Servicios (CRUD y reglas): `docs/servicios/README.md`
- Equipo y acceso de admin: `docs/team/README.md`
- Catálogo público: `docs/catalogo/README.md`
