# Sesión 4 · Lección 3 — Testing y TDD asistido

> **Dónde estamos.** Ya sabes dar contexto, paralelizar y versionar. Pero todo eso produce código, y código sin verificar es una promesa, no un hecho. Esta lección trata cómo usar Claude Code para que el testing no sea un añadido al final, sino el motor que guía la implementación y verifica que lo que produce de verdad funciona.

---

## 1. Por qué el testing importa especialmente con IA

Con un asistente que genera código rápido, el riesgo no es escribir poco código: es escribir código que *parece* correcto. Claude produce implementaciones plausibles, bien estructuradas, que compilan... y que a veces hacen lo que el modelo *creyó* que querías, no lo que querías. El test es lo que cierra esa brecha entre "parece que va" y "va".

Esto enlaza con algo de la Sesión 1: el problema de verificación. Cuanto más autónomo es el agente, más importa tener una forma **objetiva** de comprobar su trabajo. Un test que pasa es esa forma objetiva. Por eso el testing no es un bloque más del temario: es la red de seguridad que hace que confiar en el código generado sea razonable.

---

## 2. El ciclo test-implementación-refactor con IA

El patrón clásico de TDD (Test-Driven Development) se adapta especialmente bien al trabajo con Claude Code, y de una forma que resuelve justo el problema anterior. El ciclo:

**1. Test (rojo).** Primero escribes —o le pides a Claude que escriba— los tests que definen el comportamiento deseado, **antes** de la implementación. Los tests fallan, porque aún no hay código. Esto es clave: defines el "qué debe hacer" de forma ejecutable y sin ambigüedad.

**2. Implementación (verde).** Ahora le pides a Claude que implemente hasta que los tests pasen. Y aquí está la ganancia con IA: **Claude tiene un objetivo objetivo y verificable.** No implementa "lo que cree"; implementa hasta que una señal externa (los tests en verde) confirma que acertó. El test acota la libertad del modelo.

**3. Refactor.** Con los tests en verde como red, refactorizas para mejorar el código sin miedo: si un cambio rompe algo, los tests te avisan al instante.

> **Por qué este orden importa con un agente.** Si dejas que Claude implemente *y luego* escriba los tests, hay un riesgo sutil: tiende a escribir tests que pasan con la implementación que ya hizo, en vez de tests que comprueban el comportamiento correcto. El test se amolda al código en vez de juzgarlo. Escribir el test *primero* —o al menos revisarlo con ojo crítico antes de implementar— evita que el examen lo escriba el propio examinado.

### Un guardarraíl práctico

Recuerda el comando `/test` que montaste en la Sesión 2 y la skill en que lo convertiste en la Sesión 3. Su instrucción incluía: detectar el framework que ya usa el proyecto (no introducir otro), cubrir el camino feliz, los casos límite y el manejo de errores, usar las factorías de datos del proyecto, y **ejecutar la suite y verificar que los nuevos tests pasan**. Ese último paso es el que convierte la generación de tests en algo fiable: Claude no solo escribe el test, lo *corre* y confirma.

Un patrón potente para el ciclo completo: pídele a Claude que implemente, y deja que **un hook `PostToolUse`** (Sesión 3) ejecute la suite tras cada edición. Así obtienes feedback inmediato de si el cambio rompió algo, sin esperar a una ejecución manual ni a CI.

---

## 3. Cobertura y verificación de resultados

Generar tests no basta; hay que saber si **cubren lo que importa**. Dos cautelas:

**La cobertura es una métrica necesaria pero engañosa.** Un 90% de cobertura te dice que el 90% de las líneas se ejecutan en algún test, no que el comportamiento sea correcto. Es fácil tener mucha cobertura con tests que no comprueban nada útil (que ejecutan el código pero no afirman gran cosa sobre el resultado). Le puedes pedir a Claude que analice la cobertura y señale las zonas sin cubrir, pero el juicio de *qué* merece un test es tuyo: los caminos de error, los casos límite, la lógica de negocio crítica.

**Verifica los resultados, no te fíes del "verde".** Un subagente (Sesión 3) es ideal aquí: "lanza la suite de tests y devuélveme solo los que fallan con su mensaje de error". El subagente absorbe el ruido de la salida completa en su contexto y te trae lo accionable. Pero el paso de leer *por qué* falla algo y decidir si el test o la implementación es lo incorrecto sigue siendo criterio humano.

> **El antipatrón a evitar:** pedirle a Claude "haz que los tests pasen" sin mirar cómo. Un modelo presionado por ese objetivo puede "arreglar" un test cambiándolo para que deje de comprobar lo que fallaba, en vez de arreglar el código. Si delegas el ciclo, revisa qué se modificó: ¿arregló la implementación, o ablandó el test? Esto es exactamente por qué el comando `/fix` de la Sesión 2 llevaba el guardarraíl "localiza la causa raíz LEYENDO el código antes de proponer nada".

---

## Ejercicio

1. Elige una función pequeña sin implementar. Pídele a Claude que escriba **primero** los tests (camino feliz, casos límite, errores), revísalos con ojo crítico, y solo entonces pídele la implementación hasta que pasen. Observa cómo el test acota lo que hace.
2. Añade un hook `PostToolUse` que ejecute la suite tras cada edición. Haz un cambio que rompa algo y comprueba que el feedback es inmediato.
3. Pide la cobertura y, en vez de perseguir el número, identifica un camino de error sin cubrir y escribe el test que falta. Reflexiona: ¿el número subió mucho o poco? ¿Importa?

El objetivo es usar el testing como el motor que dirige y verifica el trabajo de Claude, no como un trámite posterior.

---

## Referencias

Documentación oficial de Anthropic (comprobada en junio de 2026). Las URLs son estables, pero el contenido se actualiza con frecuencia; si algún detalle difiere de lo que veas en pantalla, la fuente oficial manda.

1. **Claude Code best practices** (blog de ingeniería de Anthropic). El flujo de trabajo asistido, incluido el patrón de escribir tests primero y dejar que Claude itere contra ellos como objetivo verificable.
   <https://www.anthropic.com/engineering/claude-code-best-practices>

2. **Hooks reference (Claude Code).** Para el patrón de `PostToolUse` que ejecuta la suite de tests tras cada edición y da feedback inmediato.
   <https://code.claude.com/docs/en/hooks>

> **Siguiente lección:** el ciclo de testing que acabamos de ver, ejecutado por una máquina sin nadie delante, es justo lo que habilita la **automatización**: el modo headless y la integración en pipelines de CI. Es la última pieza técnica antes del bloque de seguridad y el criterio final.
