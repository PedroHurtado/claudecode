# Lección 2 — Instalación, configuración y modos de trabajo

> **Sesión 1 · Bloque de tarde.** En la lección anterior vimos cómo se le habla al modelo. Ahora ponemos la herramienta delante y abordamos la decisión que más vas a repetir cada día: **cuánta autonomía le das a Claude Code en cada tarea**. Esa decisión se materializa en los *modos de trabajo*, y es el verdadero corazón de esta lección.

---

## 1. Qué es Claude Code, y qué no es

Antes de instalar nada, conviene fijar el modelo mental correcto, porque condiciona todo lo demás.

Claude Code **no es un chat al lado del editor**. No es un autocompletado mejorado. Es un **agente que vive en tu terminal**, arranca en el directorio de tu proyecto y considera ese punto como la raíz. Desde ahí puede:

- Leer los archivos de tu repositorio.
- Crear y modificar archivos.
- Ejecutar comandos de tu terminal (instalar dependencias, lanzar tests, hacer commits).
- Integrarse con herramientas externas (lo veremos con los MCP en la Sesión 3).

La diferencia con un asistente de copiar-y-pegar es enorme: en lugar de que tú hagas de intermediario llevando código de un lado a otro, **el entorno del modelo es tu entorno de desarrollo**. Tú fijas el objetivo, supervisas y revisas; él actúa.

La metáfora que mejor funciona en clase: trátalo como un **desarrollador júnior muy rápido y muy capaz, pero que necesita supervisión**. No le darías a un júnior acceso a producción sin revisar su trabajo; tampoco revisarías cada punto y coma que escribe. El equilibrio entre esos dos extremos es, literalmente, lo que configuran los modos de trabajo.

> 📚 **Referencia oficial.** Visión general de Claude Code: <https://code.claude.com/docs/en/overview>

---

## 2. Instalación y configuración: por qué no la documentamos aquí

Voy a ser explícito sobre una decisión de este curso, porque es deliberada.

**No vamos a reproducir en estos apuntes el comando exacto de instalación, los requisitos de Node.js, ni el flujo de autenticación.** Tres razones:

1. **Cambia con frecuencia.** El método de instalación, las versiones soportadas y los canales (estable vs. último) se actualizan a menudo. Cualquier comando que escriba hoy aquí puede estar obsoleto la semana que viene. La fuente fiable es la documentación oficial, no un PDF de curso.
2. **Ya está perfectamente documentado.** Duplicar la referencia de Anthropic no aporta nada; solo introduce una copia que envejece.
3. **No es donde está el valor.** El valor de este curso no es *cómo se teclea el instalador*, es *cómo se trabaja* una vez instalado. Eso es lo que no encontrarás resumido en ningún sitio.

**En clase lo instalamos juntos, en directo, contra la documentación oficial actual.** Así ves el proceso real, con la versión real del día, y resolvemos los problemas concretos de tu máquina (que es donde de verdad surgen las dudas: permisos en macOS, Git for Windows, WSL...).

> 📚 **Referencia oficial de instalación (la usaremos en directo):** <https://code.claude.com/docs/en/overview>
> Para comprobar tu versión una vez instalado: `claude --version`. Para actualizar: `claude update`.

Lo que sí necesitas tener claro antes de seguir:

- Claude Code se lanza desde la terminal con el comando `claude`, **dentro del directorio del proyecto**.
- Ese directorio es la raíz desde la que lee y actúa. Lanzarlo desde la carpeta correcta importa (lo retomaremos con el contexto en la Sesión 2).
- Requiere conexión a internet: se comunica con la API de Anthropic. No hay modo offline.

---

## 3. El núcleo de la lección: los modos de trabajo

Aquí está lo que de verdad separa a quien usa Claude Code con criterio de quien lo sufre. Claude Code puede actuar con **distintos niveles de autonomía**, y elegir el adecuado para cada tarea es la decisión más frecuente e importante de tu día a día.

### Una aclaración importante sobre nombres

El temario lista los modos como "Plan", "Ask before edits" y "Edit automatically". Esos nombres describen bien la *idea*, pero conviene que conozcas los nombres y el comportamiento **reales** de la herramienta, porque es lo que vas a ver en pantalla. Los modos que se ciclan por defecto son:

