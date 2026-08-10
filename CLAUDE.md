# AGENTS.md

Guía de trabajo para agentes de IA en este repositorio. Léela completa antes de empezar.

## Proyecto

Aplicación web tipo catálogo/tienda de **vendedor único**: publica productos, un catálogo público los
muestra y permite consultarlos.

Stack técnico:

- **Astro 7** + **TypeScript** (estricto) como framework.
- **Supabase** como backend administrado: PostgreSQL (datos), Auth (administración), Storage (imágenes, a futuro).
- **Tailwind CSS + shadcn/ui** para la interfaz.
- **pnpm** como gestor de paquetes.

Principio de arquitectura: páginas estáticas/SSR generadas por Astro; interactividad con islas
(Astro Islands) solo cuando sea imprescindible; Supabase como única fuente de datos.

## Comandos

- Servidor de desarrollo (siempre en segundo plano): `astro dev --background`
- Gestionar el servidor: `astro dev stop`, `astro dev status`, `astro dev logs`
- Instalar dependencias: `pnpm install`
- Build de producción: `pnpm build`
- Preview del build: `pnpm preview`
- CLI de Astro: `pnpm astro` (ej. `pnpm astro check`)

## Mapa de documentación

**Regla de oro:** antes de tocar código de un módulo, lee su documentación en `docs/`.
La documentación está separada por módulo para no cargar contexto innecesario.

| Antes de trabajar en...                  | Lee                                              |
| ---------------------------------------- | ------------------------------------------------ |
| Cualquier tarea                          | `docs/README.md` (índice maestro)                |
| Stack, alcance y roadmap                 | `docs/general/proyecto.md`                       |
| Decisiones de arquitectura               | `docs/general/arquitectura.md`                   |
| Convenciones de código y repo            | `docs/general/convenciones.md`                   |
| UI, estilos, tokens de diseño            | `docs/general/diseno.md`                         |
| Flujos generales de la aplicación        | `docs/general/flujos.md`                         |
| Auth / login / rutas de administración   | `docs/auth/README.md`                            |
| CRUD y reglas de negocio de productos    | `docs/productos/README.md`                       |
| Catálogo público, detalle, búsqueda      | `docs/catalogo/README.md`                        |
| Decidir algo técnicamente significativo  | `docs/adr/` (registrar decisión)                 |

## Reglas de documentación

1. Toda decisión técnica significativa se registra como ADR en `docs/adr/` (ver formato en `docs/adr/README.md`).
2. Nuevo módulo ⇒ crear carpeta en `docs/` con su `README.md`, y actualizar este mapa y `docs/README.md`.
3. Documentación en **español**; nombres de archivo en `kebab-case`.
4. Mantener `docs/README.md` siempre al día como índice fiel.
5. No duplicar contexto: los detalles viven en el módulo correspondiente, no en este archivo.

## Convenciones de código (resumen)

- Código e identificadores en **inglés**; textos visibles al usuario en **español**.
- TypeScript estricto; evitar `any` (si es inevitable, justificarlo).
- Sin comentarios salvo que se pida; el código debe leerse por sí solo.
- Astro nativo por defecto; agregar islas de framework solo cuando haga falta interactividad.
- UI con Tailwind + shadcn/ui siguiendo `docs/general/diseno.md`.
- Respetar la estructura de `src/` (`pages`, `layouts`, `components`, `lib`) y extenderla solo con justificación.
- Detalle completo en `docs/general/convenciones.md`.

## Definición de terminado (DoD)

- Cambios verificados con `pnpm build` (o el dev server) sin errores.
- Si aplica, documentación del módulo actualizada en `docs/`.
- Decisiones nuevas registradas como ADR en `docs/adr/`.
