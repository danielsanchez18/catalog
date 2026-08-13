# Línea de diseño

Estado: en definición — base técnica **adoptada** (Tailwind v4 + shadcn/ui + Base UI); paleta de marca pendiente.

## Principios

- Interfaz limpia y funcional orientada a catálogo: **los productos son los protagonistas**.
- Consistencia mediante **tokens**, nunca valores sueltos.
- Accesible por defecto (Base UI bajo shadcn/ui lo facilita).

## Stack de UI

- **Tailwind CSS v4** (Vite plugin `@tailwindcss/vite`) para estilos utilitarios.
- **@tailwindcss/forms** para reset de controles de formulario (registrado con `@plugin` en `global.css`).
- **shadcn/ui** (estilo `base-nova`, librería de componentes **Base UI**) para componentes base: se copian al repo bajo `src/components/ui/` y se personalizan ahí.
- Tipografía, colores y radios definidos con variables CSS / tokens de Tailwind en `src/styles/global.css`.

## Tipografía (decidida)

Fuentes auto-alojadas con `@fontsource-variable` (variable fonts):

| Token           | Familia            | Uso                       |
| --------------- | ------------------ | ------------------------- |
| `--font-heading`| Inter Variable     | Títulos (`h1`–`h6`)       |
| `--font-sans`   | Inter Tight Variable | Cuerpo y UI (default)   |
| `--font-mono`   | JetBrains Mono Variable | Código, precios, consola |
| `--font-display`| Oswald Variable    | Acentos, hero, números grandes |

> Los `h1`–`h6` usan `font-heading` automáticamente (regla en `global.css`). El nombre `font-display`
> fue elegido para Oswald.

## Tokens de color

| Token   | Estado   | Detalle                                                        |
| ------- | -------- | -------------------------------------------------------------- |
| Base    | Neutral  | Variables de shadcn (`oklch`) en `:root` y `.dark`             |
| Marca   | Pendiente| Paleta de marca a elegir; se registra como ADR al fijarla       |
| Radios  | Default  | `--radius` y derivados de shadcn (`base-nova`)                 |

## Componentes shadcn instalados

| Componente | Ruta                          | Variantes                                             |
| ---------- | ----------------------------- | ----------------------------------------------------- |
| Button     | `src/components/ui/button.tsx`| default, secondary, destructive, outline, ghost, link |
| Select     | `src/components/ui/select.tsx`| Base UI (v1.7, `items` en Root para etiquetas)        |
| DropdownMenu | `src/components/ui/dropdown-menu.tsx` | Base UI Menu; `LinkItem` para items con `href` |
| Toaster    | `src/components/ui/sonner.tsx`| Toasts (sonner) + helper `toast`; éxito/info/error     |

- Tamaños del Button: `xs`, `sm`, `default`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`.
- Los componentes son React y se usan como **islas** (sin `client:*` si son puramente visuales;
  con `client:load`/`client:visible` si necesitan interactividad).

## Iconos (lucide)

- Librería de iconos: **lucide-react** (configurada en `components.json` como `iconLibrary`).
- Los iconos heredan el tamaño del texto del botón; en botones `size="icon*"` usan el tamaño del botón.
- Para botones con texto e icono, marcar el icono con `data-icon="inline-start"` o `data-icon="inline-end"`
  para que el Button ajuste el espaciado automáticamente.
- Ajustar el tamaño puntual con `className="size-*"` (ej. `size-4`, `size-5`).

## Reglas de uso

1. Usar componentes de `src/components/ui/` (shadcn) en lugar de elementos crudos.
2. Modo claro/oscuro: soportado por el `@custom-variant dark` de `global.css`; activar con la clase `.dark`.
3. No inventar botones: usar el `Button` con su `variant` y `size`.
4. Reutilizar componentes de producto (`ProductCard`, `ProductGrid`, etc.) en catálogo y dashboard.

## Referencias

- `docs/adr/0002-shadcn-tailwind-ui.md`
- `docs/general/arquitectura.md`