| Nombre en el temario | Nombre real en la herramienta | Qué hace |
|---|---|---|
| Ask before edits | **default** (normal) | Pregunta antes de cada operación potencialmente peligrosa |
| Edit automatically | **acceptEdits** (auto-accept) | Aplica ediciones de archivo sin preguntar |
| Plan | **plan** | Solo lectura: investiga y propone, no modifica nada |

Existen además dos modos avanzados que **no** están en el ciclo por defecto y que veremos por encima en la Sesión 4 por sus implicaciones de seguridad: `auto` (un clasificador revisa cada acción) y `bypassPermissions` (el famoso "modo YOLO", que se salta todos los permisos). Por ahora nos centramos en los tres principales.

> 📚 **Referencia oficial de modos de permiso:** <https://code.claude.com/docs/en/permission-modes>

### Cómo se cambia de modo

Esto es importante y poco intuitivo al principio: **el modo no se cambia pidiéndoselo a Claude en el chat.** Se cambia con un control de la herramienta:

- **`Shift+Tab`** cicla entre los modos: default → acceptEdits → plan → (y vuelta a empezar).
- El modo activo aparece indicado en la barra de estado, normalmente abajo a la izquierda.
- Puedes **arrancar** directamente en un modo desde la terminal, por ejemplo `claude --permission-mode plan`, útil cuando ya sabes que la próxima tarea necesita pensarse antes de tocar archivos.
- Puedes fijar un modo **por defecto** para un proyecto con `defaultMode` en `.claude/settings.json`.

En clase haremos el gesto de `Shift+Tab` varias veces hasta que sea automático, porque es el atajo que más usarás.

---

## 4. Modo Plan, en profundidad

### Qué hace exactamente

En modo Plan, Claude Code **analiza y propone, pero no modifica nada**. Lee archivos, ejecuta comandos de exploración (solo lectura), razona sobre el problema y te presenta un plan de acción. No edita tu código fuente.

¿Te suena? Es exactamente el **chain of thought** de la lección anterior, convertido en una característica de la herramienta. Anthropic lo ha integrado precisamente porque "pensar antes de actuar" es tan consistentemente útil que merecía un modo propio.

### El flujo real

1. Entras en modo Plan (`Shift+Tab` hasta verlo en la barra, o `--permission-mode plan` al arrancar).
2. Le planteas la tarea.
3. Claude explora tu código y redacta un plan: qué va a hacer, en qué archivos, en qué orden.
4. Te presenta el plan y te pregunta cómo proceder.
5. Tú lo apruebas (y entonces sale de Plan y empieza a ejecutar), lo refinas, o lo descartas.

Aprobar un plan hace que la sesión pase al modo de edición correspondiente y Claude empiece a trabajar. Si quieres volver a planificar para la siguiente tarea, vuelves a entrar en Plan.

### Cuándo usarlo

- Cambios que tocan **varios archivos**.
- Refactors donde **no tienes claro el alcance**.
- Cualquier tarea sobre **código que no conoces bien**.
- Siempre que el **coste de equivocarse sea alto**.

La regla de oro que recomienda la propia comunidad: **si la tarea toca más de dos o tres archivos, planifica primero.** Aprueba el enfoque y luego ejecuta.

Plan es tu **punto de partida por defecto** para cualquier cosa no trivial. El minuto que inviertes en leer el plan te ahorra deshacer trabajo después.

---

## 5. Modo default (Ask before edits), en profundidad

### Qué hace exactamente

Es el modo conservador y, de hecho, el comportamiento por defecto de Claude Code. **Pregunta antes de cada operación potencialmente peligrosa**: escribir un archivo, ejecutar muchos comandos de bash, hacer una petición de red, usar una herramienta MCP. Ves cada acción propuesta y la apruebas o la rechazas.

### Por qué es el caballo de batalla

Es el término medio para el **trabajo cotidiano**: suficiente autonomía para avanzar, suficiente control para no llevarte sorpresas. Confías en la dirección general pero quieres ver cada diff antes de que entre.

### El peligro silencioso de este modo

Aquí hay una lección de criterio que conviene decir en voz alta, porque casi nadie la cuenta:

> Cuantas más veces te pregunta, **menos atención prestas**. Y cuanta menos atención prestas, más peligroso se vuelve aprobar a ciegas.

