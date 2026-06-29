# Sesión 4 · Lección 5 — Seguridad, buenas prácticas y criterio de elección

> **Dónde estamos.** La última lección del curso. A lo largo de cuatro días hemos ido tocando permisos, aislamiento, datos sensibles y la decisión de qué mecanismo usar, siempre de pasada. Ahora los juntamos: primero el bloque de seguridad de frente, y luego el criterio que unifica todo el curso —cuándo usar CLAUDE.md, skills, subagentes o MCP, y cómo elegir el modelo según la tarea—.

---

## Parte A: Seguridad y buenas prácticas

## 1. Por qué la seguridad es distinta con un agente

Hasta ahora pensábamos en Claude Code como asistente. Para la seguridad conviene pensar en él también como **operador**: cada vez que ejecuta un comando o lee un fichero, actúa **con tus permisos**. Eso abre vías de riesgo reales:

- **Inyección de comandos.** Una entrada o un prompt malicioso (en un README, en un comentario de una dependencia) podría convencer a Claude de ejecutar algo destructivo.
- **Exfiltración de datos.** Sin restricciones, Claude puede leer un `.env`, credenciales de AWS, un `secrets.json`, y filtrarlos sin querer.
- **Persistencia.** Hooks o servidores MCP mal configurados pueden reintroducir problemas en cada arranque.

La buena noticia: Claude no es malicioso por defecto. El riesgo viene de **darle demasiada libertad por mala configuración**. La seguridad consiste en acotar esa libertad en capas.

---

## 2. Gestión de permisos y herramientas permitidas

El sistema de permisos es la primera capa de defensa. Las reglas viven en el objeto `permissions` de tu `settings.json`, en tres listas:

```json
{
  "permissions": {
    "allow": ["Bash(npm run test:*)"],
    "ask":   ["Bash(git push:*)", "Bash(docker run:*)"],
    "deny":  ["Read(./.env)", "Read(./.env.*)", "Bash(curl:*)", "WebFetch"]
  }
}
```

- **`allow`:** se ejecuta sin pedir aprobación. Mete aquí **solo** lo que es inofensivo.
- **`ask`:** pide confirmación. Para lo que es útil pero arriesgado (push, levantar contenedores): quieres pensarlo dos veces.
- **`deny`:** se bloquea siempre. Tu escudo: lectura de secretos, comandos de red, despliegues.

### La regla que hay que clavar: el orden de evaluación

> **Las reglas se evalúan en este orden: `deny` → `ask` → `allow`.** La primera coincidencia en ese orden decide, y la especificidad de la regla **no** cambia el orden. Esto tiene una consecuencia crítica: un `deny` amplio como `Bash(aws *)` bloquea *toda* llamada que coincida, **incluida** una que también encajaría en un `allow` más específico como `Bash(aws s3 ls)`. Un `deny` no admite excepciones por allowlist. Dicho de otro modo: **si algo está denegado en cualquier nivel, ningún otro nivel lo puede permitir.** Un `deny` de la política de la organización no lo sobrescribe tu `--allowedTools`, ni un `allow` de proyecto.

### Los ámbitos de configuración

Igual que el CLAUDE.md y los MCP, los permisos tienen capas, de mayor a menor autoridad: **managed policy** (la impone la organización; el desarrollador no puede sobrescribirla — así un equipo de seguridad fija una base), **user** (`~/.claude/settings.json`), **project** (`.claude/settings.json`, se comparte por git), y **local**. Las reglas se combinan en vez de sustituirse, y un `deny` en cualquier capa permanece. Por eso un buen patrón corporativo es un `deny` de lectura de `.env` en managed policy: ningún proyecto ni usuario lo puede desactivar.

### Permisos + hooks + sandbox: defensa en profundidad

Tres capas complementarias, y conviene entender qué cubre cada una:

1. **Permisos:** controlan qué herramientas puede usar Claude y a qué ficheros/dominios accede. Aplican a todas las tools.
2. **Hooks `PreToolUse`** (Sesión 3): se ejecutan **antes** del sistema de permisos y pueden aprobar, denegar o modificar una llamada con lógica dinámica que un patrón glob no puede expresar. El ejemplo del `.env` de la Sesión 3 vuelve aquí: la combinación robusta es un **hook** (cubre la lógica dinámica y las lecturas vía Bash) **más** una regla `deny` (cubre las tools de fichero en la capa de permisos). Ninguna de las dos sola lo cubre todo.
3. **Sandboxing:** refuerzo a nivel de sistema operativo que restringe el acceso del Bash a filesystem y red. Para máxima seguridad, correr en un contenedor Docker o una VM es la vía más fiable.

