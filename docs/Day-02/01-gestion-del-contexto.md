# Sesión 2 · Lección 1 — Gestión del contexto y CLAUDE.md

> **Dónde estamos.** En la Sesión 1 viste que el prompting bien hecho te ahorra iteraciones, pero tiene un techo: por muy buenos que sean tus prompts, Claude empieza cada sesión sin saber nada de *tu* proyecto. Cada vez que abres el terminal vuelve a ser el primer día. Esta lección ataca justo ese hueco: cómo darle a Claude Code memoria persistente de tu proyecto para que dejes de re-explicar lo mismo cada mañana.

---

## 1. Qué es el contexto (y por qué te limita todo lo demás)

Cuando hablas con Claude Code, el modelo no "ve" tu proyecto. Ve una **ventana de contexto**: un bloque de texto finito que se arma al empezar cada sesión y que contiene todo lo que el modelo sabe en ese momento. Si algo no está en esa ventana, para el modelo no existe.

Esa ventana se compone, a grandes rasgos, de cuatro cosas:

1. El **prompt de sistema** de Claude Code (cómo se comporta la herramienta, qué tools tiene). No lo tocas tú.
2. Los **ficheros CLAUDE.md** que apliquen a tu sesión (lo que vas a aprender a escribir hoy).
3. El **contenido de los archivos** que Claude lee mientras trabaja (con Read, Grep, Glob...).
4. **Tu conversación**: tus mensajes y las respuestas del modelo.

Hay dos propiedades de esta ventana que condicionan tu forma de trabajar y que conviene tener clavadas desde el principio:

**Es finita.** Tiene un límite de tokens. Cuando se llena, hay que compactar o limpiar (lo verás a fondo en la Sesión 4). Todo lo que metes "por si acaso" compite por espacio con lo que de verdad importa. Más contexto no es mejor: contexto *relevante* es mejor.

**Arranca de cero en cada sesión.** Cierras el terminal, lo vuelves a abrir mañana, y Claude no recuerda nada de lo de ayer salvo lo que esté escrito en disco en un sitio que la herramienta cargue automáticamente. Ese "sitio en disco" es, principalmente, el archivo CLAUDE.md.

> **La idea central de la lección, en una frase:** el CLAUDE.md es el sitio donde escribes lo que, si no, tendrías que volver a explicarle a Claude cada vez.

### Un ejemplo para fijar la intuición

Imagina que entra un compañero nuevo al equipo. El primer día le dices: "los tests se lanzan con `make test`, no con `npm test`; el código nuevo va en `src/`, nunca toques `legacy/`; usamos commits en formato convencional; y la API de pagos está envuelta en `PaymentGateway`, no llames a Stripe directamente". Eso que le dirías a un humano el primer día —y que no quieres repetir cada mañana— es **exactamente** lo que va en el CLAUDE.md. Ni más, ni menos.

Lo que **no** le dirías a ese compañero ("esto es una función", "esto es un bucle for") tampoco va en el CLAUDE.md. Claude ya lo sabe. Escribir lo obvio solo gasta tokens y diluye lo importante.

---

## 2. El archivo CLAUDE.md

`CLAUDE.md` es un fichero de texto en markdown que Claude Code lee **automáticamente al empezar cada sesión** y cuyo contenido se inyecta en la ventana de contexto. No hay que invocarlo, ni mencionarlo, ni hacer nada: si existe en los sitios correctos, se carga.

### 2.1. Los tres niveles: global, proyecto y local

No hay un único CLAUDE.md. Hay una jerarquía, y entenderla es lo que separa un setup que escala de uno que se convierte en un archivo gigante e inmanejable.

