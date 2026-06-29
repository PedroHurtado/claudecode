# Sesión 4 · Lección 1 — Gestión de sesiones largas

> **Dónde estamos.** Llevamos tres sesiones tratando la ventana de contexto como el recurso crítico: la cuidamos con el CLAUDE.md (no re-explicar), con skills (cargar a demanda) y con subagentes (sacar el ruido fuera). Esta lección cierra ese hilo de frente: qué haces cuando una sesión se alarga tanto que la ventana se llena igualmente. Es el problema que más moldea tus resultados en el día a día, más de lo que parece.

---

## 1. El problema: "context rot"

Ya viste en la Sesión 2 que la ventana es finita. Lo que no habíamos nombrado es **qué pasa cuando se acerca al límite**, y es lo que de verdad duele en sesiones largas.

El síntoma lo reconocerás: estás a fondo en una refactorización compleja, avanzando bien, y de pronto Claude empieza a flojear. Las respuestas se vuelven genéricas, contradice decisiones que tomasteis hace media hora, "olvida" un patrón del proyecto que venía respetando, o vuelve a pedirte algo que ya le diste. No es descuido. Es una consecuencia directa de cómo funcionan los modelos: **a medida que la ventana se llena, la atención del modelo se reparte más fina y la calidad cae**. A esto se le llama *context rot* (degradación por contexto).

El punto contraintuitivo, y que conviene clavar: **una ventana más grande no resuelve el problema, solo lo retrasa.** Incluso con un millón de tokens, los mecanismos de atención siguen pesando más lo reciente que lo antiguo. En algún punto de una sesión muy larga, las instrucciones del principio reciben atención menos fiable, esté o no "dentro" de la ventana técnicamente. La solución no es más espacio: es mantener el contexto *limpio*.

> **La consecuencia práctica:** no esperes a llenar la ventana. La calidad cae antes de tocar el límite. Trabajar bien sesiones largas es, sobre todo, intervenir *antes* de que el contexto se degrade.

---

## 2. Las dos herramientas: `/compact` y `/clear`

Cuando una sesión se alarga, tienes dos formas de soltar lastre. Se parecen, pero se comportan de forma muy distinta, y elegir bien es criterio puro.

### 2.1. `/compact` — resumir y continuar

`/compact` le pide a Claude que **resuma** la conversación hasta ahora y reemplaza el historial por ese resumen como nuevo punto de partida. Liberas tokens conservando el hilo esencial de la sesión. Es *con pérdida* (lossy): el resumen guarda las decisiones de alto nivel, los cambios de código recientes y la trayectoria general, pero detalles finos —una firma de función exacta, un mensaje de error preciso— pueden condensarse o perderse.

Puedes **dirigir** la compactación con instrucciones:

```
/compact céntrate en el arreglo del bug de auth, descarta el debugging de tests
```

Con una pista así, Claude prioriza mantener eso intacto y comprime el resto más agresivamente. Sin pista, decide él qué importó, y a veces deja fuera algo que necesitabas.

### 2.2. `/clear` — reiniciar a cero

`/clear` borra **todo** el contexto de la conversación y arranca una sesión en blanco. Sin resumen, sin historial. Es un reset duro (aunque el CLAUDE.md se vuelve a cargar automáticamente, porque vive en disco, no en la conversación).

> **Cuidado:** `/clear` elimina el historial de la sesión. Antes de usarlo, asegúrate de haber guardado en disco (en el CLAUDE.md, o en un fichero de progreso) cualquier contexto que necesites conservar.

### 2.3. Compactación automática vs. manual

Claude Code compacta **solo** cuando te acercas al límite de la ventana (auto-compact). El problema es que, en ese punto, el modelo ya opera degradado: la compactación automática ocurre justo en el peor momento de "inteligencia" del modelo, y resume sin saber qué querías preservar.

La compactación **manual**, lanzada de forma proactiva, corre mientras todavía hay margen. El modelo aún tiene recuerdo claro de toda la conversación, así que produce mejores resúmenes. De ahí la práctica recomendada:

