# Convenciones

Estado: adoptado

## Idioma

- Código e identificadores en **inglés**.
- Textos visibles al usuario, documentación y comentarios (si los hay) en **español**.

## TypeScript

- Modo **estricto**.
- Evitar `any`; si es inevitable, justificarlo con un comentario breve.
- Tipos compartidos en `src/lib/types.ts` o junto al módulo que los usa.

## Código

- **Sin comentarios** salvo que se pida; el código debe leerse por sí solo.
- Nombres descriptivos en inglés: verbos para funciones, sustantivos para datos.
- Funciones pequeñas; la lógica de dominio vive en `src/lib/`, no dentro de los componentes.

## Archivos y carpetas

- Nombres de archivo en `kebab-case`.
- Un componente por archivo.
- Páginas de administración bajo `src/pages/admin/`.
- Componentes de UI base (shadcn) bajo `src/components/ui/`.

## UI y estilos

- Tailwind CSS para estilos; seguir los tokens definidos en `docs/general/diseno.md`.
- Componentes de UI con **shadcn/ui**: no reinventar botones, inputs, modales, etc.
- Evitar CSS propietario inline salvo casos puntuales.

## Git

- No commitear secretos; variables de entorno solo en `.env` (ignorado por git).
- Mensajes de commit cortos y en forma imperativa.
