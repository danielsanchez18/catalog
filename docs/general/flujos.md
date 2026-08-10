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

- `borrador`: visible solo en la zona admin.
- `publicado`: visible en el catálogo público.

## Flujos transversales

1. **Navegación del visitante**: home → listado del catálogo → detalle de producto.
2. **Gestión del admin**: login → panel `/admin` → CRUD de productos → publicar/despublicar.
3. **Datos**: las mutaciones pasan por Supabase y requieren sesión; las rutas públicas solo leen.

## Detalle por módulo

- Autenticación: `docs/auth/README.md`
- Productos (CRUD y reglas): `docs/productos/README.md`
- Catálogo público: `docs/catalogo/README.md`
