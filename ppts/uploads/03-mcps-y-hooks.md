# Sesión 3 · Lección 3 — MCPs y hooks

> **Dónde estamos.** Ya le diste a Claude memoria del proyecto (CLAUDE.md), procedimientos reutilizables (skills) y manos extra aisladas (subagentes). Pero todo eso vive dentro de tu entorno local. Esta lección cubre las dos piezas que rompen ese límite en direcciones opuestas: los **MCPs** conectan Claude con el mundo exterior (tus apps, tus APIs, tus bases de datos), y los **hooks** te dan control determinista sobre el comportamiento de Claude en momentos concretos de su ciclo de vida.

---

## Parte A: MCPs

## 1. Qué son los MCPs

MCP son las siglas de **Model Context Protocol**: un estándar abierto que permite a Claude Code conectarse a herramientas externas, bases de datos y APIs a través de un protocolo unificado.

El reparto de nombres, que confunde al principio: **Claude Code es el producto. MCP es el protocolo que habla.** Claude Code actúa como *cliente* MCP, y se conecta a *servidores* MCP que exponen capacidades: acceso a GitHub, automatización de navegador, consultas a una base de datos, etc.

La idea de fondo: Claude Code, por sí solo, sabe editar código, buscar y ejecutar comandos en tu máquina. Los MCP lo sacan de ahí. Con un servidor MCP de GitHub conectado puedes pedirle "revisa el PR #456 y sugiere mejoras" o "abre una issue para el bug que acabamos de encontrar", sin salir del terminal. MCP convierte Claude Code de una herramienta de edición de código en un agente que actúa sobre tus sistemas.

> **Analogía útil:** MCP es a las herramientas de IA lo que USB-C a los dispositivos: un conector estándar. En vez de que cada aplicación invente su forma de hablar con Claude, todas hablan el mismo protocolo. Por eso el mismo servidor MCP de, por ejemplo, Notion, funciona en Claude Code, en Claude Desktop y en otros clientes que hablen MCP.

---

## 2. Configuración de servidores MCP

### 2.1. Los dos tipos de transporte

Un servidor MCP se conecta de una de dos formas:

- **HTTP** (HTTP "streamable"): el estándar actual. Usa peticiones HTTP normales con streaming opcional. Es lo que usarás para servidores remotos (un SaaS en la nube).
- **stdio** (entrada/salida estándar): para servidores que corren como un proceso local en tu máquina.

> Existió un tercer transporte, **SSE** (Server-Sent Events), pero está **deprecado**. Úsalo solo si un servidor concreto todavía lo exige; para todo lo nuevo, HTTP.

### 2.2. El comando `claude mcp add`

La sintaxis base, según el transporte:

```bash
# Servidor remoto por HTTP
claude mcp add --transport http <nombre> <url>
# Ejemplo real: conectar Notion
claude mcp add --transport http notion https://mcp.notion.com/mcp

# Con cabecera de autenticación (Bearer token)
claude mcp add --transport http secure-api https://api.example.com/mcp \
  --header "Authorization: Bearer tu-token"

# Servidor local por stdio (un proceso que se lanza con un comando)
claude mcp add --transport stdio <nombre> -- <comando> [args...]
# Ejemplo: un servidor de Airtable vía npx
claude mcp add --env AIRTABLE_API_KEY=TU_CLAVE --transport stdio airtable \
  -- npx -y airtable-mcp-server
```

Detalle de sintaxis que ahorra errores: **todas las opciones (`--transport`, `--env`, `--scope`, `--header`) van antes del nombre del servidor**, y el `--` (doble guion) separa el nombre del comando y los argumentos que se le pasan al servidor stdio.

Comandos de gestión:

```bash
claude mcp list           # lista todos los servidores configurados
claude mcp get <nombre>   # detalle de uno
claude mcp remove <nombre># elimina uno
/mcp                      # (dentro de Claude Code) estado de servidores y OAuth
```

### 2.3. Los tres ámbitos (scopes)

Igual que con el CLAUDE.md, los comandos y las skills, los servidores MCP tienen ámbito, y elegir bien controla en qué proyectos carga el servidor y si se comparte con el equipo:

| Scope | Dónde se guarda | Para qué |
|---|---|---|
| **local** (por defecto) | `~/.claude.json`, asociado a la ruta de ese proyecto | Servidores personales de desarrollo, configuraciones experimentales, o servidores con credenciales que no quieres en el control de versiones. Solo carga en ese proyecto y es privado para ti. |
| **project** | `.mcp.json` en la raíz del proyecto | Lo comprometes en git: todo el equipo recibe la misma configuración al clonar el repo. |
| **user** | `~/.claude.json` (global) | Disponible en todos tus proyectos. |

Se elige con `--scope` al añadir. Y hay una capa de seguridad importante: los servidores de scope **project** que vienen en un `.mcp.json` al clonar un repo aparecen como **"⏸ Pending approval"** y requieren que los **apruebes** antes de cargarse. Es deliberado: que clonar un repo no active automáticamente servidores que no has revisado.

