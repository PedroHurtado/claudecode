# Sesión 4 · Lección 4 — Automatización y modo headless

> **Dónde estamos.** Todo lo que has hecho hasta ahora ha sido interactivo: tú delante del terminal, aprobando, dirigiendo. Pero el ciclo de testing de la lección anterior, los commits, las revisiones... son justo el tipo de trabajo que una máquina puede ejecutar sin nadie delante. Esta lección abre esa puerta: el modo headless, para correr Claude Code de forma no interactiva, y su integración en pipelines de CI.

---

## 1. Ejecución no interactiva: el modo headless

Claude Code, por defecto, es una interfaz de terminal: tú escribes, responde, apruebas las llamadas a herramientas, ejecuta. Ese bucle es ideal para sesiones de código interactivas y **terrible para todo lo demás**. En cuanto quieres que algo lo dispare un script, o que corra en CI, o que se ejecute de noche sin ti, necesitas el **modo headless**.

La forma de entrar es el flag `-p` (o `--print`):

```bash
claude -p "revisa el código en src/ y reporta problemas de seguridad"
```

`claude -p` ejecuta la petición, imprime el resultado y termina. Sin sesión interactiva, sin prompts. Esto es lo que te permite:

- **Invocar Claude desde un script:** un wrapper en bash, un subproceso de Python, un worker de Node, cualquier cosa que necesite llamar al agente y capturar su salida.
- **Usarlo en CI/CD:** una GitHub Action que revisa PRs, un pre-commit que arregla errores de lint, un job nocturno que corre migraciones.
- **Correr varios agentes en paralelo:** diez sesiones trabajando en ramas distintas, supervisadas desde un panel.

Para que la salida sea procesable por una máquina, pide formato estructurado:

```bash
claude -p "..." --output-format json
```

Con `--output-format json` obtienes, entre otras cosas, el coste (`total_cost_usd`) y los tokens por invocación, que necesitas para monitorizar gasto en una flota de agentes.

---

## 2. El problema de los permisos en automatización

Aquí aparece la tensión central del modo headless. Por defecto, Claude Code **pide aprobación humana** antes de ejecutar cualquier herramienta que modifique estado: escribir un fichero, correr un comando, hacer una petición de red. Eso es esencial en una sesión interactiva y un **bloqueo total** en una automática: no hay nadie para aprobar.

Hay varias formas de resolverlo, y el criterio para elegir es **cuánto confías en el entorno**:

**La forma correcta para la mayoría de casos: una allowlist de permisos.** Defines de antemano qué herramientas se aprueban automáticamente, y dejas que todo lo demás se deniegue. Lo verás a fondo en la lección de seguridad, pero la idea es: en vez de abrir todo, abres solo lo que esa automatización concreta necesita (`Read`, `Grep`, lanzar los tests...).

**La opción nuclear: `--dangerously-skip-permissions`.** Auto-aprueba *todas* las llamadas a herramientas. El nombre no es una broma. Solo es aceptable cuando el **radio de daño está contenido por el propio entorno**:
- Dentro de un contenedor Docker sin montajes del host.
- Dentro de un worktree de git en una rama dedicada.
- En una VM efímera que se destruye tras la ejecución.

> **Regla de oro de seguridad para headless:** nunca corras Claude Code en modo sin permisos sobre tu máquina principal, con tus credenciales reales o acceso a producción. La automatización segura vive en entornos aislados: contenedores, worktrees dedicados, VMs efímeras. Si te ves alcanzando `--dangerously-skip-permissions` para escapar de la fatiga de aprobar cosas, esa es la señal de que necesitas escribir una buena allowlist, no de saltarte los permisos.

---

## 3. Integración en pipelines de CI

Aquí es donde el modo headless cobra todo su sentido. Los casos de uso típicos:

- **Revisión automática de PRs.** Una GitHub Action que, en cada PR, lanza `claude -p` para revisar el diff y comentar problemas. Encaja con el subagente revisor de la Sesión 3 y el comando `/review` de la Sesión 2, ahora ejecutados por la máquina.
- **Arreglo de pipelines rotos.** Un job que, cuando CI falla, recoge los logs del fallo, los analiza y propone (o aplica) el arreglo.
- **Migraciones o refactors mecánicos a gran escala.** Cambios repetitivos y bien definidos que se describen en una instrucción.
- **Trabajo nocturno.** Combinado con worktrees: lanzas una tanda de tareas en paralelo antes de irte y revisas los resultados por la mañana. Cada worktree corre su tarea, en su rama, y produce su propio PR.