| Nivel | Ubicación | Para qué sirve | ¿Se comparte? |
|---|---|---|---|
| **Global / usuario** | `~/.claude/CLAUDE.md` | Tus preferencias personales que repetirías en *cualquier* proyecto: formato de commits, cómo te gusta que te plantee los cambios, tu estilo de trabajo. | No. Es solo tuyo, en tu máquina. |
| **Proyecto** | `CLAUDE.md` en la raíz del repo | Contexto del stack que **todo el equipo** necesita: comandos de build/test, convenciones, arquitectura a vista de pájaro, reglas "siempre haz X". | Sí. Se versiona con git y lo recibe quien clone el repo. |
| **Local** | `CLAUDE.local.md` o vía settings local | Tus manías personales *en este proyecto* que nadie más necesita ver. | No. No se versiona. |

La clave de usar los tres es que **cada fichero se mantiene corto y enfocado**. El error típico es meterlo todo en el CLAUDE.md de proyecto: acaba siendo largo, ruidoso y contradictorio. Si una preferencia la repetirías en todos tus proyectos, va en el global, no en el de proyecto.

> **Cómo se combinan.** Claude Code recorre el árbol de directorios desde donde estás hacia la raíz del repo y va recogiendo todos los CLAUDE.md que encuentra. Los niveles **se suman, no se sustituyen**: el contenido del global y el de proyecto conviven en la misma sesión. Cuando hay conflicto entre reglas, gana la más específica (la más cercana a tu directorio de trabajo).

### 2.2. Inicializar el contexto: el comando `/init`

No tienes que escribir el CLAUDE.md a mano desde una página en blanco. Dentro de una sesión, el comando:

```
/init
```

analiza tu proyecto y genera un CLAUDE.md inicial con una estructura base: visión general del proyecto, stack tecnológico, estándares de desarrollo, convenciones de git. Es el punto de partida más rápido.

**Importante:** lo que genera `/init` es un borrador, no el resultado final. Lo que lo hace útil de verdad es lo que tú añades, recortas y precisas encima. Un CLAUDE.md autogenerado y sin revisar suele estar lleno de obviedades que Claude ya sabe.

### 2.3. Qué poner (y qué no) en el CLAUDE.md

Esta es la parte que realmente aporta valor, porque es donde casi todo el mundo se equivoca. El CLAUDE.md **no es documentación** y **no es un README**. Es un contrato de comportamiento: cada línea debería cambiar cómo actúa Claude. Si una línea no cambia su comportamiento, sobra.

**Sí va en el CLAUDE.md:**

- Comandos que Claude debe usar y que no puede adivinar: cómo lanzar build, tests, linter, migraciones.
- Convenciones del proyecto: formato de commits, estilo de código que no esté ya forzado por un linter, estructura de carpetas.
- Reglas de tipo "siempre haz X / nunca hagas Y": "nunca edites `legacy/`", "todo handler de API necesita su test".
- Una **arquitectura a vista de pájaro**: cuatro o cinco bullets que expliquen las piezas principales y cómo encajan. No un tratado.
- Terminología propia del proyecto que Claude no puede inferir leyendo el código.

**No va en el CLAUDE.md:**

- Cosas que cambian cada semana (un plan de sprint, una checklist de la tarea de hoy). El CLAUDE.md debe ser estable; si lo llenas de cosas volátiles se queda obsoleto enseguida. Para flujos repetibles usa comandos o skills (lo verás luego).
- Lo que Claude ya puede deducir leyendo el código. Si tienes un buen README o un doc de arquitectura, **referéncialo** en vez de duplicarlo: la duplicación gasta contexto y aumenta el riesgo de que las dos copias se contradigan.
- Cualquier cosa que, si la violara, bloquearía un merge en CI. Eso no es un consejo para Claude: es una regla dura, y va forzada en CI o en un hook, no escrita en un fichero que el modelo *interpreta*.