---

## 3. Usando MCPs para conectarnos a aplicaciones externas

Una vez conectado un servidor, Claude llama a sus herramientas cuando tu petición encaja con la capacidad de una de ellas, ya sea explícitamente ("busca en Jira los bugs abiertos") o implícitamente ("¿qué está bloqueando la release?" con un servidor de Jira conectado).

Un matiz que conviene entender para no malinterpretar el comportamiento: **Claude no llama a una herramienta MCP para preguntas de conocimiento general sobre el servicio.** "¿Cómo funcionan las bases de datos de Notion?" con un servidor de Notion conectado se responde directamente, sin tocar la herramienta. "¿Qué hay en mi base de datos de Proyectos?" sí dispara la herramienta. La distinción es: conocimiento general → respuesta directa; acceso a *tus* datos → llamada a la tool.

> **Nota sobre el contexto y muchos servidores.** Cada servidor MCP añade definiciones de herramientas que, en principio, ocuparían contexto. Con **Tool Search** (activado por defecto en versiones actuales), las definiciones de tools se cargan a demanda, así que añadir más servidores tiene impacto mínimo en el contexto. Aun así, la disciplina de no conectar servidores que no usas sigue siendo buena higiene.

---

## Parte B: Hooks

## 4. Realizando acciones automáticas

Aquí cambiamos de filosofía. Todo lo anterior —CLAUDE.md, skills, subagentes, incluso los MCP— Claude lo **interpreta**: son contexto e instrucciones que el modelo decide cómo aplicar. Los hooks son lo contrario: **control determinista**.

Un hook es un comando de shell, un endpoint HTTP o un prompt a un LLM que se ejecuta **automáticamente** en un punto concreto del ciclo de vida de Claude Code. La diferencia clave con todo lo demás:

> Una regla en el CLAUDE.md le *pide* a Claude que haga algo, y Claude *normalmente* lo hace. Un hook **garantiza** que algo ocurra, porque se ejecuta fuera del modelo, como un script disparado por un evento. Si necesitas que algo pase **siempre**, sin depender del criterio del modelo, es un hook.

Esto cierra un círculo que abrimos en la Sesión 2: cuando dijimos que una regla que "bloquearía un merge en CI" no debe ir en el CLAUDE.md sino forzada... los hooks son una de las formas de forzarla.

Tipos de handler de hook:
- **command:** un comando de shell. El más común.
- **http:** un endpoint HTTP que recibe el evento como POST.
- **prompt** y **agent:** usan el juicio de un LLM en vez de lógica fija (para decisiones que requieren evaluación semántica, como un Stop hook que decide si Claude debería seguir trabajando).

Los tres primeros son deterministas; los dos últimos delegan la decisión en el modelo. Una ventaja importante: los hooks tienen **bajo coste de contexto**, porque su configuración vive fuera de la ventana principal.

Ejemplos canónicos que se entienden de un vistazo:

**Auto-formatear cada fichero que Claude edita** (el hook más popular), en `.claude/settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit|MultiEdit",
      "hooks": [{
        "type": "command",
        "command": "npx prettier --write \"$CLAUDE_TOOL_INPUT_FILE_PATH\""
      }]
    }]
  }
}
```

Cada vez que Claude escribe o edita un fichero, se formatea solo. Tú no apruebas nada.

**Bloquear un comando peligroso** (un guardarraíl de seguridad):

```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": "echo \"$CLAUDE_TOOL_INPUT\" | grep -qE 'rm -rf|DROP TABLE' && exit 2 || exit 0"
      }]
    }]
  }
}
```

Aquí está la pieza clave de los hooks: **el código de salida 2**. En un hook `PreToolUse`, salir con código 2 **bloquea** la acción antes de que ocurra, y el mensaje de `stderr` se le pasa a Claude como la razón del bloqueo. Salir con 0 la permite. (Salir con 1 es un error no bloqueante: la acción sigue. Por eso todo hook de seguridad debe usar exit 2, no 1, o no protege de nada.)

---

## 5. Eventos de ciclo de vida

Los hooks se disparan en puntos concretos. No hace falta memorizarlos todos —hay del orden de treinta—, pero sí entender los que se usan el 95% del tiempo y en qué "cadencia" ocurren:

**Una vez por sesión:**
- **SessionStart:** al empezar o reanudar una sesión. Ideal para inyectar contexto fresco (la rama actual de git, los últimos commits, el estado del repo). Su salida estándar se añade al contexto de Claude.
- **SessionEnd:** al terminar.

**Una vez por turno:**
- **UserPromptSubmit:** cuando envías un prompt, antes de que Claude lo procese. Puede inyectar contexto o incluso bloquear el prompt.
- **Stop:** cuando Claude termina de responder. Un Stop hook puede incluso **impedir** que el turno termine y devolver el control al modelo con una razón ("los tests fallan, arréglalos antes de parar").

