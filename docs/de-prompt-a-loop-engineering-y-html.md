# De Prompt Engineering a Loop Engineering + La efectividad irrazonable del HTML

> Material de referencia para el curso *Claude Code para desarrollo de software*.
> Reúne (1) la genealogía de las cuatro capas de ingeniería de IA y (2) el resumen del artículo de Anthropic sobre por qué el equipo de Claude Code prefiere HTML a Markdown.

---

## Parte 1 — La escalera: de Prompt a Loop Engineering

Cuatro capas que se **envuelven** unas a otras sin reemplazarse. Cada nivel sube la unidad de esfuerzo humano: de las palabras → al contexto → al entorno → al ciclo.

| Capa | Fecha | Qué diseñas | Pregunta central | Dónde vive el fallo |
|------|-------|-------------|------------------|---------------------|
| **Prompt engineering** | 2022–2024 | Las palabras | "¿Qué escribo?" | Redacción de la instrucción |
| **Context engineering** | 2025 | Lo que el modelo ve | "¿Qué información le doy?" | Información que recibe el modelo |
| **Harness engineering** | Principios 2026 | El entorno del agente | "¿En qué entorno corre?" | Fiabilidad en producción |
| **Loop engineering** | Junio 2026 | El ciclo que lo conduce | "¿Qué bucle lo ejecuta solo?" | Cadencia / autonomía |

### 1. Prompt engineering (≈2022–2024)
- El concepto de "prompt engineer" empezó a discutirse ampliamente en 2022, con el lanzamiento de ChatGPT.
- Foco: las palabras. Unidad de trabajo = una sola llamada a la API. Si fallaba, reescribías el prompt.
- Técnicas / tipos:
  - **Zero-shot** — instrucción directa sin ejemplos.
  - **Few-shot** — incluir ejemplos para fijar formato y comportamiento.
  - **Chain-of-thought (CoT)** — aparecida en 2023; descompone problemas en pasos lógicos.
  - **Roles / personas** — asignar un papel ("actúa como…").
  - **Delimitadores y plantillas** — estructurar la entrada.
- Techo: un prompt perfecto no puede aportar hechos que el modelo nunca recibió.

### 2. Context engineering (≈2025)
- Término popularizado en junio de 2025, sobre todo por Andrej Karpathy: "el arte y la ciencia de llenar la ventana de contexto con la información justa para el siguiente paso". Tobi Lütke (Shopify) y Simon Willison también moldearon el uso temprano.
- Foco: todo lo que el modelo ve en inferencia — historial, documentos recuperados (RAG), salidas de herramientas, estado del agente.
- Mecanismos: RAG, gestión de memoria, compactación de contexto, recuperación dinámica.

### 3. Harness engineering (principios de 2026)
- Modela el **entorno completo** del agente: herramientas, memoria, restricciones y bucles de retroalimentación.
- Es donde aparece la fiabilidad en producción que el prompting y el contexto no resolvían.
- Ejemplo citado: LangChain pasó de fuera del ranking (~puesto 30) al top 5 de Terminal-Bench cambiando solo el harness (+13,7 puntos: 52,8% → 66,5%).

### 4. Loop engineering (junio 2026)
- En la 2ª semana de junio de 2026 cuajó la idea: deja de prompts a tu agente de código y diseña el **bucle** que lo prompted por ti. Un post superó los 6,5 M de vistas en días.
- Construyes un pequeño sistema que encuentra el trabajo, lo reparte, lo verifica, registra lo hecho/pendiente y empuja a los agentes en tu lugar.
- Un loop es un **objetivo recursivo**: defines un propósito y la IA itera hasta completarlo.
- Comandos `/loop` (repetir en cadencia) y `/goal` (con condición de parada verificable). El prompt ahora vive dentro del bucle.
- Posición: un piso por encima del harness, ejecutándolo en cadencia, generando sub-agentes y añadiendo worktrees, skills, connectors y memoria externa.

> **Conexión con el curso:** loop engineering formaliza el flujo autónomo de la Sesión 4 (sesiones largas, worktrees, headless/CI).

---

## Parte 2 — La efectividad irrazonable del HTML

Artículo de **Thariq Shihipar** (member of technical staff, Anthropic), publicado el **20 de mayo de 2026**.
Fuente: https://claude.com/blog/using-claude-code-the-unreasonable-effectiveness-of-html

**Tesis:** Markdown es el formato dominante para que los agentes se comuniquen con humanos, pero a medida que los agentes producen specs y planes cada vez mayores, Markdown se queda corto. El autor (y cada vez más miembros del equipo de Claude Code) prefiere **HTML** como formato de salida.