> **Matiz clave que casi nadie cuenta:** el CLAUDE.md se carga como **contexto, no como configuración que se obliga a cumplir**. Claude lo trata como instrucciones de mucho peso, pero las *interpreta*; no es un cortafuegos. Si necesitas **garantizar** que algo no ocurra pase lo que pase (por ejemplo, que nunca se ejecute un comando destructivo), no lo escribas como una frase en el CLAUDE.md y te quedes tranquilo: usa un hook `PreToolUse`, que sí bloquea de forma determinista. Esto lo retomamos en la Sesión 3 (hooks) y la 4 (seguridad).

### 2.4. Cómo se escribe para que Claude lo siga

El *cómo* importa tanto como el *qué*. Tres principios que se notan en los resultados:

**Escribe en imperativo, como órdenes, no como observaciones.** No escribas "solemos intentar evitar los mocks en línea". Escribe "nunca uses mocks en línea; usa las factorías de `src/test/factories/`". La forma imperativa elimina ambigüedad y le señala al modelo que es una regla, no una sugerencia.

**Reserva los marcadores de énfasis.** Poner `IMPORTANTE` o `DEBES` delante de una regla mejora su cumplimiento, porque el modelo pondera esas señales de prioridad. Precisamente por eso, úsalos solo en la una o dos reglas verdaderamente críticas. Si todo es "IMPORTANTE", nada lo es.

**Mantenlo corto.** No hay un límite duro, pero el patrón observado en proyectos reales es claro: 20-80 líneas para repos pequeños y librerías; a partir de ~200 líneas un CLAUDE.md empieza a comportarse como un "documento largo", se vuelve difícil de mantener y fácil de contradecir. Cuando llegas ahí, la solución no es seguir engordándolo: es **modularizar** (lo verás en la siguiente lección, con las reglas en `.claude/rules/`).

> **Truco práctico.** Los comentarios HTML de bloque (`<!-- nota para el equipo -->`) en un CLAUDE.md se eliminan antes de inyectar el contenido en el contexto. Te sirven para dejar notas a humanos sin gastar tokens del modelo.

---

## 3. Contexto global vs. contexto por archivos

Hasta aquí hemos hablado del CLAUDE.md como un bloque que se carga entero. Pero hay dos formas complementarias de dar contexto, y elegir bien entre ellas es lo que mantiene tu ventana limpia.

**Contexto global (el CLAUDE.md que se carga siempre).** Todo lo que pones en el CLAUDE.md de proyecto se inyecta en *cada* sesión, trabajes donde trabajes dentro del repo. Es potente, pero tiene un coste: ocupa espacio en todas las sesiones, también en las que ese contexto no hace falta. Por eso el CLAUDE.md de raíz debe quedarse pequeño y estable.

**Contexto por archivos (imports y reglas con ámbito).** En vez de meterlo todo en el fichero raíz, puedes:

- **Referenciar otros ficheros** desde el CLAUDE.md con la sintaxis `@ruta/al/fichero.md`. Así el CLAUDE.md raíz se convierte en un índice y el detalle vive en ficheros aparte que se cargan cuando hacen falta.
- **CLAUDE.md por subdirectorio.** En un monorepo, puedes tener un CLAUDE.md en la raíz con lo común y un CLAUDE.md dentro de `services/pagos/` con lo específico de pagos, que solo entra en juego cuando trabajas ahí.

La regla mental es sencilla: **lo que es transversal y estable va arriba (global); lo que es profundo, específico de una zona del código o solo relevante a veces, va en ficheros con ámbito.** El CLAUDE.md raíz tiende a quedarse como el índice que enruta hacia lo demás.

---

## 4. Exclusión de archivos con datos sensibles

Claude Code lee ficheros para trabajar, y también recoge automáticamente los CLAUDE.md que encuentra al recorrer el árbol. Dos problemas reales que tienes que saber gestionar:

**No quieres que datos sensibles entren en el contexto.** Un `.env` con claves, un fichero de credenciales, un dump con datos personales. Hay varias capas de protección, que verás a fondo en la Sesión 4 (seguridad), pero la idea de hoy es: la herramienta permite definir qué no se toca, y tú tienes que ser explícito sobre qué queda fuera de límites. No confíes en que "Claude no lo va a leer": díselo, y mejor aún, fuérzalo con permisos.

