# Sesión 3 · Lección 2 — Agentes y subagentes

> **Dónde estamos.** Una skill hace que Claude aplique tu procedimiento dentro de la conversación principal, donde lo ves y lo guías paso a paso. Pero hay tareas que no quieres ver paso a paso: rastrear dónde se llama una función por todo el código, analizar un log de 5.000 líneas, auditar dependencias. Ese trabajo genera mucho ruido —resultados intermedios que no vas a volver a mirar— y te llena la ventana de contexto. Los subagentes son la herramienta para sacar ese ruido de tu conversación.

---

## 1. Desarrollo de código con IA: el problema del contexto

Hasta ahora hemos tratado la ventana de contexto como un recurso a cuidar, y en una sesión de desarrollo real es *el* recurso crítico. Una sesión normal de Claude Code es un único hilo: una ventana de contexto, una conversación, una línea de decisiones. Eso funciona bien hasta que la tarea se hace grande.

El problema aparece cuando el contexto se llena de detalle no relacionado: resultados de búsqueda, contenidos de 30 ficheros que Claude leyó para entender algo, razonamiento intermedio. Cuando eso ocurre, **la atención del modelo se degrada y la calidad baja**. No es que se "olvide": es que con la ventana llena de ruido, lo importante compite con lo accesorio y el modelo rinde peor.

Ejemplo concreto: estás construyendo una feature en un monorepo grande de TypeScript. El trabajo principal es la implementación, pero no paran de aparecer tareas laterales: rastrear cómo gestiona la autenticación un servicio existente, encontrar la utilidad compartida para formatear fechas, comprobar si el sistema de diseño ya tiene un componente parecido al que necesitas. Ninguna de esas tareas necesita el contexto completo de tu feature, y ejecutarlas en el hilo principal lo ensucia. La solución es delegarlas.

---

## 2. Qué es un subagente

Un subagente es una **instancia aislada de Claude con su propia ventana de contexto**. Recibe una tarea, la hace, y te devuelve **solo el resultado**. La analogía que mejor lo captura: los subagentes son como las **pestañas del navegador** de una sesión de Claude Code: un sitio donde perseguir una tangente sin perder el hilo principal.

Lo importante de ese aislamiento: cuando Claude lanza un subagente para "encuentra todos los sitios donde se llama a `loadUser` y resúmelos", el subagente lee los 30 ficheros **en su propio contexto**, y a tu conversación principal vuelve solo el resumen. Los ficheros, los resultados de búsqueda, el ruido: todo eso se queda en la ventana del subagente y nunca toca la tuya.

Para qué sirven, en concreto:
- **Preservar contexto:** mantienen la exploración y el trabajo pesado fuera de tu conversación principal.
- **Imponer límites:** puedes restringir qué tools puede usar un subagente (uno de investigación, solo lectura; uno de implementación, con edición).
- **Especializar comportamiento:** cada uno tiene su propio system prompt enfocado a un dominio.
- **Controlar costes:** puedes enrutar tareas a modelos más rápidos y baratos (como Haiku) cuando no hace falta el modelo grande.

### Los subagentes que ya vienen de serie

Claude Code trae tres subagentes integrados, y conviene conocerlos antes de crear los tuyos porque cubren la mayoría de casos:

- **Explore:** solo lectura, optimizado para velocidad y coste (corre en Haiku por defecto). Es el que más notarás: mantiene la búsqueda intensiva de código fuera de tu conversación. Lo usas constantemente sin darte cuenta.
- **Plan:** reúne contexto antes de que Claude te presente una estrategia en modo Plan (¿recuerdas el modo Plan de la Sesión 1? Aquí está la pieza que trabaja por debajo).
- **General-purpose:** para tareas multi-paso que necesitan tanto explorar como modificar.

Normalmente no los invocas tú: Claude enruta a ellos automáticamente según lo que pidas.

---

## 3. Uso de subagentes

### 3.1. Invocación automática y manual

La mayoría de las veces, Claude decide solo cuándo delegar, a partir de la **descripción** de cada subagente. Pero también puedes dirigirlo explícitamente: "usa un subagente para lanzar los tests y devuélveme solo los que fallan con su mensaje de error".

> **Truco práctico:** cuando un subagente está tardando, `Ctrl+B` lo manda al fondo (background): la conversación sigue mientras él trabaja, y el resultado aparece solo cuando termina. `/tasks` muestra lo que corre en segundo plano.

### 3.2. Paralelismo: varios subagentes a la vez

Para investigaciones independientes, puedes lanzar varios subagentes **simultáneamente**:

> "Investiga en paralelo los módulos de autenticación, base de datos y API usando subagentes separados."

Cada uno explora su área en su propia ventana, y luego Claude sintetiza los hallazgos. Esto funciona mejor cuando los caminos de investigación **no dependen entre sí**. El cálculo de criterio: para un presupuesto de tokens ajustado, explora en secuencia; para un presupuesto de *tiempo* ajustado, explora en paralelo. El coste en tokens es real, pero el ahorro de tiempo de reloj en tareas de exploración es grande.

### 3.3. Crear un subagente propio

Cuando el mismo tipo de subagente se pide una y otra vez (un revisor de seguridad, un escritor de tests, un corrector de docs), defínelo una vez. Es un fichero markdown con frontmatter en `.claude/agents/` (proyecto, compartido con el equipo) o `~/.claude/agents/` (personal, en todos tus proyectos). El frontmatter es la configuración (nombre, descripción, tools, modelo); el cuerpo es el system prompt del subagente.

La forma más fácil de crearlo es el comando `/agents`, que te guía de forma interactiva y puede generar un primer borrador a partir de una descripción.

Ejemplo de un revisor de código:

