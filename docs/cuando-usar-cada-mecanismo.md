# Cuándo usar Prompts, Skills, Agentes y MCP

Guía rápida de decisión para desarrollo real con Claude Code.

---

## Prompts

**Qué es:** instrucciones directas en la conversación. La forma más simple e inmediata de trabajar.

**Úsalo cuando:**
- La tarea es puntual y no se repite.
- No necesitas que el conocimiento persista entre sesiones.
- Quieres una respuesta o cambio concreto aquí y ahora.

**Casos reales:**
- *"Refactoriza este método para que use inyección de dependencias en lugar del `new` directo."* — Cambio único sobre un archivo abierto.
- *"Explícame por qué este test falla intermitentemente"* — Diagnóstico ad-hoc de un problema concreto.

**Regla de oro:** si lo vas a pedir una sola vez, es un prompt.

---

## Skills

**Qué es:** conocimiento y procedimientos reutilizables (instrucciones, scripts, plantillas, documentación) que Claude carga automáticamente cuando la tarea encaja.

**Úsalo cuando:**
- Repites el mismo procedimiento con criterios estables.
- Quieres encapsular convenciones del equipo o pasos concretos.
- El "cómo hacerlo" es más valioso que el "qué hacer" puntual.

**Casos reales:**
- *Generar un endpoint siguiendo Vertical Slice:* una skill con la estructura de carpetas `src/Features/{Feature}/`, la plantilla de validación con FluentValidation y las convenciones de nombres. Cada vez que pides un feature nuevo, se aplica igual.
- *Crear componentes con la estructura estándar del proyecto:* skill con plantilla, checklist de accesibilidad y script de scaffolding, para que todos los componentes salgan consistentes.

**Regla de oro:** si lo repites y siempre sigue el mismo patrón, conviértelo en skill.

---

## Agentes (y subagentes)

**Qué es:** delegación de una tarea completa que requiere varios pasos, exploración y decisiones intermedias, con su propio contexto de trabajo.

**Úsalo cuando:**
- La tarea es multi-paso y abierta (explorar, decidir, ejecutar, verificar).
- Quieres aislar trabajo pesado sin contaminar el contexto principal.
- Necesitas paralelizar o descomponer un problema grande.

**Casos reales:**
- *"Encuentra la causa de esta fuga de memoria":* el agente explora el código, formula hipótesis, revisa varios módulos y propone la corrección sin que tú guíes cada paso.
- *Migración a lo largo de muchos archivos:* un subagente localiza todos los usos de una API deprecada y otro aplica el reemplazo, manteniendo el hilo principal limpio.

**Regla de oro:** si la tarea necesita investigar y decidir por sí misma a lo largo de varios pasos, delégala a un agente.

---

## MCP

**Qué es:** protocolo para conectar Claude Code a sistemas y datos externos (bases de datos, issue trackers, servicios, APIs).

**Úsalo cuando:**
- La tarea necesita datos o acciones que viven fuera del repositorio.
- Quieres que Claude consulte o actúe sobre un sistema real, no sobre texto.

**Casos reales:**
- *"Consulta el esquema real de la base de datos y genera los modelos a partir de las tablas actuales":* MCP a la BD para leer el esquema en vivo en lugar de asumirlo.
- *"Lee el ticket JIRA-1234 e implementa lo que describe":* MCP al issue tracker para traer el contexto de la tarea directamente a la sesión.

**Regla de oro:** si necesitas tocar un sistema externo, es un MCP.

---

## Tabla de decisión rápida

| Necesito… | Mecanismo |
|---|---|
| Un cambio o respuesta puntual | **Prompt** |
| Repetir un procedimiento con patrón fijo | **Skill** |
| Delegar una tarea multi-paso y autónoma | **Agente** |
| Acceder a datos o sistemas externos | **MCP** |

Los mecanismos se combinan: un **agente** puede usar una **skill** para seguir tus convenciones y un **MCP** para leer datos reales, todo arrancado con un **prompt**.
