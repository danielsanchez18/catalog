# Módulo: Catálogo público

Estado: **por definir — fase 2 del MVP**

## Objetivo

Mostrar a los visitantes los productos publicados: listado, detalle y navegación básica.

## Alcance

### Incluye

- Home con el listado de productos **publicados**.
- Página de detalle por producto.
- Búsqueda / filtros básicos (criterios por definir).

### No incluye (por ahora)

- Carrito y checkout.
- Cuentas de visitante.
- Contacto / mensajería.
- Reseñas y valoraciones.

## Reglas de negocio

1. Solo se muestran productos en estado **`publicado`**.
2. El listado ordena por fecha de creación/publicación, más reciente primero.
3. El detalle usa una URL canónica y SEO-friendly por producto (`slug` o `id`).

## Flujo del visitante

1. Entra al home → ve el listado de productos publicados.
2. Busca o filtra (criterios por definir: nombre, rango de precio).
3. Hace clic en un producto → ve el detalle completo.

## Consideraciones técnicas

- Renderizado **SSR/estático** desde Astro leyendo Supabase → SEO-friendly.
- Rutas: `/` (listado) y `/productos/[slug]` (detalle).
- Se puede combinar con regeneración incremental (ISR) para escalar sin perder frescura.

## Decisiones pendientes

- URL de detalle: `/producto/[slug]` vs `/productos/[id]`.
- Búsqueda: texto libre en la app vs `ilike` sobre Postgres.
- Criterios de filtro a exponer.

## Referencias

- `docs/general/flujos.md`
- `docs/productos/README.md`
- `docs/adr/`
