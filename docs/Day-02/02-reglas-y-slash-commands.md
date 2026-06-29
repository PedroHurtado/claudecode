# Sesión 2 · Lección 2 — Reglas y slash commands

> **Dónde estamos.** En la lección anterior le diste a Claude memoria persistente del proyecto con el CLAUDE.md. Pero el CLAUDE.md tiene dos límites: se carga *entero* en cada sesión (no escala bien si lo metes todo) y describe lo que Claude debe *saber*, no lo que debe *hacer* paso a paso. Esta lección cubre las dos piezas que resuelven eso: las **reglas con ámbito** (para que el contexto no sea un único bloque gigante) y los **slash commands** (para empaquetar los flujos que repites cada día).

---

## 1. Instrucciones personalizadas y reglas con ámbito

### 1.1. El problema que resuelven las reglas

Recuerda el final de la lección anterior: a partir de ~200 líneas, un CLAUDE.md se vuelve difícil de mantener y fácil de contradecir. Y hay otro problema más sutil: hay instrucciones que **solo aplican a una parte del código**. "Los componentes de React llevan tests con Testing Library" no tiene sentido cargarlo cuando estás tocando el backend. Si lo metes en el CLAUDE.md raíz, ocupa contexto en sesiones donde no pinta nada.

La solución es **modularizar**: el CLAUDE.md raíz se queda pequeño y estable (el índice), y todo lo que es profundo, específico de una zona o solo relevante a veces se mueve a **ficheros de reglas** bajo `.claude/rules/`.

### 1.2. Cómo se crean las reglas

Una regla es, en esencia, un fichero markdown con instrucciones para una situación concreta. Hay dos formas de conectar ese contenido al contexto:

**Por referencia desde el CLAUDE.md (`@`).** Como viste en la lección anterior, `@docs/api-standards.md` trae ese fichero al contexto. El CLAUDE.md actúa de índice y el detalle vive aparte.

**Como reglas con ámbito de ruta.** Las instrucciones que solo aplican a una carpeta concreta se colocan de forma que entren en juego cuando trabajas en esa zona, no siempre. En un monorepo esto se combina con los CLAUDE.md por subdirectorio que vimos: lo común arriba, lo específico cerca del código al que aplica.

> **Regla de oro para decidir dónde va una instrucción:** si un revisor humano *levantaría una ceja* al ver que se incumple, va en el CLAUDE.md o en una regla. Si su incumplimiento *bloquearía un merge en CI*, va en CI o en un hook, no en un fichero que el modelo interpreta. El CLAUDE.md y las reglas no sustituyen a la automatización; la complementan.

### 1.3. Cómo escribir una regla que se cumpla

Aplican exactamente los mismos principios que el CLAUDE.md, porque una regla es contexto igual que él:

- **Imperativo, no observación.** "Nunca uses `any` sin un comentario que lo justifique", no "intentamos evitar `any`".
- **Concreta y verificable.** Una regla que no puedes comprobar si se cumple está mal escrita.
- **Énfasis con moderación.** `IMPORTANTE` / `DEBES` solo en lo verdaderamente crítico.

Ejemplo de una regla con ámbito para los tests de frontend, que solo quieres activa cuando se tocan componentes:

```markdown
# Reglas de testing de componentes

- Usa React Testing Library, nunca Enzyme.
- Testea comportamiento visible para el usuario, no detalles de implementación.
- Cada componente nuevo en `src/components/` necesita su `*.test.tsx`.
- Los datos de prueba salen de `src/test/factories/`, nunca mocks en línea.
```

Eso, fuera del CLAUDE.md raíz y con ámbito sobre `src/components/`, no gasta contexto cuando trabajas en el backend.

---

## 2. Slash commands: empaquetar lo que repites

### 2.1. Qué es un slash command

Un slash command es un **prompt reutilizable guardado en un fichero**. En lugar de teclear el mismo prompt detallado cincuenta veces ("revisa este diff buscando bugs, ignora el estilo, organiza el resultado en crítico/importante/menor..."), lo escribes una vez en un fichero y lo invocas tecleando `/` y el nombre.

El mecanismo es deliberadamente simple: **un fichero markdown = un comando**. El nombre del fichero (sin la extensión) se convierte en el nombre del comando. El contenido del fichero se convierte en el prompt que se le envía a Claude cuando lo invocas. `review.md` se convierte en `/review`.