**No quieres que CLAUDE.md de otros equipos contaminen tu sesión.** En un monorepo grande, al recorrer el árbol Claude puede recoger CLAUDE.md de equipos vecinos que no tienen nada que ver con lo que haces. Para eso existe el ajuste **`claudeMdExcludes`**: defines patrones (estilo glob, sobre rutas absolutas) de CLAUDE.md que quieres que se salte. Se puede configurar a nivel de usuario, proyecto o local, y los patrones de las distintas capas se acumulan.

> **Detalle de seguridad que conviene conocer:** los CLAUDE.md de *managed policy* (los que impone tu organización) **no se pueden excluir**. Es deliberado: garantiza que las instrucciones de toda la organización se apliquen siempre, sin que un ajuste individual las desactive.

---

## 5. Caso completo: de cero a un CLAUDE.md que aporta

Vamos a recorrer el flujo entero sobre un repo de ejemplo genérico —una API en Node con Postgres— para que veas el criterio en acción, no solo la teoría.

**Paso 1 — Generar el borrador.** Abres el terminal en la raíz del repo y lanzas `/init`. Claude inspecciona el proyecto y te deja un CLAUDE.md con secciones de overview, stack, estándares y git. Lo abres con `/memory` para revisarlo.

**Paso 2 — Diagnóstico del borrador.** Lo lees con ojo crítico. Te encuentras, típicamente, con tres tipos de líneas:

- *Obviedades:* "Este proyecto usa JavaScript y tiene archivos `.js`." → fuera. Claude lo ve leyendo el repo.
- *Cosas correctas pero blandas:* "Intenta escribir código limpio." → o lo concretas o fuera. "Código limpio" no cambia ninguna decisión.
- *Aciertos:* "El proyecto usa Postgres con migraciones en `db/migrations/`." → se queda, quizá afinado.

**Paso 3 — Reescribir en imperativo y concreto.** Conviertes lo blando en órdenes accionables. Ejemplo de cómo podría quedar el núcleo del fichero:

```markdown
# API de Pedidos — contexto de proyecto

## Comandos
- Tests: `make test` (NUNCA `npm test`, no está configurado)
- Lint: `make lint` antes de cada commit
- Migraciones: `make db-migrate`, los ficheros van en `db/migrations/`

## Arquitectura (vista de pájaro)
- API REST en `src/api/`, lógica de negocio en `src/domain/`
- Toda la persistencia pasa por los repos de `src/repositories/`;
  nunca escribas SQL suelto fuera de ahí
- Los pagos están envueltos en `PaymentGateway`; no llames a Stripe directo

## Reglas
- IMPORTANTE: nunca edites nada bajo `legacy/`, está congelado
- Todo endpoint nuevo necesita su test en `tests/api/`
- Commits en formato convencional (`feat:`, `fix:`, `chore:`...)

## Referencias
- Arquitectura detallada: @docs/architecture.md
- Convenciones de API: @docs/api-standards.md
```

Fíjate en lo que está pasando ahí:

- Hay **un solo** `IMPORTANTE`, en la regla más crítica (no romper `legacy/`).
- Los detalles largos (arquitectura, convenciones) están **referenciados** con `@`, no copiados. El CLAUDE.md raíz se queda como índice.
- Cada línea **cambia una decisión** de Claude. No hay relleno.
- Está en imperativo: "nunca edites", "todo endpoint necesita", no "solemos procurar que".

**Paso 4 — Probarlo.** La única forma fiable de saber si tu CLAUDE.md funciona es probarlo. Pídele a Claude un par de tareas representativas (crea un endpoint, añade un test, haz un cambio cerca de `legacy/`) y revisa si respeta las reglas. Si se salta una regla de forma consistente, esa regla está mal escrita, mal ubicada o contradice a otra. Eso es justo la información que necesitas para arreglarla.

