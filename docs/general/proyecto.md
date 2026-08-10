# Proyecto

Estado: borrador inicial

## Propósito

Aplicación web tipo catálogo/tienda de **vendedor único**. Técnicamente se compone de dos caras:

- **Catálogo público**: muestra los productos publicados y permite consultarlos.
- **Zona de administración**: el admin gestiona los productos (crear, editar, publicar/despublicar, eliminar).

## Stack tecnológico

| Capa               | Tecnología                 | Notas                                        |
| ------------------ | -------------------------- | -------------------------------------------- |
| Framework          | Astro 7                    | Estático + SSR según ruta                    |
| Lenguaje           | TypeScript                 | Modo estricto                                |
| Islas de UI        | React 19 (`@astrojs/react`)| Solo para componentes interactivos (shadcn)  |
| Base de datos      | Supabase (PostgreSQL)      | Única fuente de datos                        |
| Autenticación      | Supabase Auth              | Admin único                                  |
| Storage            | Supabase Storage           | Imágenes de productos (a futuro)             |
| UI                 | Tailwind v4 + shadcn/ui (Base UI) + @tailwindcss/forms | Ver `docs/general/diseno.md` |
| Tipografía         | Fontsource (Inter, Inter Tight, JetBrains Mono, Oswald) | Fuentes auto-alojadas |
| Paquete            | pnpm                       | Workspace ya preparado (`pnpm-workspace.yaml`) |

## Alcance

### MVP (en curso)

- **CRUD de productos** desde la zona admin (protegida).
- **Catálogo público**: listado y detalle de productos publicados.

### Fuera de alcance por ahora

- Carrito y checkout.
- Multi-vendedor.
- Contacto / mensajería (WhatsApp, etc.).
- Pagos en línea.
- Reseñas y valoraciones.

## Roadmap (orientativo)

| Fase                  | Contenido                                                            |
| --------------------- | ------------------------------------------------------------------- |
| **0 — Cimientos**     | Supabase, Tailwind + shadcn/ui, estructura de carpetas, documentación |
| **1 — Productos**     | Modelo de datos, CRUD admin, auth mínimo (protección de rutas)      |
| **2 — Catálogo**      | Listado público, detalle, búsqueda y filtros                        |
| **3 — Contenido**     | Imágenes (Storage), SEO, pulido visual                              |

> El detalle de cada fase puede ajustarse; las decisiones se registran en `docs/adr/`.

## Variables de entorno

- `.env` (ignorado por git) contiene credenciales de Supabase (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, etc.).
- Nunca versionar secretos.