> **Empieza denegando por defecto.** La práctica recomendada no es abrir todo y ir cerrando; es lo contrario. Corre Claude en modo prompt durante un sprint, observa qué herramientas pide de verdad, y codifica **solo esos patrones** en la allowlist. No pre-autorices herramientas que *crees* que podría necesitar.

---

## 3. Riesgos de los MCP de terceros

Los servidores MCP (Sesión 3) conectan Claude con el mundo exterior, y eso es justo lo que los hace un vector de riesgo:

- **Un servidor MCP de terceros es código de terceros con acceso.** Trátalo como cualquier dependencia: revísalo antes de confiar en él. No conectes servidores que no entiendes.
- **La aprobación de servidores de proyecto no es un trámite.** Recuerda de la Sesión 3 que los servidores de scope *project* que vienen en un `.mcp.json` al clonar un repo aparecen como "⏸ Pending approval" y requieren aprobación explícita. Es deliberado: que clonar un repo no active servidores que no has revisado. No apruebes a ciegas.
- **Defaults inseguros.** Auto-aprobar servidores deja grietas. Mantén el control de qué se conecta y desactiva con `/mcp` los servidores que no estés usando (también ahorra contexto).

---

## 4. Protección de datos sensibles

El caso concreto que más importa, y que arrastramos desde la Sesión 2:

- **Deniega la lectura de secretos.** `Read(./.env)`, `Read(./.env.*)`, rutas de credenciales. Mejor en managed policy si es un equipo.
- **El hook como red de seguridad.** Como vimos, una regla `deny` cubre las tools de fichero, pero un hook `PreToolUse` que bloquea con exit 2 cuando la ruta coincide con `.env` cubre también las lecturas indirectas (por ejemplo, vía un comando Bash que haga `cat` o `diff` del fichero). La combinación de las dos es lo robusto.
- **No metas secretos en sitios que se versionan.** Ni en el CLAUDE.md, ni en una skill, ni en un `.mcp.json` de proyecto. Usa gestores de secretos, no `.env` en texto plano cuando sea posible.
- **Aislamiento para lo automático.** Todo lo de la lección anterior: el trabajo headless con permisos amplios vive en contenedores o VMs efímeras, nunca sobre tu máquina con credenciales reales.
- **Mantén Claude Code actualizado.** Se han publicado parches de seguridad; muchos corregían bypasses de los diálogos de permisos. La versión al día es parte de tu seguridad.

---

## Parte B: El criterio que unifica el curso

## 5. Cuándo usar cada mecanismo

Hemos ido construyendo esta decisión a lo largo de tres sesiones, fila a fila. Ahora la tabla completa, que es el resumen ejecutivo de todo el curso:

| Mecanismo | Responde a | Se carga / actúa | Ejemplo |
|---|---|---|---|
| **CLAUDE.md** | "¿Qué debe **saber** Claude siempre, y es corto?" | Automático, cada sesión, en todo el repo | "Los tests con `make test`", convenciones, arquitectura a vista de pájaro |
| **Reglas** (`.claude/rules/`) | "¿Qué debe saber **en esta parte** del código?" | Cuando trabajas en esa zona | "Los componentes llevan tests con Testing Library" |
| **Skills** | "¿Qué **procedimiento especializado** quiero que aplique, posiblemente extenso y con ficheros de apoyo?" | Claude la invoca cuando la tarea encaja | Tu metodología de análisis de datos, con su script y su plantilla |
| **Subagentes** | "¿Qué trabajo **ruidoso o paralelo** quiero fuera de mi contexto?" | En una ventana aislada que devuelve solo el resultado | Rastrear medio código, analizar logs, investigar en paralelo |
| **MCP** | "¿Cómo conecto Claude con **sistemas externos**?" | Cuando la petición mapea a una tool del servidor | GitHub, Jira, una base de datos, tu SaaS |
| **Hooks** | "¿Qué quiero **garantizar** que pase, sin depender del criterio del modelo?" | Determinista, en un evento del ciclo de vida | Auto-formatear, bloquear lectura de `.env`, correr tests tras cada edición |

Las preguntas-guía que separan los casos confusos:

- **CLAUDE.md vs. skill:** ¿es corto y aplica *siempre* (CLAUDE.md) o es extenso y solo importa *en esa tarea* (skill)? Meter una metodología larga en el CLAUDE.md la carga en todas las sesiones; la skill la trae solo cuando hace falta.
- **Skill vs. subagente:** ¿quiero **ver y dirigir** el procedimiento paso a paso (skill, en el hilo principal) o **aislar** trabajo cuyos intermedios no voy a reusar (subagente)?
- **Instrucción vs. hook:** ¿basta con *pedírselo* a Claude (CLAUDE.md, regla) o necesito *garantizarlo* pase lo que pase (hook)? Si su incumplimiento bloquearía un merge en CI, es un hook o CI, no una frase que el modelo interpreta.
- **¿Y la API que ya existe?** El recordatorio transversal de todo el curso: nada de esto es para documentar lo que ya está en una referencia oficial. Cada mecanismo encapsula *tu* conocimiento, no el que el modelo ya tiene.

---

## 6. Elección de modelo según la tarea

La última decisión, y una que afecta a coste y calidad a la vez. Claude Code te deja elegir modelo con `/model`, o fijar el de por defecto en `/config`. El criterio:

**Usa el modelo intermedio (Sonnet) como opción por defecto, y sube al grande (Opus) solo en los puntos clave** —razonamiento complejo, decisiones de arquitectura, un bug que se le resiste al modelo normal— en vez de correr toda la tarea en el modelo más caro. El hábito estable es Sonnet por defecto, Opus en momentos puntuales.

**Baja al modelo rápido y barato (Haiku) para lo que no necesita potencia.** Aquí entra todo lo que has aprendido: un subagente Explore de solo lectura (Sesión 3) corre en Haiku por defecto precisamente porque buscar en el código no necesita el modelo grande; un slash command que solo arregla un punto y coma puede fijar `model: haiku` en su frontmatter (Sesión 2). Enrutar tareas a modelos más baratos es una de las formas de controlar coste sin perder calidad donde importa.

Dicho en una frase: **el modelo es otro recurso a acotar, como el contexto y los permisos.** No corras en Opus lo que Haiku resuelve, ni esperes de Haiku lo que pide Opus.

---

## Cierre del curso

Has recorrido el arco completo: del prompting (Sesión 1) a dar memoria, procedimientos, manos aisladas y conexiones (Sesiones 2-3), hasta sostener todo eso en sesiones largas, en paralelo, verificado, automatizado y seguro (Sesión 4). El hilo que lo une no es ninguna herramienta concreta: es el **criterio** de elegir el mecanismo adecuado para cada necesidad, acotando los recursos —contexto, permisos, modelo— y manteniendo siempre un humano en el bucle donde el juicio importa.

---

## Ejercicio final

Coge un proyecto tuyo real y diseña su setup completo de Claude Code:

1. **CLAUDE.md** de raíz, corto, en imperativo.
2. Al menos una **regla con ámbito** y una **skill** (convertida de un comando).
3. Un **subagente** para tu trabajo ruidoso más típico.
4. Un **servidor MCP** que conecte algo que uses.
5. Un **hook** de seguridad (bloqueo de `.env`) y uno de calidad (formateo o tests).
6. Un `settings.json` con **permisos** allow/ask/deny pensados con deny-por-defecto.
7. Una decisión de **modelo** por defecto y dónde subirías o bajarías.

Para cada pieza, justifica *por qué ese mecanismo y no otro*, usando las preguntas-guía de la sección 5. Ese ejercicio es, en realidad, el examen del curso: no saber qué hace cada herramienta, sino saber cuál elegir.

---

## Referencias

Documentación oficial de Anthropic (comprobada en junio de 2026). Las URLs son estables, pero el contenido se actualiza con frecuencia; si algún detalle difiere de lo que veas en pantalla, la fuente oficial manda.

1. **Configure permissions (Claude Code).** Referencia oficial: el objeto `permissions`, el orden de evaluación `deny`→`ask`→`allow`, los ámbitos (managed/user/project/local), la sintaxis de specifiers, y la relación entre permisos y sandboxing.
   <https://code.claude.com/docs/en/permissions>

2. **Extend Claude Code: CLAUDE.md vs skills vs rules vs hooks vs MCP** (documentación oficial). La página que recoge el criterio de elección entre todos los mecanismos del curso. Es la referencia directa para la sección 5.
   <https://code.claude.com/docs/en/context-window>

3. **Connect Claude Code to tools via MCP.** Para los riesgos de servidores de terceros y la aprobación de servidores de proyecto.
   <https://code.claude.com/docs/en/mcp>

> **Comprobar en clase:** `/permissions` (ver y editar reglas), `/model` y `/config` (elección de modelo), `/mcp` (ver y desactivar servidores). Y como cierre, recorre el ejercicio final justificando cada elección en voz alta: ese es el criterio que el curso quería dejar instalado.
