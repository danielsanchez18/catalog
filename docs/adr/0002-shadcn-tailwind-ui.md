# 0002: UI con Tailwind v4 + shadcn/ui (Base UI) y tipografía propia

Fecha: 2026-08-09
Estado: aceptado

## Contexto

El MVP requiere una interfaz consistente (catálogo + CRUD de productos) con poco esfuerzo de diseño.
Se acordó (ver ADR-0001) usar Tailwind CSS + shadcn/ui, y una tipografía propia con Inter como base.
Para usar shadcn/ui en Astro hace falta una integración de framework con componentes (React), lo que
introduce islas en el proyecto.

## Decisión

- **Tailwind CSS v4** mediante el plugin de Vite `@tailwindcss/vite` (sin `tailwind.config.js`; configuración CSS-first).
- **@tailwindcss/forms** como reset de controles de formulario, cargado con `@plugin` en `src/styles/global.css`.
- **shadcn/ui** con estilo `base-nova` sobre la librería de componentes headless **Base UI** (recomendada
  por el CLI de shadcn), íconos `lucide-react`, variables de color en CSS con base **neutral**.
- **React 19 + @astrojs/react** para las islas de componentes (shadcn genera componentes React).
- **Tipografía auto-alojada** con `@fontsource-variable`: Inter (heading), Inter Tight (sans/cuerpo),
  JetBrains Mono (mono) y Oswald (display), expuestas como tokens `font-heading`, `font-sans`,
  `font-mono` y `font-display`.
- Alias de importación `@/*` → `src/*` para los componentes y utilidades.

## Alternativas consideradas

- **Radix UI** como librería headless: el CLI actual recomienda Base UI como default; se usa Base UI.
- **Google Fonts** vía `<link>`: se prefirió Fontsource (auto-hosting, sin dependencia de terceros).
- **Tailwind v3 con `@astrojs/tailwind`**: la integración está deprecada en v4; se usa el plugin de Vite.

## Consecuencias

- (+) UI consistente y rápida de construir; componentes (Button y futuros) con todos sus variantes.
- (+) Fuentes propias sin latencia de CDN; tokens de tipografía listos para usar.
- (−) shadcn/ui implica React como islas; se debe limitar su uso a lo interactivo (principio Astro).
- (−) Estilo `base-nova` acopla los componentes a la versión actual del registry de shadcn.
- El primer componente instalado es **Button** con variantes `default`, `secondary`, `destructive`,
  `outline`, `ghost` y `link`, más tamaños `xs`/`sm`/`default`/`lg`/`icon`.