### El patrón seguro para CI

La práctica recomendada combina tres capas que ya conoces:

1. **Aislamiento:** corre el agente en un contenedor Docker o un worktree dedicado, nunca sobre el checkout principal ni con credenciales de producción.
2. **Permisos acotados:** una allowlist con solo las herramientas que ese job necesita, en vez de saltarte los permisos.
3. **Límites de seguridad:** topes como un número máximo de turnos y un timeout, para que un agente descontrolado no dispare costes ni se quede colgado.

> **Recuerda de la lección de Git:** los worktrees creados en modo no interactivo (con `-p`) **no se limpian solos** al no haber prompt de salida. En un pipeline, encárgate tú de la limpieza con `git worktree remove`, o confía en el barrido automático que elimina los worktrees de subagentes y sesiones de fondo más antiguos que tu `cleanupPeriodDays`, siempre que no tengan cambios sin comitear.

---

## 4. Cuándo NO automatizar

El modo headless es potente, pero no todo merece quitar al humano del bucle:

- **Tareas con criterio ambiguo.** Si la tarea requiere decisiones de diseño o juicio sobre trade-offs, un agente sin supervisión puede tomar un camino plausible pero equivocado, y lo descubres tarde.
- **Cambios de alto riesgo o irreversibles.** Migraciones de datos en producción, despliegues. Ahí quieres un humano que apruebe.
- **Cuando aún no tienes una allowlist validada.** Automatizar antes de saber qué herramientas pide de verdad la tarea es abrir la puerta a sorpresas. La práctica recomendada es correr primero la tarea en modo interactivo durante un tiempo, observar qué pide, y codificar solo esos patrones en la allowlist.

---

## Ejercicio

1. Lanza una tarea de solo lectura en headless: `claude -p "resume qué hace el módulo src/auth" --output-format json`. Observa la salida estructurada y los campos de coste y tokens.
2. Diseña (en papel, sin ejecutar sobre tu máquina principal) cómo correrías una revisión de PR en CI: qué entorno de aislamiento usarías, qué herramientas pondrías en la allowlist, y qué límites de turnos/timeout. Justifica cada decisión por el principio de radio de daño contenido.
3. Reflexiona sobre una tarea repetitiva de tu trabajo: ¿es buena candidata a automatizar en headless, o tiene criterio ambiguo que pide un humano en el bucle?

El objetivo es entender que la automatización segura no consiste en quitar todas las barreras, sino en mover el límite de seguridad del "humano aprobando" al "entorno que contiene el daño".

---

## Referencias

Documentación oficial de Anthropic (comprobada en junio de 2026). Las URLs son estables, pero el contenido se actualiza con frecuencia; si algún detalle difiere de lo que veas en pantalla, la fuente oficial manda.

1. **Configure permissions (Claude Code).** La base de la allowlist para automatización segura: reglas allow/deny/ask, modos de permiso (incluido `bypassPermissions`), y por qué un deny nunca se puede sobrescribir. Lo retomamos a fondo en la siguiente lección.
   <https://code.claude.com/docs/en/permissions>

2. **Run parallel sessions with worktrees (Claude Code).** Para el comportamiento de `-p` con worktrees en CI (no se limpian solos) y el barrido automático.
   <https://code.claude.com/docs/en/worktrees>

> **Comprobar en clase:** `claude -p "..."` para una ejecución no interactiva, `--output-format json` para salida procesable, y `--allowedTools` para acotar herramientas en una sola ejecución. Hazlo siempre en un entorno donde el radio de daño esté contenido.

> **Siguiente lección:** la última. Hemos tocado permisos y aislamiento de pasada varias veces; ahora los tratamos de frente en el bloque de seguridad —gestión de permisos, riesgos de los MCP de terceros, protección de datos sensibles—, y cerramos el curso con el criterio que lo unifica todo: cuándo usar CLAUDE.md, skills, subagentes o MCP, y cómo elegir el modelo según la tarea.