```markdown
---
name: code-reviewer
description: >
  Revisa un diff reciente y reporta problemas por severidad.
  Úsalo después de escribir o modificar código.
tools: Read, Grep, Glob, Bash
model: sonnet
---
Eres un revisor de código. Cuando te invoquen:
1. Lee el diff más reciente del repo (`git diff`).
2. Busca bugs evidentes, problemas de seguridad y de estilo.
3. Devuelve una lista priorizada con severidad y referencia a fichero/línea.
Sé exhaustivo pero conciso.
```

Tres detalles de criterio en ese ejemplo:
- **`tools` restringe** lo que puede hacer. Un revisor lleva lectura y `Bash` (para el `git diff`), pero podrías quitarle la edición para que **nunca** modifique nada. Empieza restrictivo y añade tools solo cuando la necesidad lo exija.
- **La `description` decide cuándo Claude delega.** Escríbela como la primera frase de una regla de triaje: "Úsalo cuando [condición]. Devuelve [forma del resultado]." Ese estilo dirige al agente principal de forma fiable.
- **`model`** te deja bajar a un modelo más barato para tareas que no necesitan el grande.

---

## 4. Subagente vs. skill: cuándo cada uno

Es la decisión de criterio de la lección, y es sutil porque ambos son ficheros markdown con frontmatter que cargan nombre y descripción al arrancar. La diferencia está en **dónde ocurre el trabajo**:

| | **Skill** | **Subagente** |
|---|---|---|
| Dónde trabaja | En tu conversación principal | En una ventana de contexto **aislada** |
| Qué ves | Cada paso, y lo puedes guiar | Solo el resultado final |
| Para qué | Aplicar tu procedimiento *viéndolo* | Sacar trabajo ruidoso *fuera de la vista* |
| Cuándo elegirlo | Quieres ver y dirigir el proceso paso a paso | Una tarea lateral (búsqueda profunda, análisis de logs, auditoría) llenaría tu conversación de intermedios que no vas a reusar |

Dicho de otra forma: **usa una skill cuando quieras que el procedimiento se desarrolle dentro del hilo principal** para verlo y corregirlo. **Usa un subagente cuando el aislamiento sea precisamente lo que buscas**: el trabajo sucio que no quieres en tu contexto.

> **Dos límites que conviene tener claros.** Primero: un subagente **no puede lanzar otro subagente** (no hay recursión directa por esa vía). Segundo: los subagentes **reportan al hilo que los lanzó, pero no se comunican entre sí**. Si necesitas que varios agentes coordinen y se hablen, eso es otra cosa (los *agent teams*, una función más pesada y experimental que queda fuera del alcance de hoy). Para el 95% de tu trabajo diario, los subagentes que reportan al hilo principal son lo que necesitas.

---

## 5. Cuándo NO usar un subagente

El aislamiento tiene un coste, y delegar a lo loco es un antipatrón:

- **Cada subagente multiplica el uso de tokens.** Lanzar cinco subagentes en paralelo consume cinco contextos. Para tareas pequeñas, el overhead no compensa: hazlas en el hilo principal.
- **Si necesitas ver y dirigir cada paso**, un subagente te lo oculta. Ahí quieres una skill o trabajo directo.
- **Si las subtareas dependen unas de otras**, el paralelismo no aplica y encadenar subagentes añade fricción sin ganancia.

La señal de que un subagente *sí* merece la pena: necesitas una segunda opinión fresca, las subtareas son independientes entre sí, o hay una exploración extensa cuyos intermedios no vas a volver a mirar.

---

## Ejercicio

Sobre un repo con algo de tamaño:

1. Pídele a Claude que **investigue en paralelo** tres zonas independientes del código con subagentes separados (por ejemplo: cómo se gestiona la autenticación, dónde se configura la base de datos, cómo se manejan los errores de red). Observa que tu conversación recibe solo los tres resúmenes, no los ficheros que leyó cada uno.

2. Crea un subagente `/agents` de revisión de código, restringido a tools de lectura más `Bash` para el `git diff`. Haz un cambio, pídele la revisión, y comprueba que el ruido de la lectura se queda en el subagente.

3. Reflexiona sobre una tarea tuya reciente: ¿la habrías hecho mejor con una skill (verla paso a paso) o con un subagente (aislarla)? Esa decisión es justo el criterio que buscamos.

---

## Referencias

Documentación oficial de Anthropic (comprobada en junio de 2026). Las URLs son estables, pero el contenido se actualiza con frecuencia; si algún detalle difiere de lo que veas en pantalla, la fuente oficial manda.

1. **Create custom subagents (Claude Code).** Referencia oficial: para qué sirven, subagentes integrados (Explore, Plan, general-purpose), el comando `/agents`, ámbitos de proyecto y usuario, y configuración de tools y modelo.
   <https://code.claude.com/docs/en/sub-agents>

2. **How and when to use subagents in Claude Code** (blog de Anthropic). El criterio de cuándo delegar y cuándo no, el paralelismo, `Ctrl+B` / `/tasks`, y la creación de subagentes reutilizables.
   <https://claude.com/blog/subagents-in-claude-code>

3. **Steering Claude Code: skills, hooks, subagents and more** (blog de Anthropic). La distinción fina skill vs. subagente (aislamiento de contexto) y cómo encajan con el resto de mecanismos. Puente directo a la lección de hooks.
   <https://claude.com/blog/steering-claude-code-skills-hooks-rules-subagents-and-more>

> **Siguiente lección:** ya sabes dar a Claude memoria (CLAUDE.md), procedimientos (skills) y manos extra aisladas (subagentes). Falta conectarlo con el mundo exterior —tus aplicaciones, tus APIs— con los **MCPs**, y automatizar acciones deterministas en momentos concretos del ciclo de vida con los **hooks**. Eso cierra la sesión.