Aprobar el 90% de los prompts pulsando Enter sin leerlos es, en cierto modo, *peor* que un sistema automático bien diseñado: te da la *ilusión* de control sin la sustancia. Si te descubres dándole a "sí" sin leer, tienes dos opciones sanas: o bajas a un modo más automático *con red de seguridad* (Git limpio, tests), o configuras permisos más finos para que solo te pregunte lo que de verdad importa (lo veremos en la Sesión 4 con la gestión de permisos).

### Cuándo usarlo

- El trabajo diario sobre **código que conoces**.
- Partes **delicadas o de producción** donde quieres inspeccionar cada cambio.
- Cuando confías en el rumbo pero quieres mantener el control paso a paso.

---

## 6. Modo acceptEdits (Edit automatically), en profundidad

### Qué hace exactamente

Claude Code **aplica las ediciones de archivo sin pedirte permiso**. La barra de estado muestra un indicador de "auto-accept edits". Tú ves el resultado al final, no cada paso.

Un matiz que conviene conocer: este modo también auto-aprueba algunos comandos de sistema de bajo riesgo dentro de tu directorio de trabajo (crear carpetas, mover, copiar...), pero **no** todo. Las operaciones realmente sensibles y las que salen de tu directorio siguen pidiendo confirmación. No es un cheque en blanco total; es "confía en las ediciones rutinarias, sigue preguntando lo gordo".

### Cuándo usarlo

- Tareas **mecánicas y de bajo riesgo**: formateo, renombrados masivos, cambios repetitivos.
- Código de **usar y tirar**: un script puntual, un prototipo, una prueba rápida.
- Situaciones donde tienes una **red de seguridad sólida detrás**: control de versiones limpio, de modo que revertir cualquier desaguisado es trivial.

### Cuándo NO usarlo

- Código crítico que **no puedes revisar de un vistazo** al final.
- Nada importante **sin Git limpio y/o tests** que te permitan deshacer.

La comodidad de la autonomía dura hasta que aplica diez cambios y uno está mal escondido entre los otros nueve. Por eso este modo va **de la mano del flujo con Git** que veremos en la Sesión 4: la red de seguridad no es opcional, es lo que hace que este modo sea sensato en lugar de temerario.

---

## 7. El criterio de elección (la parte que de verdad importa)

No existe un modo "mejor". Existe el modo adecuado para cada tarea, y la decisión se reduce a **dos preguntas**:

1. **¿Cuánto cuesta si se equivoca?**
   Cuanto más caro el error → más control → Plan o default.
2. **¿Cuánto conozco yo este código?**
   Cuanto menos lo conozco → más quiero ver antes de que se aplique → Plan o default.

Una tabla para interiorizarlo:

| Situación | Modo recomendado |
|---|---|
| Refactor amplio, migración, o código desconocido | **plan** |
| Trabajo diario sobre código que dominas | **default** (ask) |
| Tareas mecánicas con Git limpio detrás | **acceptEdits** |
| Producción o zonas delicadas | **default**, revisando cada diff |

### El patrón que mejor funciona en la práctica

El modo **no es una configuración fija que pones una vez**. Lo cambias según avanza la tarea. El flujo más productivo suele ser:

```
1. Empiezas en PLAN.
   → Acuerdas el enfoque con Claude, ves qué va a tocar.

2. Apruebas el plan y bajas a DEFAULT o ACCEPTEDITS.
   → Ejecutas, con el nivel de supervisión que pida la criticidad.

3. Si surge algo inesperado, vuelves a PLAN.
   → Replanteas antes de seguir.
```

Plan para pensar, default/acceptEdits para ejecutar, y de vuelta a Plan cuando el terreno se complica. Ese vaivén con `Shift+Tab` es el ritmo natural de una sesión bien llevada.

---

## 8. Errores comunes con los modos

| Error | Consecuencia | Corrección |
|---|---|---|
| Empezar todo en acceptEdits "por ir rápido" | Cambios que no revisaste, difíciles de rastrear | Empieza en Plan, sé deliberado al subir la autonomía |
| Aprobar a ciegas en default | Ilusión de control, errores que se cuelan | Baja a un modo auto *con red de seguridad*, o afina permisos |
| Usar acceptEdits sin Git limpio | No puedes revertir un mal cambio | Nunca automatices sin red de seguridad |
| Intentar cambiar de modo pidiéndoselo en el chat | No funciona; el modo se controla aparte | Usa `Shift+Tab` o `--permission-mode` |
| Quedarse siempre en un solo modo | Demasiado lento o demasiado arriesgado | Cambia de modo según la fase de la tarea |