> **No esperes al auto-compact.** Compacta tú, de forma proactiva, en los límites naturales de tarea: terminaste una función, cerraste un módulo, resolviste un bug → `/compact`. Piénsalo como un *checkpoint*. Compactar *después* de que la calidad ya cayó es menos efectivo, porque el resumen arrastra también los outputs confusos.

### 2.4. Cómo elegir: ¿el contexto previo suma o resta?

La decisión entre los dos no es "cuán llena está la ventana", sino **si el contexto previo tiene valor positivo o negativo** para lo que viene:

| Situación | Herramienta |
|---|---|
| Sigues en la **misma tarea**, pero vas justo de ventana; las decisiones previas deben sobrevivir | `/compact` |
| Cambias a una tarea **no relacionada** (de backend a un frontend que no tiene que ver) | `/clear` |
| El contexto está **"envenenado"**: el modelo insiste en una asunción incorrecta que no suelta | `/clear` |
| Parte del contexto vale y parte es ruido (mucho debugging que ya no aplica) | `/compact` con instrucciones dirigidas |

Regla mnemotécnica: **`/clear` te da control** (tú escribes el contexto de arranque), **`/compact` te automatiza la limpieza** (Claude decide qué resumir).

> **Herramientas de apoyo para ver el estado:** `/context` te da un desglose en vivo de qué está ocupando tu ventana, por categorías, con sugerencias. Úsalo cuando la sesión empiece a sentirse larga y *antes* de lanzar una operación grande (una búsqueda amplia, la lectura de un fichero enorme). Ver 80% usado antes de empezar una operación de 30.000 tokens te dice que limpies o compactes primero. Y `/memory` te muestra qué ficheros CLAUDE.md y de memoria se cargaron al arrancar.

---

## 3. Qué sobrevive a la compactación (y qué no)

Esto resuelve uno de los errores más frecuentes y misteriosos, que ya anticipamos en la Sesión 2. Cuando una sesión se compacta, qué pasa con tus instrucciones depende de **cómo se cargaron**:

- **Las reglas con ámbito de ruta y los CLAUDE.md anidados** se cargan en el historial de mensajes cuando se lee su fichero disparador. Por tanto, la compactación **los resume junto con todo lo demás**. Se vuelven a cargar la próxima vez que Claude lee un fichero que coincida. Si una regla *debe* sobrevivir a la compactación, quítale el ámbito de ruta (el `paths:` del frontmatter) o muévela al CLAUDE.md de raíz del proyecto.
- **Los cuerpos de las skills** se re-inyectan tras la compactación, pero las skills grandes se truncan para caber en su tope, y las más antiguas se descartan si se excede el presupuesto. El truncado conserva el *principio* del fichero: por eso pon las instrucciones más importantes **al principio** del SKILL.md.
- **El CLAUDE.md de raíz** se recarga automáticamente: vive en disco y sobrevive a `/compact`, a `/clear`, al cierre de sesión y al reinicio de la máquina.

> **El diagnóstico limpio del que hablamos en la Sesión 2, ahora completo:** si tras compactar Claude "olvidó" algo, lo más probable es que esa información viviera **solo en la transcripción** (instrucciones detalladas del principio, una regla con ámbito, una skill invocada hace mucho). La transcripción es justo lo que se resume. La cura: si perder algo te dolería, que no viva solo en la conversación. Escríbelo en disco.

---

## 4. Estrategia de trabajo por tareas acotadas

Todo lo anterior es reactivo: gestionar la ventana cuando se llena. La estrategia *proactiva* —la que evita la mayoría de los problemas de contexto— es estructurar el trabajo en **tareas acotadas** desde el principio.

La regla general de Anthropic es simple: **cuando empiezas una tarea nueva, empieza también una sesión nueva.** Aunque los contextos de un millón de tokens te dejen hacer tareas más largas de forma fiable, el *context rot* sigue acechando. A veces hay tareas relacionadas donde parte del contexto aún sirve (escribir la documentación de una feature que acabas de implementar); ahí `/compact` tiene sentido. Pero el cambio a algo no relacionado pide sesión nueva.

Llevado al diseño del trabajo, en vez de intentar una feature grande y multi-parte en una sola sesión, pártela en sesiones discretas con principio y fin claros:

