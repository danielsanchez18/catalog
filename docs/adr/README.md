# Decisiones de arquitectura (ADR)

Registro de decisiones técnicas significativas y su contexto.

## Reglas

1. Un ADR por decisión, numerado y con nombre en `kebab-case`: `NNNN-titulo.md`.
2. Estados: `propuesto` → `aceptado` → `deprecado` / `superado`.
3. Antes de tomar una decisión nueva, revisar los ADR existentes.
4. Formato basado en el ADR de Michael Nygard:

```md
# NNNN: Título corto

Fecha: AAAA-MM-DD
Estado: propuesto

## Contexto

...

## Decisión

...

## Consecuencias

...
```

## Índice de ADRs

| #    | Decisión                                            | Estado    |
| ---- | --------------------------------------------------- | --------- |
| 0001 | Stack tecnológico (Astro + Supabase + Tailwind/shadcn + pnpm) | Aceptado  |
| 0002 | UI con Tailwind v4 + shadcn/ui (Base UI) y tipografía propia | Aceptado  |
