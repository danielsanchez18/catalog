# Arquitectura

Estado: propuesta inicial — pendiente de revisión (ver `docs/adr/0001-stack-tecnologico.md`).

## Visión general

- **Astro como framework único**: las páginas se generan de forma estática o con SSR según la ruta.
- **Islas de interactividad**: solo los componentes que lo requieran se hidratan (Astro Islands con React, usadas por shadcn/ui).
- **Supabase como backend administrado**: base de datos, auth y storage en un solo proveedor.
- **Supabase como única fuente de datos**: Astro no mantiene estado propio; los componentes leen desde el servidor y las mutaciones pasan por rutas/acciones protegidas.

## Flujo de datos (alto nivel)

```
[Visitante] ──▶ Astro (SSR/SSG) ──▶ Supabase Postgres   (lectura pública)
[Admin]     ──▶ Rutas /admin/*    ──▶ Supabase Auth + Postgres + Storage   (escritura)
```

## Decisiones clave

1. **Vendedor único**: el modelo de datos no necesita roles complejos; con RLS basta para permitir solo al dueño.
2. **Catálogo SEO-friendly**: los productos se leen desde el servidor; el listado y detalle son indexables.
3. **Seguridad por defecto**: las mutaciones verifican sesión en el servidor; RLS habilitada en Postgres.

## Estructura de carpetas objetivo

```
src/
├── pages/          # Rutas (públicas y /admin)
├── layouts/        # Layouts globales
├── components/     # Componentes Astro y islas (ui/ para shadcn)
├── lib/            # Lógica de dominio, tipos y clientes de Supabase
└── styles/         # Tokens y CSS global (Tailwind)
```

## Referencias

- `docs/adr/0001-stack-tecnologico.md`
- `docs/adr/0002-shadcn-tailwind-ui.md`
- `docs/general/convenciones.md`
