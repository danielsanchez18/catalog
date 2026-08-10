# 0001: Stack tecnológico

Fecha: 2026-08-09
Estado: aceptado

## Contexto

Se inicia un catálogo de productos de vendedor único. Se necesita una base que permita un MVP rápido
(catálogo público + CRUD de productos), con backend administrado, seguridad sencilla (RLS) y mínima
fricción de operación.

## Decisión

Usar:

- **Astro 7** como framework: páginas estáticas/SSR y componentes ligeros.
- **Supabase** como backend administrado: PostgreSQL (datos), Auth (administración) y Storage (imágenes, a futuro).
- **Tailwind CSS + shadcn/ui** para la interfaz.
- **TypeScript** estricto y **pnpm** como gestor de paquetes.

## Alternativas consideradas

- **Next.js**: cubre SSR y API, pero agrega complejidad innecesaria para este alcance; Astro rinde mejor con menos piezas.
- **Firebase**: equivalente a Supabase; se elige Supabase por SQL/RLS y Auth integrado.

## Consecuencias

- (+) MVP rápido con pocos servicios; seguridad mediante RLS sin servidor propio.
- (+) Catálogo SEO-friendly por SSR/SSG.
- (−) Dependencia de un proveedor administrado (Supabase) para la base de datos.
- (−) Interactividad compleja (carrito/checkout) requerirá islas o repensar la arquitectura en fases futuras.
