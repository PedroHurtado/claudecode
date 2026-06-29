# Sesión 3 · Lección 1 — Skills

> **Dónde estamos.** Cerramos ayer con una promesa: cuando un slash command se te queda corto —necesitas que Claude lo invoque *solo* cuando es relevante, o que arrastre sus propias plantillas y scripts— la señal es que toca convertirlo en skill. Hoy abrimos esa caja. Y empezamos por el punto que pediste dejar clarísimo: una skill **no es documentar la API de Anthropic**. Eso ya está en la referencia y no aporta. Una skill encapsula *tu* conocimiento de proyecto, tus convenciones y tus flujos, que el modelo no trae de serie.

---

## 1. Qué es una skill (y por qué no es lo que parece)

Una skill es una **carpeta** con un fichero `SKILL.md` dentro, más —opcionalmente— scripts, documentación de referencia y plantillas. Claude la carga de forma dinámica cuando la juzga relevante para lo que estás haciendo.

La definición es engañosamente simple, así que conviene fijar bien la intuición con una analogía: **una skill es el manual de onboarding que le escribirías a un compañero nuevo para una tarea concreta.** No le explicas qué es programar (eso lo sabe); le explicas "así desplegamos *nosotros*", "estos son los pasos de nuestro proceso de release", "estas son las plantillas que usamos para los informes de incidencia". Conocimiento procedimental, específico, reutilizable.

Y aquí está el punto que separa una skill útil de una inútil, el que pediste recalcar:

> **Una skill no es documentación de una API que ya existe.** Si la información ya está en la referencia oficial de Anthropic (o de cualquier librería), meterla en una skill no aporta nada: Claude ya la conoce o la puede buscar. Lo que aporta una skill es lo que el modelo **no** tiene de serie: cómo hacéis las cosas *vosotros*, las decisiones no obvias de *vuestro* proyecto, los pasos de *vuestro* flujo. Cuando escribas una skill, la pregunta de control es: *"¿esto se lo estoy enseñando a Claude porque no lo sabe, o lo estoy copiando de un sitio donde ya está?"* Si es lo segundo, bórralo.

### La diferencia con un slash command, en una frase

Un slash command es un prompt reutilizable que **tú** disparas. Una skill es eso **más** dos cosas: Claude puede invocarla **solo** cuando detecta que es relevante (no hace falta que la teclees), y puede **arrastrar ficheros de apoyo** (scripts que ejecuta, documentación que lee solo cuando hace falta, plantillas que usa en la salida). De hecho, como vimos ayer, en Claude Code los comandos y las skills se han fusionado: una skill es el formato recomendado, y un comando es su versión mínima de un solo fichero.

---

## 2. Cuándo debemos usar una skill (y cuándo no)

No todo merece ser una skill. El criterio:

**Crea una skill cuando:**
- Repites el mismo procedimiento especializado y multi-paso (analizar un CSV con *tu* metodología estadística, generar un informe con *tu* formato, preparar un release siguiendo *tus* pasos).
- Ese procedimiento se beneficia de **ficheros de apoyo**: un script que hace el trabajo determinista, una plantilla que da forma a la salida, un documento de referencia largo que solo hace falta a veces.
- Quieres que Claude lo aplique **automáticamente** cuando la tarea encaja, sin tener que pedírselo explícitamente.

**No crees una skill cuando:**
- Es una instrucción de una línea que aplica siempre. → Eso va en el CLAUDE.md.
- Es algo que Claude ya sabe hacer solo. Las skills se "infra-disparan" para tareas triviales: una consulta simple de un paso ("lee este PDF") no activará una skill aunque la descripción encaje, porque Claude lo resuelve directo. La skill se gana su sitio en tareas sustanciales, multi-paso o especializadas.
- Es documentación de algo que ya está documentado fuera (el punto de la sección anterior).

> **CLAUDE.md vs. skills, la frontera clara.** El CLAUDE.md es para lo que Claude debe saber **siempre** y que es **corto** ("usa `async/await`", "los tests con `make test`"). Una skill es para conocimiento especializado que solo importa **cuando estás en esa tarea** y que puede ser **extenso** (tu metodología completa de análisis de datos, con sus pasos, su formato de informe y sus scripts). Meter la metodología entera en el CLAUDE.md la cargaría en *todas* las sesiones, también cuando no analizas datos. La skill la mantiene disponible sin ensuciar el contexto base: solo entra cuando hace falta. Esto es **progressive disclosure**, y es la idea central de la siguiente sección.

---

## 3. Cómo está hecha una skill por dentro

### 3.1. La estructura de carpeta

```
mi-skill/
├── SKILL.md          (obligatorio)
│   ├── frontmatter YAML  (name + description, obligatorios)
│   └── instrucciones en Markdown
├── scripts/          (opcional) código ejecutable para tareas deterministas
├── references/       (opcional) documentación que se carga en contexto cuando hace falta
└── assets/           (opcional) ficheros usados en la salida: plantillas, iconos, fuentes
```