### 2.2. Dónde viven: proyecto vs. personal

Igual que con el CLAUDE.md, hay dos ámbitos:

| Ámbito | Ubicación | Para qué |
|---|---|---|
| **Proyecto** | `.claude/commands/` en el repo | Comandos del equipo. Se versionan con git: quien clona el repo los hereda. Garantizan que todos usen el mismo proceso. |
| **Personal** | `~/.claude/commands/` | Tus comandos, en todos tus proyectos, en tu máquina. No se versionan. |

> **Actualización importante de 2026.** Los slash commands personalizados y las **skills** se han fusionado (Claude Code v2.1.101, abril de 2026). Los ficheros en `.claude/commands/` **siguen funcionando sin cambios** y son la vía más rápida para empezar —por eso es lo que enseñamos hoy—, pero la documentación oficial los etiqueta como formato *legacy* y recomienda el formato de skill (`.claude/skills/<nombre>/SKILL.md`) para lo nuevo. Ambos crean un `/nombre` invocable. La diferencia: una skill, además de invocarse a mano, puede activarse **sola** cuando Claude la juzga relevante, y admite ficheros de apoyo. Las skills son justo el tema de la Sesión 3, así que hoy trabajamos con el formato comando —simple y suficiente— y allí daremos el salto.

### 2.3. Anatomía de un comando

Un comando puede ser tan simple como una sola línea:

```bash
mkdir -p .claude/commands
echo "Analiza el rendimiento de este código y sugiere tres optimizaciones concretas:" > .claude/commands/optimize.md
```

Y ya puedes usar `/optimize` en tu sesión.

Pero los comandos útiles de verdad llevan tres ingredientes más: **frontmatter**, **argumentos** y **salida de shell embebida**.

**Frontmatter (YAML opcional entre `---`).** Añade metadatos y restricciones:

```markdown
---
description: Revisión de seguridad del código
allowed-tools: Read, Grep, Glob
---
Analiza el código en busca de vulnerabilidades:
- Inyección SQL
- XSS
- Credenciales expuestas
- Configuraciones inseguras
```

Lo importante de ese frontmatter:
- `description` es el texto que aparece cuando navegas los comandos con `/`. Hace tu comando descubrible.
- `allowed-tools` **restringe** qué tools puede usar Claude al ejecutar el comando. Aquí es clave por seguridad: un comando de revisión que solo lleva `Read, Grep, Glob` puede leer pero **no puede modificar nada**. Sin esa restricción, Claude tendría acceso a todas sus tools por defecto.

**Argumentos.** Para no quemar un fichero concreto dentro del comando, pasas el objetivo al invocarlo:

- `$ARGUMENTS` captura *todo* lo que escribes tras el nombre del comando, como un único string. Si tu comando contiene `Revisa el fichero $ARGUMENTS` y escribes `/review-colors grafico.py`, Claude ve `Revisa el fichero grafico.py`.
- `$0`, `$1`... capturan argumentos posicionales por índice (base cero): `$0` es el primero, `$1` el segundo. Útil cuando el comando espera varias piezas: `Arregla el issue #$0 con prioridad $1`.

**Salida de shell embebida.** Una línea que empieza por `!` con un comando entre comillas invertidas se **ejecuta antes** de que el prompt llegue a Claude, y su salida se inyecta en el prompt. Esto es lo que convierte un comando de "prompt fijo" en algo dinámico:

```markdown
---
description: Crea un commit con mensaje convencional
allowed-tools: Bash(git add:*), Bash(git commit:*), Bash(git diff:*)
argument-hint: [mensaje]
---
## Cambios en staging
!`git diff --cached`

Crea un mensaje de commit siguiendo Conventional Commits a partir del diff de arriba.
Si se proporciona $ARGUMENTS, úsalo como base del mensaje.
```

Cuando invocas `/commit`, primero se ejecuta `git diff --cached`, su salida entra en el prompt, y Claude redacta el mensaje con el diff real delante. Para que ese `git diff` no te pida aprobación cada vez, está pre-aprobado en `allowed-tools`.

> **Comandos con efectos secundarios.** Para un comando que *hace* algo con consecuencias (commitea, despliega), añade `disable-model-invocation: true` al frontmatter. Así solo se dispara cuando **tú** lo tecleas deliberadamente, y Claude nunca lo lanza por su cuenta al juzgarlo relevante. Es el patrón correcto para `/commit`, `/deploy` y similares.