### Por qué HTML en lugar de Markdown
- **Densidad de información** — HTML representa casi cualquier información de forma eficiente: tablas, CSS, ilustraciones SVG, snippets de código, interacciones con JS+CSS, flujos de trabajo, datos espaciales (posiciones absolutas/canvas), imágenes. Sin esto, el modelo recurre a soluciones pobres como diagramas ASCII o estimar colores con unicode.
- **Claridad visual y lectura** — el autor reconoce que no suele leer un Markdown de más de 100 líneas, y menos consigue que otros lo lean. El HTML se organiza visualmente (pestañas, ilustraciones, enlaces) y puede ser responsive.
- **Facilidad para compartir** — los navegadores no renderizan bien Markdown; con HTML basta subir el archivo y compartir el enlace. Sube la probabilidad de que alguien lea tu spec/PR/informe.
- **Interacción bidireccional** — puedes pedir sliders/knobs para ajustar diseños o algoritmos y un botón para copiar los cambios de vuelta a un prompt.
- **Ingesta de datos** — la gran ventaja de Claude Code (frente a Claude.ai o Claude Design) es el contexto que ingiere: sistema de archivos, MCPs (Slack, Linear…), navegador (Claude in Chrome) e historial de git.

### Cómo empezar
- No hace falta nada especial: basta con pedir *"make an HTML file"* o *"make an HTML artifact"*.
- Lo importante es saber qué quieres que haga el artefacto. Con el tiempo, conviene crear una **skill** para patrones recurrentes.

### Casos de uso (cuándo HTML > Markdown)
1. **Specs, planificación y exploración** — una "telaraña" de archivos HTML: brainstorming, mockups, plan de implementación. Se reutilizan como referencia y en verificación.
2. **Revisión y comprensión de código** — renderizar diffs, anotaciones, flowcharts y módulos. Para crear/revisar un PR o entender un tema del código.
3. **Diseño y prototipos** — HTML es muy expresivo para diseño aunque tu superficie final sea React/Swift. Prototipar animaciones, sliders, knobs.
4. **Informes, investigación y aprendizaje** — sintetizar Slack/codebase/git/web en un documento HTML, explicador interactivo o slideshow, con diagramas SVG.
5. **Interfaces de edición a medida** — un editor desechable de un solo archivo HTML para una pieza concreta de datos; clave: terminar siempre con un export ("copy as JSON" / "copy as prompt"). Útil para reordenar tickets, editar config (feature flags), tunear prompts, curar datasets, anotar diffs, elegir valores difíciles de describir (colores, curvas de easing, cron, regex).

### FAQ del artículo
- **¿No es menos eficiente?** Markdown usa menos tokens, pero la expresividad del HTML y la mayor probabilidad de leerlo dan mejor resultado global. Con la ventana de 1 M de Opus 4.7 el coste extra es inapreciable.
- **¿Cuándo Markdown?** El autor casi ha dejado de usarlo (admite ser maximalista del HTML).
- **¿Sustituye a planificar?** En vez de un único plan, varios archivos HTML por etapas/partes, que se conservan como referencia y para verificación.

### La idea de fondo: "staying in the loop"
La razón real para usar HTML es sentirse **más dentro del bucle** con Claude. A medida que Claude asume más trabajo, el autor leía los planes con menos atención; el HTML le devuelve el engagement con las decisiones del modelo en lugar de delegarlas a ciegas.

> Nota de conexión: este "staying in the loop" enlaza directamente con la Parte 1 — es la motivación humana detrás del salto hacia loop engineering.

---

## Referencias

1. **Using Claude Code: The unreasonable effectiveness of HTML** — Anthropic / Claude blog (Thariq Shihipar), 20 may 2026. https://claude.com/blog/using-claude-code-the-unreasonable-effectiveness-of-html
2. **Plantillas y galería de casos de uso HTML** — https://thariqs.github.io/html-effectiveness/ · https://github.com/anthropics/html-effectiveness
3. **What Is Loop Engineering? A Complete Guide** — Tosea.ai, jun 2026. https://tosea.ai/blog/loop-engineering-ai-agents-complete-guide-2026
4. **Prompt vs Context vs Harness Engineering** — Atlan, abr 2026. https://atlan.com/know/harness-engineering-vs-prompt-engineering/
5. **The Evolution of Prompt Engineering to Context Design in 2026** — SDG Group, mar 2026. https://www.sdggroup.com/en/insights/blog/the-evolution-of-prompt-engineering-to-context-design-in-2026
6. **A Survey of Context Engineering for Large Language Models** — arXiv 2507.13334. https://arxiv.org/pdf/2507.13334