El nombre de la carpeta es el identificador de la skill. Viven en `.claude/skills/` (ámbito de proyecto, se versiona con git y lo hereda el equipo) o en `~/.claude/skills/` (personal, en todos tus proyectos). Cuando una skill de proyecto y una personal comparten nombre, **gana la de proyecto**.

### 3.2. El SKILL.md y la idea de "progressive disclosure"

Esta es la parte que hay que entender de verdad, porque es lo que hace que las skills escalen sin penalizar el contexto. La información de una skill se carga **en niveles**, no toda de golpe:

**Nivel 1 — el frontmatter (`name` + `description`).** Es lo único que se carga al arrancar la sesión, y va al prompt de sistema. Es ligero: Claude solo sabe que la skill *existe* y *cuándo usarla*. Por eso puedes tener muchas skills instaladas sin penalización de contexto.

**Nivel 2 — el cuerpo del SKILL.md.** Las instrucciones en markdown. Claude las lee **solo si decide** que la skill es relevante para la tarea, tras leer la descripción.

**Nivel 3 — los ficheros de apoyo (`references/`, `scripts/`, `assets/`).** Se acceden **solo cuando hacen falta** para esa tarea concreta. Un `references/api_specs.md` de 2.000 líneas no gasta ni un token hasta que Claude lo abre. Por eso una skill puede empaquetar documentación enorme, datasets, ejemplos extensos: lo que no se usa no consume contexto.

> **La consecuencia práctica:** mantén el `SKILL.md` **corto** (la guía oficial recomienda por debajo de las 500 líneas, idealmente 1.500-2.000 palabras de cuerpo) y mueve el detalle a `references/`. El SKILL.md es el índice y el procedimiento; el detalle vive en ficheros que se cargan a demanda.

### 3.3. El campo `description`: lo que de verdad decide si tu skill funciona

El `description` es lo más importante de toda la skill, porque es lo que Claude usa para decidir si la activa. Dos errores fatales:

**Demasiado vago.** "Ayuda con informes." → Claude no sabe cuándo dispararla. La descripción tiene que decir **qué hace y cuándo usarla**, con las palabras que aparecerían en la petición del usuario.

**Demasiado tímido.** Hay una tendencia conocida a que las skills se **infra-disparen** (Claude no las usa cuando serían útiles). El antídoto oficial es hacer las descripciones un poco "insistentes": en vez de "Crea informes de incidencia", algo como "Crea informes de incidencia con el formato de la empresa. Usa esta skill siempre que el usuario mencione incidencias, postmortems, o pida documentar un fallo de producción, aunque no diga explícitamente 'informe'."

Buen ejemplo de frontmatter (fíjate en que la descripción enumera los disparadores):

```yaml
---
name: incident-report
description: >
  Genera informes de incidencia con el formato y las secciones que usa
  el equipo. Úsala cuando el usuario mencione una incidencia, un postmortem,
  un fallo de producción, o pida documentar un corte de servicio,
  aunque no diga la palabra "informe".
---
```

> **Buena práctica de redacción:** escribe la descripción en tercera persona ("Esta skill debe usarse cuando...") y enfócala en *cuándo* se dispara, no solo en *qué* hace.

---

## 4. Skills con scripts, documentación y plantillas

Las tres carpetas de apoyo cubren tres necesidades distintas, y saber cuál usar es criterio puro:

**`scripts/` — para lo determinista.** Cuando una tarea requiere fiabilidad exacta o es código que Claude reescribiría una y otra vez, métela en un script. Ejemplo: `scripts/rotate_pdf.py` para rotar un PDF. Ventajas: es eficiente en tokens (el script se ejecuta sin necesidad de cargarlo entero en contexto) y es determinista (hace exactamente lo mismo siempre, no "lo que el modelo improvise"). Un patrón potente es generar salida visual: un script que produce un HTML interactivo que abres en el navegador.

**`references/` — para el conocimiento que se carga a demanda.** Documentación que informa el proceso de Claude pero que no hace falta siempre: esquemas de tu base de datos (`references/schema.md`), la plantilla de NDA de la empresa, especificaciones de una API interna, políticas. Se referencian desde el SKILL.md y Claude las abre solo si la tarea lo pide.

**`assets/` — para lo que va en la salida.** Ficheros que se usan *en el resultado*: plantillas de documento, logos, fuentes, iconos. No son instrucciones para Claude; son material que acaba en lo que produce.

Ejemplo de SKILL.md que orquesta las tres:

```markdown
---
name: release-notes
description: >
  Genera las notas de versión del proyecto con el formato del equipo.
  Úsala cuando se prepare un release, se cierre un hito, o el usuario
  pida un changelog o notas de versión.
---

# Notas de versión

## Procedimiento
1. Ejecuta `scripts/collect_commits.sh` para reunir los commits desde el último tag.
2. Agrupa los cambios por tipo siguiendo las convenciones de `references/categorias.md`.
3. Redacta las notas usando la plantilla `assets/plantilla-release.md`.
4. Resalta los breaking changes en una sección propia al principio.

## Reglas
- No incluyas commits de tipo `chore` salvo que toquen build o CI.
- Cada breaking change necesita una nota de migración.
```