### 2.4. Los cuatro comandos del temario, construidos

El temario pide cuatro flujos concretos. Vamos a montarlos como comandos reales, no como descripciones.

**Explicar código** — `.claude/commands/explain.md`:

```markdown
---
description: Explica un fichero o función
allowed-tools: Read, Grep, Glob
argument-hint: [ruta o función]
---
Explica $ARGUMENTS para alguien que entra nuevo al proyecto:
1. Qué hace, en dos frases.
2. Cómo encaja con el resto del módulo.
3. Las decisiones no obvias y por qué están así.
No describas línea a línea; ve a lo que no se entiende solo leyendo.
```

Lleva solo tools de lectura: explicar no debe tocar nada.

**Arreglar errores** — `.claude/commands/fix.md`:

```markdown
---
description: Diagnostica y arregla un error
allowed-tools: Read, Grep, Glob, Edit, Bash(make test:*)
argument-hint: [descripción del error o traza]
---
Tienes este error: $ARGUMENTS

1. Localiza la causa raíz LEYENDO el código antes de proponer nada.
2. Explica por qué ocurre, en una frase.
3. Aplica el arreglo mínimo.
4. Ejecuta `make test` y confirma que pasa.
No toques nada fuera de lo necesario para este error.
```

El guardarraíl "lee antes de proponer" es deliberado: evita que el modelo parchee a ciegas.

**Generar pruebas** — `.claude/commands/test.md`:

```markdown
---
description: Genera tests para un fichero
allowed-tools: Read, Grep, Glob, Edit, Bash(make test:*)
argument-hint: [ruta del fichero]
---
Genera tests para $ARGUMENTS:
1. Detecta el framework de test que ya usa el proyecto (no introduzcas otro).
2. Cubre el camino feliz, los casos límite y el manejo de errores.
3. Usa las factorías de datos del proyecto, nunca mocks en línea.
4. Ejecuta la suite y verifica que los nuevos tests pasan.
```

**Crear comandos** — el meta-paso. Crear un comando es, literalmente, crear un fichero `.md` en `.claude/commands/`. No hay API que documentar ni nada que instalar: es markdown en una carpeta. El propio Claude puede crearte el fichero si se lo pides ("créame un comando `/changelog` que genere el changelog a partir de los commits desde el último tag"), pero conviene que entiendas la anatomía —frontmatter, argumentos, `!` para shell— para revisarlo y afinarlo, que es justo lo que acabamos de ver.

### 2.5. Cómo se descubren y se prueban

- Teclea `/` en el terminal: aparecen todos los comandos, los tuyos incluidos, con su `description`. El autocompletado funciona en cualquier punto del input.
- `/help` lista todos los comandos disponibles.
- El nombre del comando es el **nombre del fichero**, no el campo `name` del frontmatter (ese solo es la etiqueta que se muestra). `optimize.md` → `/optimize`, siempre.

---

## 3. CLAUDE.md vs. reglas vs. comandos: cuándo cada uno

Es la decisión de criterio de toda la sesión. Tres mecanismos, tres propósitos:

| Mecanismo | Responde a... | Cuándo se aplica | Ejemplo |
|---|---|---|---|
| **CLAUDE.md** | "¿Qué debe **saber** Claude siempre?" | Carga automática, cada sesión | "Los tests se lanzan con `make test`" |
| **Reglas** (`.claude/rules/`, `@`) | "¿Qué debe saber Claude **en esta parte** del código?" | Cuando trabajas en esa zona | "Los componentes llevan tests con Testing Library" |
| **Slash commands** | "¿Qué **procedimiento repetible** quiero disparar a demanda?" | Cuando tú lo invocas con `/` | `/commit`, `/review`, `/test` |

La frontera CLAUDE.md ↔ comando, dicha de otra forma: usa el CLAUDE.md para directrices y contexto que aplican de forma transversal a muchas tareas; usa un comando para un procedimiento específico y repetible con un flujo definido. Un comando además te deja **restringir las tools** y **estructurar el proceso** mejor que una instrucción suelta en el CLAUDE.md, que le deja a Claude demasiada libertad.

