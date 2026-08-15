# Flujos generales de la aplicación

Estado: propuesto

## Roles

- **Visitante**: navega y consulta el catálogo. Sin cuenta.
- **Admin (único)**: gestiona los productos. Se autentica con Supabase Auth.

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
2. **Gestión del admin**: login → panel `/dashboard` → CRUD de productos → publicar/despublicar.
3. **Datos**: las mutaciones pasan por Supabase y requieren sesión; las rutas públicas solo leen.

## Detalle por módulo

- Autenticación: `docs/auth/README.md`
- Productos (CRUD y reglas): `docs/productos/README.md`
- Servicios (CRUD y reglas): `docs/servicios/README.md`
- Catálogo público: `docs/catalogo/README.md`