- **Sesión A:** implementa el modelo de datos y escribe sus tests.
- **Sesión B:** construye la capa de API usando el modelo de la Sesión A.
- **Sesión C:** conecta el frontend con la API.

Cada sesión arranca limpia, con un alcance enfocado. Y aquí está la pieza clave: **referencias los resultados de las sesiones anteriores a través de ficheros, no de un hilo de conversación que crece sin fin.** Un fichero de progreso, el propio código, la documentación. Eso es estado *determinista*: no se degrada, no se resume, no se pierde.

> **El patrón de "retomar" bien hecho.** Cuando vuelvas a una sesión (`claude --continue` para la última, o `claude --resume` para elegir una), haz que tu **primera instrucción** sea "lee el fichero de plan/progreso y dime dónde estamos". Así el arranque se ancla en estado determinista de disco, no en una transcripción que pudo haberse compactado. Es la diferencia entre retomar sobre roca y retomar sobre arena.

### El otro lado: instrucciones bien formadas

Un detalle que ahorra mucho contexto: especifica la tarea, la intención y las restricciones **por adelantado, en una instrucción bien formada**, en vez de irlas soltando a lo largo de muchos turnos. Una negociación larga, ambigua y multi-turno es cara en contexto (y en tiempo de reloj). El contexto más barato que recuperarás es el que nunca necesitaste guardar.

---

## 5. Cuándo dejar de pelear con la ventana

Una señal clara: si te pasas la sesión *peleando continuamente* con el contexto —compactando cada poco, viendo cómo se degrada pese a todo—, la respuesta no es más disciplina de compactación. Es que la tarea es demasiado grande para una sola sesión, y toca **orquestar**: subagentes (que viste ayer) para el trabajo paralelo o ruidoso, o partir en sesiones discretas como en la sección anterior. Cuando la tarea quiere paralelismo o abarca mucho más de una ventana incluso externalizando con disciplina, la respuesta es dividir, no una sesión heroicamente larga.

---

## Ejercicio

1. En una sesión de trabajo real, lanza `/context` en tres momentos: al empezar, a mitad, y antes de una operación grande. Observa cómo cambia el reparto y qué categorías crecen.
2. Termina una subtarea (una función, un módulo) y haz `/compact` con una instrucción dirigida que preserve lo relevante. Comprueba que la sesión sigue y que el modelo conserva las decisiones clave.
3. Diseña una feature tuya como **tres sesiones acotadas** que se comunican por un fichero de progreso en vez de por una conversación única. Escribe ese fichero de progreso tú mismo al cerrar cada sesión.

El objetivo es interiorizar que gestionar el contexto no es una molestia ocasional, sino la habilidad que más moldea la calidad de tu trabajo con Claude Code.

---

## Referencias

Documentación oficial de Anthropic (comprobada en junio de 2026). Las URLs son estables, pero el contenido se actualiza con frecuencia; si algún detalle difiere de lo que veas en pantalla, la fuente oficial manda.

1. **Explore the context window (Claude Code).** Referencia oficial: qué carga en la ventana y cuándo, qué preserva la compactación, qué les pasa a reglas con ámbito y skills al compactar, y los comandos `/context` y `/memory`.
   <https://code.claude.com/docs/en/context-window>

2. **Using Claude Code: session management and 1M context** (blog de Anthropic). El criterio `/compact` vs. `/clear` vs. subagentes, el riesgo de un mal auto-compact, y la regla "tarea nueva → sesión nueva".
   <https://claude.com/blog/using-claude-code-session-management-and-1m-context>

> **Comprobar en clase:** `/context` (reparto en vivo del contexto), `/compact` (con y sin instrucciones), `/clear`, `claude --continue` y `claude --resume`. Compara la diferencia de calidad entre un compact manual proactivo y dejar saltar el automático.

> **Siguiente lección:** la estrategia por tareas acotadas se apoya en algo que aún no hemos tratado a fondo: cómo Claude Code trabaja con Git. Commits, revisión de cambios, pull requests, resolución de conflictos, y los *worktrees* que te dejan correr varias sesiones en paralelo sin que se pisen. Es la infraestructura que hace que el trabajo acotado y paralelo sea viable.