> **Puente a la Sesión 3.** Esta tabla tiene una cuarta fila que aún no hemos abierto: las **skills**. Una skill es un comando que, además, Claude puede invocar *solo* cuando lo juzga relevante, y que puede traer ficheros de apoyo (plantillas, scripts, documentación). Cuando un comando se te queda corto —necesitas que se active sin que lo teclees, o que arrastre material— es la señal de que toca convertirlo en skill. Ese es el primer tema de mañana.

---

## 4. Errores frecuentes (y cómo se diagnostican)

**"Mi comando modifica cosas que no debería."** No le pusiste `allowed-tools`, así que tiene acceso a todas las tools por defecto, incluida la edición. Restríngelo: un comando de lectura lleva solo `Read, Grep, Glob`.

**"`$ARGUMENTS` no recoge lo que paso."** Confusión entre `$ARGUMENTS` (todo como un string) y `$0`/`$1` (posicionales, base cero). Si esperas varias piezas separadas, usa los posicionales; si quieres todo el texto de golpe, `$ARGUMENTS`.

**"El comando me pide aprobación para el `git diff` cada vez."** El shell embebido con `!` necesita que esa tool esté pre-aprobada en `allowed-tools` (`Bash(git diff:*)`). Sin eso, salta el permiso en cada invocación.

**"Claude lanza solo un comando con efectos que no quería."** Si es un comando con consecuencias (deploy, commit), ponle `disable-model-invocation: true` para que solo se dispare cuando lo tecleas tú.

**"Mi CLAUDE.md y un comando se contradicen."** Pasa cuando duplicas en el comando algo que ya está en el CLAUDE.md y luego solo actualizas uno. No repitas: el comando puede *referirse* a las convenciones del CLAUDE.md sin volver a enunciarlas.

---

## Ejercicio

1. Crea un comando de proyecto `/review` en `.claude/commands/review.md` que: reciba una ruta por `$ARGUMENTS`, lleve `allowed-tools` solo de lectura, y devuelva los hallazgos organizados en *crítico / importante / menor*. Pruébalo sobre un fichero real.

2. Crea un comando `/commit` que embeba `git diff --cached` con `!`, tenga las tools de git pre-aprobadas, y lleve `disable-model-invocation: true`. Verifica que redacta el mensaje a partir del diff real.

3. Coge una instrucción que tengas en tu CLAUDE.md y que **solo aplique a una parte del código**, y muévela a una regla con ámbito. Comprueba que tu CLAUDE.md raíz ha encogido.

El objetivo es que termines con una intuición clara de qué va en cada sitio: lo que Claude debe saber siempre (CLAUDE.md), lo que debe saber según dónde trabaje (reglas), y lo que debe hacer cuando se lo pides (comandos).

---

## Referencias

Documentación oficial de Anthropic (comprobada en junio de 2026). Las URLs son estables, pero el contenido se actualiza con frecuencia; si algún detalle difiere de lo que veas en pantalla, la fuente oficial manda.

1. **Slash commands.** Referencia oficial de los comandos: ubicaciones de proyecto y personal, frontmatter (`description`, `allowed-tools`, `argument-hint`, `disable-model-invocation`), argumentos (`$ARGUMENTS`, `$0`/`$1`), y shell embebido con `!`. Incluye la nota oficial de que `.claude/commands/` es formato *legacy* y la recomendación de migrar a skills.
   <https://code.claude.com/docs/en/slash-commands>

2. **Memory / CLAUDE.md.** Para la parte de reglas modulares y cómo el CLAUDE.md raíz actúa de índice hacia ficheros con ámbito.
   <https://code.claude.com/docs/en/memory>

3. **Skills (puente a la Sesión 3).** El formato recomendado al que migran los comandos, con invocación autónoma y ficheros de apoyo. Lo abrimos a fondo mañana.
   <https://code.claude.com/docs/en/skills>

> **Comprobar en clase:** `/help` lista todos los comandos disponibles; teclear `/` los muestra con su descripción. Si un comando no aparece, revisa que el fichero esté en `.claude/commands/` y tenga extensión `.md`.

> **Siguiente sesión (1 de julio):** Skills, agentes y subagentes, MCPs y hooks. Empezamos justo donde lo dejamos: convertir un comando en una skill que Claude puede invocar solo y que arrastra sus propias plantillas y scripts.
