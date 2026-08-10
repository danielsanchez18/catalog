# Módulo: Productos

Estado: **por definir — primer módulo del MVP**

## Objetivo

Gestionar los productos que se muestran en el catálogo: crear, leer, editar, publicar/despublicar y eliminar.

## Alcance

### Incluye

- CRUD completo desde la zona admin.
- Validación de datos al crear/editar.
- Estados de publicación (borrador / publicado).

### No incluye (por ahora)

- Imágenes (fase 3, Supabase Storage).
- Categorías / marcas (fase 2).
- Variantes, stock o inventario.
- Precios con descuento u ofertas.

## Reglas de negocio

1. Un producto se crea en estado **borrador** y solo es visible en el catálogo cuando se **publica**.
2. Campos obligatorios para **publicar**: `nombre`, `descripcion`, `precio`.
3. `precio` debe ser **> 0** (moneda por confirmar).
4. Solo el admin puede crear/editar/eliminar productos (ver `docs/auth/README.md`).
5. Eliminar un producto lo quita del catálogo de forma definitiva.

## Flujo de CRUD

1. Admin inicia sesión y entra a `/admin/productos`.
2. Ve la lista de productos con su estado (borrador / publicado).
3. Crea/edita con un formulario validado → guarda en Supabase.
4. Publica/despublica con un toggle.
5. Elimina con confirmación.

## Modelo de datos (tabla `productos`)

| Columna        | Tipo        | Notas                                     |
| -------------- | ----------- | ----------------------------------------- |
| id             | uuid        | PK, default `gen_random_uuid()`           |
| nombre         | text        | Obligatorio                               |
| descripcion    | text        | Obligatorio                               |
| precio         | numeric     | > 0                                       |
| estado         | text        | `borrador` \| `publicado`                 |
| created_at     | timestamptz | default `now()`                           |
| updated_at     | timestamptz | default `now()`                           |
| (futuro) imagen_url | text   | Fase 3                                    |
| (futuro) categoria_id | uuid FK | Fase 2                                |

> El esquema definitivo (tipos, constraints, RLS, índices) se define como script SQL + ADR antes de implementar.

## Decisiones pendientes

- Usar `estado` (text/enum) en lugar de `publicado` (boolean) para permitir más estados a futuro.
- Validaciones: ¿a nivel de app únicamente, o también con constraints en la base?
- Moneda del precio.

## Referencias

- `docs/general/flujos.md`
- `docs/auth/README.md`
- `docs/adr/`
