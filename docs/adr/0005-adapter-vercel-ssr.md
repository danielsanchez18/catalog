# 0005: Adapter de Vercel para SSR (`@astrojs/vercel`)

Fecha: 2026-08-16
Estado: aceptado

## Contexto

El proyecto se despliega en Vercel. La zona de administración (`/dashboard/*`) y las APIs (`/api/*`)
son páginas SSR (`export const prerender = false`). El proyecto usaba el adapter `@astrojs/node`
(mode `standalone`), pensado para servidores Node (VPS/Render), que **no genera serverless functions**
y por tanto no puede servir rutas SSR en Vercel.

## Decisión

- Usar el adapter `@astrojs/vercel` en `astro.config.mjs`: las rutas SSR se despliegan como serverless
  functions de Vercel y las rutas estáticas (catálogo público) como archivos estáticos.
- Configurar pnpm con `node-linker=hoisted` (`.npmrc`): evita los symlinks de pnpm en `node_modules`,
  que en Windows rompen el bundling del adapter Vercel (`EPERM` al crear symlinks sin permisos de
  administrador). En Linux/Vercel los symlinks funcionan, pero `hoisted` mantiene el build local
  reproducible en cualquier SO.

## Consecuencias

- (+) El dashboard y las APIs funcionan en Vercel como serverless functions.
- (+) Build local reproducible en Windows (antes fallaba con `EPERM`).
- (−) `node_modules` ya no usa el layout aislado de pnpm (mayor riesgo de dependencias "fantasma";
  mitigado por el lockfile y `pnpm-lock.yaml`).
- (−) Se eliminó `@astrojs/node` como dependencia directa.
- (−) Las variables de entorno (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)
  deben declararse en el proyecto de Vercel (la service role solo en el entorno de servidor).