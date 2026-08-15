# Documentación del proyecto

Índice maestro de la documentación. **Léelo primero** antes de trabajar en cualquier tarea.

## Cómo navegar esta documentación

La documentación está dividida por **módulos** para que quien trabaje (persona o agente de IA) cargue
solo el contexto que necesita. Cada módulo tiene su propio `README.md` con reglas de negocio, flujos y
decisiones. Los detalles de arquitectura se registran como ADR en `adr/`.

```
docs/
├── README.md           # Este índice maestro
├── general/            # Contexto transversal a toda la aplicación
│   ├── proyecto.md     # Visión, stack tecnológico, alcance y roadmap
│   ├── arquitectura.md # Arquitectura de la solución
│   ├── convenciones.md # Convenciones de código y repositorio
│   ├── diseno.md       # Línea de diseño (Tailwind + shadcn/ui)
│   └── flujos.md       # Flujos generales de la aplicación
├── auth/               # Módulo: autenticación y administración
├── productos/          # Módulo: gestión de productos (CRUD)
├── servicios/          # Módulo: gestión de servicios (CRUD)
├── catalogo/           # Módulo: catálogo público
└── adr/                # Decisiones de arquitectura (ADR)
```

## Mapa de contexto

| Área de trabajo               | Dónde empieza el contexto                    |
| ----------------------------- | -------------------------------------------- |
| Stack, alcance y roadmap      | `general/proyecto.md`                        |
| Arquitectura y decisiones     | `general/arquitectura.md` + `adr/`           |
| Código y convenciones         | `general/convenciones.md`                    |
| UI, estilos y tokens          | `general/diseno.md`                          |
| Flujos de la aplicación       | `general/flujos.md`                          |
| Autenticación (admin)         | `auth/README.md`                             |
| Productos (CRUD y negocio)    | `productos/README.md`                        |
| Servicios (CRUD y negocio)    | `servicios/README.md`                        |
| Catálogo público              | `catalogo/README.md`                         |

## Estado de los módulos

| Módulo    | Estado                  |
| --------- | ----------------------- |
| General   | Definido (borrador)     |
| Auth      | Mínimo, por implementar |
| Productos | Por definir             |
| Servicios | Por definir             |
| Catálogo  | Por definir             |

## Reglas

1. Toda decisión técnica significativa se registra como ADR en `adr/`.
2. Nuevos módulos: crear carpeta con su `README.md` y actualizar este índice y el mapa en `AGENTS.md`.
3. Documentación en **español**; nombres de archivo en `kebab-case`.
4. No duplicar contexto: los detalles viven en el módulo correspondiente.
