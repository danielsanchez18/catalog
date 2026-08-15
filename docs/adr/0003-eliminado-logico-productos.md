# 0003: Borrado lógico de productos y servicios (estado `eliminado`)

Fecha: 2026-08-13
Estado: aceptado

## Contexto

El dashboard requiere poder eliminar productos y servicios. Un borrado físico (DELETE) elimina el
registro y dificulta la auditoría y la recuperación ante errores. El admin prefiere que un elemento
eliminado deje de mostrarse sin que la barra de acciones (Editar/Eliminar) siga apareciendo.

## Decisión

- Representar la eliminación como un valor nuevo del campo `estado`:
  `'borrador' | 'publicado' | 'eliminado'` en los modelos `Product` y `Service`.
- Un elemento en estado `eliminado` no se muestra en el catálogo público ni se ofrece la barra de
  acciones en su detalle de dashboard.
- El borrado no destruye el registro: queda en la base de datos marcado como `eliminado`.
- En el detalle, el botón Eliminar abre un diálogo de confirmación antes de aplicar el borrado lógico.

## Consecuencias

- (+) Recuperable: se puede restaurar volviendo a un estado anterior (`borrador`/`publicado`).
- (+) Coherente con el modelo `estado` existente (no hace falta columna nueva ni boolean extra).
- (+) La confirmación previa evita eliminaciones accidentales.
- (−) Los datos eliminados siguen ocupando espacio y requieren decidir una política de purga futura.
- (−) Toda consulta de listado/catálogo debe filtrar `estado != 'eliminado'`.
