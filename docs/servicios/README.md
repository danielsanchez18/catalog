# Módulo: Servicios

Estado: **por definir — CRUD del dashboard implementado con datos mock**

## Objetivo

Gestionar los servicios que se muestran en el catálogo: crear, leer, editar, publicar/despublicar y
eliminar, con el mismo flujo que el módulo de productos.

## Alcance

### Incluye

- CRUD completo desde la zona admin (`/dashboard/servicios`).
- Validación de datos al crear/editar.
- Estados de publicación (borrador / publicado) y borrado lógico (eliminado).

### No incluye (por ahora)

- Imágenes (fase 3, Supabase Storage).
- Categorías o tipos de servicio.
- Precios finales por cotización o tarifas variables.

## Reglas de negocio

1. Un servicio se crea en estado **borrador** y solo es visible en el catálogo cuando se **publica**.
2. Campos obligatorios para **publicar**: `nombre`, `descripcion_corta`, `precio_minimo`.
3. `precio_minimo` debe ser **> 0** (moneda MXN).
4. Solo el admin puede crear/editar/eliminar servicios (ver `docs/auth/README.md`).
5. Eliminar un servicio es un **borrado lógico**: pasa a estado `eliminado` y deja de mostrarse en el
   catálogo, pero el registro se conserva (misma decisión que en productos, ver ADR-0003).
6. `descripcion_corta` es la frase breve que se muestra en tarjetas y listados; `descripcion_larga`
   es el detalle completo de la página del servicio (mismo criterio que productos).

## Flujo de CRUD

1. Admin entra a `/dashboard/servicios`.
2. Ve la lista de servicios con su estado (borrador / publicado).
3. Crea/edita con un formulario validado.
4. Publica/despublica con un toggle en el formulario.
5. Elimina desde el detalle con confirmación (diálogo de acción).

## Rutas

| Ruta                                | Descripción                          |
| ----------------------------------- | ------------------------------------ |
| `/dashboard/servicios`              | Listado de servicios                 |
| `/dashboard/servicios/nuevo`        | Formulario de creación               |
| `/dashboard/servicios/[id]`         | Detalle de un servicio               |
| `/dashboard/servicios/[id]/editar`  | Formulario de edición                |
| `/servicios/[id]`                   | Detalle público (catálogo)           |

## Modelo de datos (tabla `servicios`)

| Columna             | Tipo        | Notas                                     |
| ------------------- | ----------- | ----------------------------------------- |
| id                  | uuid        | PK, default `gen_random_uuid()`           |
| nombre              | text        | Obligatorio                               |
| descripcion_corta   | text        | Obligatorio                               |
| descripcion_larga   | text        | Detalle completo del servicio             |
| precio_minimo       | numeric     | > 0                                       |
| estado              | text        | `borrador` \| `publicado` \| `eliminado`  |
| created_at          | timestamptz | default `now()`                           |
| updated_at          | timestamptz | default `now()`                           |
| (futuro) imagen_url | text        | Fase 3                                    |

> El esquema definitivo (tipos, constraints, RLS, índices) se define como script SQL + ADR antes de implementar.

## Referencias

- `docs/productos/README.md` (mismo flujo de CRUD)
- `docs/general/flujos.md`
- `docs/auth/README.md`
- `docs/adr/`