---

## 9. Ejercicios

### Ejercicio 1 — La misma tarea en tres modos
Sobre un repositorio de prueba (no de producción), haz la **misma tarea sencilla** —por ejemplo, añadir validación de entrada a una función— tres veces, una en cada modo. Fíjate en cómo cambia tu nivel de atención, de control y de velocidad. El objetivo es que salgas con una **intuición propia**, no con una regla memorizada.

### Ejercicio 2 — Cazar el momento de cambiar
Plantea una tarea de tamaño medio (algo que toque 3-4 archivos). Empieza en Plan, aprueba, y observa: ¿en algún momento te entran ganas de volver a Plan porque algo se complica? Practica el gesto de `Shift+Tab` para volver. Ese reflejo es lo que separa una sesión controlada de una que se te va de las manos.

### Ejercicio 3 — El experimento del aprobar a ciegas
Trabaja un rato en modo default con una tarea repetitiva y sé honesto contigo mismo: ¿cuántas veces le diste a "sí" sin leer de verdad el diff? Esa cifra es tu argumento personal para entender por qué los permisos finos (Sesión 4) existen.

---

## Resumen de la lección

- Claude Code es un **agente en tu terminal** que actúa sobre tu proyecto real, no un chat lateral. Trátalo como un júnior rápido que necesita supervisión.
- **No memorizamos la instalación**: cambia, ya está documentada, y no es donde está el valor. La hacemos en directo contra la doc oficial.
- Los tres modos principales son **plan** (solo propone), **default/ask** (pregunta antes de cada acción) y **acceptEdits** (edita solo). Se ciclan con `Shift+Tab`.
- **Plan** es tu punto de partida para todo lo no trivial: es el chain of thought hecho herramienta.
- **acceptEdits** solo es sensato con **red de seguridad** (Git limpio, tests).
- El criterio se reduce a dos preguntas: **cuánto cuesta el error** y **cuánto conoces el código**. Y el modo **se cambia sobre la marcha**, no se fija una vez.

> **Siguiente sesión:** vimos que el prompting tiene un límite —no le da a Claude conocimiento de *tu* proyecto— y que el modo correcto controla la autonomía. La Sesión 2 ataca justo ese hueco: cómo dar a Claude Code memoria persistente de tu proyecto con el archivo CLAUDE.md, las reglas y los comandos personalizados.

---

## Referencias

Documentación oficial de Anthropic (comprobada en junio de 2026). Permiten cotejar los nombres de los modos, los atajos y la configuración tratada en la lección.

1. **Visión general de Claude Code.** Qué es, cómo se instala (fuente que usaremos en directo en clase), capacidades y filosofía de herramienta agéntica en el terminal.
   <https://code.claude.com/docs/en/overview>

2. **Choose a permission mode (modos de permiso).** Referencia oficial de los modos reales: `default`, `acceptEdits`, `plan`, `auto` y `bypassPermissions`. Detalla el ciclo con `Shift+Tab`, el arranque con `--permission-mode`, y el ajuste de `defaultMode` en `.claude/settings.json`. Es la fuente que justifica la tabla de equivalencias del apartado 3.
   <https://code.claude.com/docs/en/permission-modes>

3. **Permissions (gestión de permisos).** Cómo afinar qué se aprueba y qué se pregunta, reglas `allow`/`deny`, y la relación entre permisos y *sandboxing*. Lo retomaremos a fondo en la Sesión 4.
   <https://code.claude.com/docs/en/permissions>

4. **Memory / CLAUDE.md.** Cómo Claude Code carga contexto persistente del proyecto. Es el puente directo a la Sesión 2.
   <https://code.claude.com/docs/en/memory>

> **Comprobar tu instalación en clase:** `claude --version` para ver la versión, `claude update` para actualizar. Los detalles de instalación por sistema operativo (permisos en macOS, Git for Windows, WSL) están en la referencia 1 y los resolvemos en directo.

> **Nota sobre las referencias.** Las URLs son estables, pero los nombres de modos y atajos pueden cambiar entre versiones de Claude Code. Si lo que ves en tu terminal difiere de estos apuntes, la documentación oficial y la propia herramienta mandan.
