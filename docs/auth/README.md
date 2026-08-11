# Módulo: Autenticación (Auth)

Estado: **mínimo — por implementar (fase 1)**

## Objetivo

Proteger la zona de administración del catálogo. Es un requisito mínimo para el CRUD de productos:
sin sesión válida no debe ser posible crear, editar o eliminar productos.

## Alcance

### Incluye

- Login/logout del admin único con **Supabase Auth** (email + contraseña).
- Protección de las rutas `/dashboard/*` (redirección a `/login` si no hay sesión).
- Verificación de sesión en el **servidor** para las mutaciones de datos.

### No incluye (por ahora)

- Registro público de usuarios.
- Flujo de recuperación de contraseña con UI.
- OAuth / proveedores sociales.
- Roles múltiples o multi-vendedor.

## Reglas de negocio

1. Existe **un solo admin**; no hay registro público.
2. Las rutas bajo `/dashboard/*` redirigen a `/login` si no hay sesión.
3. Las mutaciones verifican sesión en el servidor, no solo en el cliente.
4. RLS en Postgres habilitada: el admin es dueño (`owner`) de los datos de productos.

## Flujo

1. Admin visita `/login` e ingresa credenciales.
2. Supabase Auth valida y emite la sesión.
3. Un guard/middleware de Astro protege `/dashboard/*`.
4. Al cerrar sesión se vuelve a `/login`.

## Datos

- Sin tablas adicionales de usuario: se usa `auth.users` de Supabase.
- (Futuro) perfil de tienda con metadata si se requiere.

## Decisiones pendientes

- Método de login: email + contraseña de Supabase Auth (pendiente de confirmar como ADR).
- Persistencia de sesión en SSR: cookies gestionadas por Astro middleware (pendiente de confirmar).
- Almacenamiento de credenciales del admin inicial: seed en Supabase, no versionado.

## Referencias

- `docs/general/flujos.md`
- `docs/adr/`