**Paso 5 — Mantenerlo.** Un CLAUDE.md es un ser vivo. Revísalo cada cierto tiempo: quita lo que ya fuerza el CI, actualiza la arquitectura cuando cambie, borra secciones de features muertas. Un buen CLAUDE.md tiende a **encoger** un poco con el tiempo, no a crecer sin freno.

---

## 6. Errores frecuentes (y cómo se diagnostican)

**"Le he escrito la regla en el CLAUDE.md y no la cumple."** Tres causas típicas, en orden de probabilidad:
1. La regla es vaga ("escribe código mantenible"). → Reescríbela concreta y en imperativo.
2. Contradice a otra regla del fichero, o a otro CLAUDE.md de la jerarquía. → Busca el conflicto.
3. La regla *necesita* ser una garantía dura, no una instrucción interpretada. → No es trabajo del CLAUDE.md; muévela a CI o a un hook.

**"Mi CLAUDE.md se ha vuelto un monstruo de 300 líneas."** Señal de que estás metiendo en el fichero raíz cosas que deberían estar modularizadas (reglas con ámbito, ficheros referenciados con `@`) o que directamente sobran (obviedades, cosas volátiles). Es el problema que resuelve la siguiente lección.

**"Una regla desapareció a mitad de sesión."** Si tras compactar el contexto (`/compact`) Claude deja de respetar algo, lo más probable es que esa instrucción viviera **solo en la conversación** y nunca llegara a estar en el CLAUDE.md. Tras compactar, Claude vuelve a leer el CLAUDE.md de disco, pero no recupera lo que solo dijiste de palabra. Diagnóstico limpio: si perder el contexto te duele, escríbelo en disco.

---

## Ejercicio

Sobre un repositorio tuyo (o uno de ejemplo), haz el flujo completo de la sección 5:

1. Lanza `/init` y abre el resultado con `/memory`.
2. Marca cada línea del borrador como *obviedad*, *blanda* o *acierto*.
3. Reescribe el fichero dejándolo en 20-40 líneas: todo en imperativo, un único `IMPORTANTE`, y al menos un detalle movido a un fichero referenciado con `@`.
4. Pruébalo con dos tareas y comprueba si respeta tus reglas.

El objetivo no es tener un CLAUDE.md "completo", sino uno donde **cada línea se gane su sitio**.

---

## Referencias

Documentación oficial de Anthropic (comprobada en junio de 2026). Las URLs son estables, pero el contenido se actualiza con frecuencia; si algún detalle difiere de lo que veas en pantalla, la fuente oficial manda.

1. **Memory / CLAUDE.md.** Referencia oficial de cómo Claude Code carga contexto persistente: los tres niveles de CLAUDE.md, la auto-memoria, `claudeMdExcludes`, comentarios HTML, y carga en monorepos.
   <https://code.claude.com/docs/en/memory>

2. **Visión general de Claude Code.** Cómo la herramienta arma el contexto de cada sesión (sistema + CLAUDE.md + archivos + tu conversación).
   <https://code.claude.com/docs/en/overview>

3. **Effective context engineering for AI agents** (blog de ingeniería de Anthropic). Por qué el contexto relevante pesa más que el contexto abundante; principios que sustentan todo lo de esta lección.
   <https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents>

> **Comandos que usamos en esta lección:** `/init` (genera el CLAUDE.md inicial) y `/memory` (abre y edita los ficheros de memoria de la sesión). Compruébalos en directo con `/help`, que lista todos los comandos disponibles.

> **Siguiente lección:** ya tienes memoria persistente del proyecto. Ahora vamos a hacer que Claude *actúe* de formas repetibles y bajo reglas con ámbito: instrucciones personalizadas, reglas modulares en `.claude/rules/`, y slash commands para empaquetar los prompts que repites cada día (explicar código, arreglar errores, generar pruebas) y crear los tuyos propios.