**En cada llamada a herramienta (dentro del bucle agéntico):**
- **PreToolUse:** antes de ejecutar cualquier tool. Es el hook **más potente**, porque puede aprobar o denegar la acción (con el exit 2 que vimos). Es el mecanismo de enforcement para políticas de seguridad, protección de ficheros y revisiones obligatorias.
- **PostToolUse:** después de que una tool se completa. Para validar o formatear *a posteriori* (el auto-formateo de antes). Ojo: PostToolUse **no puede deshacer** la ejecución; solo puede dar feedback a Claude o procesar el resultado.

Además, un detalle que conecta con la lección anterior: **los hooks se disparan también para las acciones de los subagentes.** Si Claude lanza un subagente, tus hooks `PreToolUse` y `PostToolUse` se ejecutan para cada tool que use ese subagente. Sin eso, un subagente podría saltarse tus guardarraíles. El evento **SubagentStop** te deja correr validaciones cuando un subagente termina.

> **Un caso de uso que cierra la sesión entera:** un hook `PreToolUse` que bloquea la lectura de ficheros `.env` (exit 2 cuando la ruta coincide con `.env`). Esto es protección de datos sensibles **garantizada**, no "le he pedido a Claude que no lea el `.env` y espero que haga caso". Lo retomaremos en la Sesión 4, cuando hablemos de seguridad a fondo: la combinación robusta es un hook (cubre la lógica dinámica y las lecturas vía Bash) **más** una regla de permiso `deny` (cubre las tools de fichero en la capa de permisos).

> **Rendimiento, no cantidad.** Cada hook corre de forma síncrona, así que su tiempo se suma a cada llamada de tool que coincida. Puedes tener decenas de hooks sin notar latencia si cada uno termina en pocos cientos de milisegundos. La regla práctica: si un PostToolUse añade más de medio segundo a cada edición, la sesión se siente lenta. Diez hooks rápidos rinden mejor que dos lentos.

---

## Ejercicio

**MCP:**
1. Conecta un servidor MCP de scope local (por ejemplo, uno de GitHub o el que uses en tu trabajo) con `claude mcp add --transport http`. Verifícalo con `claude mcp list` y revisa su estado con `/mcp`.
2. Pídele a Claude algo que use ese servidor (acceso a *tus* datos) y algo de conocimiento general sobre el servicio. Observa que solo lo primero dispara la herramienta.

**Hooks:**
3. Añade a `.claude/settings.json` un hook `PostToolUse` que auto-formatee con tu formateador (Prettier, Black, lo que uses) tras cada edición. Edita un fichero y comprueba que se formatea solo.
4. Añade un hook `PreToolUse` que bloquee con exit 2 un patrón peligroso (`rm -rf`, o la lectura de `.env`). Intenta provocar esa acción y verifica que se bloquea y que Claude recibe la razón.

El objetivo es sentir la diferencia entre *pedir* (todo lo anterior, que Claude interpreta) y *garantizar* (un hook, que se ejecuta pase lo que pase).

---

## Referencias

Documentación oficial de Anthropic (comprobada en junio de 2026). Las URLs son estables, pero el contenido se actualiza con frecuencia; si algún detalle difiere de lo que veas en pantalla, la fuente oficial manda.

1. **Connect Claude Code to tools via MCP.** Referencia oficial: `claude mcp add` con HTTP y stdio, los tres scopes (local/project/user), aprobación de servidores de proyecto, autenticación por cabeceras, y gestión (`list`/`get`/`remove`, `/mcp`).
   <https://code.claude.com/docs/en/mcp>

2. **Hooks reference (Claude Code).** Referencia oficial de los eventos de ciclo de vida, las tres cadencias (sesión / turno / tool), los tipos de handler (command, http, prompt, agent), el protocolo de códigos de salida (exit 2 bloquea), y los matchers.
   <https://code.claude.com/docs/en/hooks>

3. **Steering Claude Code: skills, hooks, subagents and more** (blog de Anthropic). Encaja los hooks con el resto de mecanismos y explica por qué dan control determinista frente al contexto interpretado.
   <https://claude.com/blog/steering-claude-code-skills-hooks-rules-subagents-and-more>

> **Comprobar en clase:** `claude mcp list` para ver servidores; `/mcp` para estado y OAuth; `/hooks` para revisar los hooks activos. Los detalles de `settings.json` y la capa de permisos los retomamos a fondo mañana.

> **Siguiente sesión (2 de julio):** la última. Sesiones largas (compactación y limpieza de contexto), flujo de trabajo con Git (commits, PRs, worktrees para sesiones en paralelo), testing y TDD asistido, automatización y modo headless en CI, y el bloque de seguridad y buenas prácticas: permisos, riesgos de los MCP de terceros, protección de datos, y el criterio final para elegir entre CLAUDE.md, skills, subagentes y MCP según la tarea.
