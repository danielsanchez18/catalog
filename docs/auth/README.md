# Módulo: Autenticación (Auth)

Estado: **implementado (multi-admin con equipo)**

## Objetivo

Proteger la zona de administración del catálogo. Sin sesión válida no es posible crear, editar o
eliminar productos o servicios.

## Alcance

### Incluye

- Login/logout con **Supabase Auth** (email + contraseña).
- Protección de las rutas `/dashboard/*` (redirección a `/login` si no hay sesión).
- Verificación de sesión en el **servidor** para las mutaciones de datos.
- Acceso múltiple: los usuarios registrados en `public.team` pueden iniciar sesión y administrar el
  catálogo compartido (ver `docs/team/README.md`).

### No incluye (por ahora)

- Registro público de usuarios (la creación de cuentas la hace el admin vía el módulo Team).
- Flujo de recuperación de contraseña con UI.
- OAuth / proveedores sociales.
- Roles finos dentro del equipo (todos los miembros tienen el mismo acceso).

## Reglas de negocio

1. Solo los miembros de `public.team` pueden operar el dashboard; no hay registro público.
2. Las rutas bajo `/dashboard/*` redirigen a `/login` si no hay sesión.
3. Las mutaciones verifican sesión en el servidor, no solo en el cliente.
4. RLS en Postgres habilitada: lectura/escritura de `productos` y `servicios` para miembros del equipo
   (función `is_team_member()`), lectura pública solo de lo `publicado`.
5. La creación de cuentas de miembros usa la service role key (`auth.admin.*`) solo del lado del
   servidor.

## Flujo

1. Admin visita `/login` e ingresa credenciales.
2. Supabase Auth valida y emite la sesión.
3. El guard de Astro protege `/dashboard/*`.
4. Al cerrar sesión se vuelve a `/login`.

## Datos

- Usuarios en `auth.users` de Supabase; el registro de miembros del equipo vive en `public.team`.
- (Futuro) perfil de tienda con metadata si se requiere.

## Referencias

- `docs/team/README.md`
- `docs/general/flujos.md`
- `docs/adr/0004-equipo-catalogo-compartido.md`