Fíjate en el reparto: el *qué hace* y el *cómo* están en el SKILL.md (corto); el *cómo se recogen los commits* está en un script (determinista); las *categorías* y la *plantilla* están en ficheros que se cargan solo al usar la skill.

---

## 5. Crear una skill, en la práctica

Dos caminos:

**A mano.** Creas la carpeta, escribes el SKILL.md con su frontmatter, añades los ficheros de apoyo que necesites. Empieza simple: instrucciones en markdown, sin scripts, y ve añadiendo complejidad cuando la skill ya funcione. Prueba después de cada cambio significativo, no construyas una skill compleja de una vez.

**Con ayuda de Claude.** Le describes lo que quieres y Claude te genera la estructura: la carpeta, el SKILL.md formateado y los recursos. Es el camino rápido para el primer borrador; luego lo afinas.

> **Una skill se escribe para que la use *otra* instancia de Claude.** Cuando redactes el SKILL.md, piensa que lo va a leer otro Claude que no tiene tu contexto. Incluye lo que le sería **útil y no obvio**: el conocimiento procedimental, los detalles específicos del dominio, los recursos reutilizables. No incluyas lo que cualquier Claude ya sabría hacer sin que se lo digas.

---

## 6. Precauciones al usar las skills

Las skills son potentes precisamente porque pueden traer y ejecutar código, y eso exige cuidado:

**El frontmatter entra en tu prompt de sistema.** La `description` de cada skill instalada se carga al arrancar. Una skill de origen no confiable con contenido malicioso en su frontmatter es una vía de inyección. Trata las skills de terceros como tratarías cualquier dependencia: con revisión.

**Cuidado con los scripts.** La propia documentación de Anthropic avisa de extremar la precaución al añadir scripts a una skill. Un script se ejecuta; revisa qué hace antes de confiar en una skill ajena que trae código.

**Composición sin control explícito.** Las skills no pueden referenciarse entre sí de forma explícita, pero Claude **puede combinar varias automáticamente** en una misma tarea. Es potente, pero significa que el comportamiento emergente de tener muchas skills no siempre es obvio. Mantén tu conjunto de skills acotado y entendible.

**Datos sensibles.** No metas credenciales ni datos personales en una skill, especialmente si la vas a versionar y compartir con el equipo. Lo que aplica al CLAUDE.md aplica aquí.

> **Portabilidad.** Anthropic ha publicado las Agent Skills como estándar abierto. Una skill bien hecha funciona igual en Claude Code, en Claude.ai y vía API sin modificarla. Si quieres que tus skills sean portables a otras plataformas que adopten el estándar, sigue las pautas de agentskills.io.

---

## Ejercicio

Coge **uno** de los comandos que creaste ayer (por ejemplo `/test` o `/review`) y conviértelo en una skill:

1. Crea la carpeta `.claude/skills/<nombre>/` con su `SKILL.md`.
2. Escribe una `description` con disparadores explícitos (en tercera persona, "insistente") para que Claude la active sola cuando la tarea encaje.
3. Mueve al menos un trozo de detalle a un `references/` y, si tu flujo lo permite, un paso determinista a un `scripts/`.
4. Comprueba que Claude la invoca **sin** que la teclees, planteándole una tarea que encaje con la descripción.

El objetivo es sentir la diferencia entre "yo disparo un prompt" (comando) y "Claude reconoce la tarea y aplica mi procedimiento solo" (skill).

---

## Referencias

Documentación oficial de Anthropic (comprobada en junio de 2026). Las URLs son estables, pero el contenido se actualiza con frecuencia; si algún detalle difiere de lo que veas en pantalla, la fuente oficial manda.

1. **Extend Claude with skills (Claude Code).** Referencia oficial: estructura de la skill, frontmatter, `disable-model-invocation` / `user-invocable`, skills con scripts, ámbitos de proyecto y usuario.
   <https://code.claude.com/docs/en/skills>

2. **Agent Skills — overview (plataforma).** El modelo de *progressive disclosure* explicado a fondo: los tres niveles de carga, por qué el contenido empaquetado no gasta contexto hasta usarse, y cómo las skills funcionan igual en Claude Code, Claude.ai y API.
   <https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview>

3. **How to create custom skills (Help Center).** Guía paso a paso de creación: campos del frontmatter, límites de caracteres, cuándo añadir `references/` y scripts, y buenas prácticas (empieza simple, prueba incremental).
   <https://support.claude.com/en/articles/12512198-how-to-create-custom-skills>

4. **Repositorio público de Agent Skills (anthropic/skills).** Ejemplos reales de skills para inspirarte y el estándar abierto. Útil para ver patrones de `scripts/`, `references/` y `assets/`.
   <https://github.com/anthropics/skills>

> **Siguiente lección:** las skills hacen que Claude aplique tu procedimiento, pero todo ocurre en tu conversación principal. ¿Y si una tarea pesada (rastrear medio código, analizar logs) ensucia tu contexto con resultados que no vas a volver a mirar? Para eso están los **subagentes**: instancias aisladas que hacen el trabajo sucio en su propia ventana y te devuelven solo el resultado. Es justo la otra cara de la moneda de las skills.
