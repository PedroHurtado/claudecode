# Fudie Design System

Sistema de diseño de **Fudie**, una app de pedidos y entrega de comida a domicilio (estética móvil, cálida y amigable). Este proyecto reconstruye y amplía la guía de estilos original (un conjunto de tokens CSS pensado para Angular) en un design system completo: tokens, componentes React reutilizables y un UI kit de la app.

> **Idioma de marca:** español (México). Toda la copy de producto se escribe en español.

---

## Fuentes / materiales recibidos

- **`styles/`** — carpeta CSS adjunta (montada vía File System Access API). Contenía únicamente *foundations*: `tokens/` (colors, typography, spaces, borders, shadows, elevations, transitions, controls, breakpoints), `base/` (reset, base, link) y `utilities/`. Pensada para cargarse globalmente en `angular.json → styles[]`, o vía `index.css` (barrel de `@import`s).
- **No se recibió:** logo oficial, imágenes/fotografía de producto, pantallas reales (Figma o código de la app), ni copy de marketing. Todo lo visual de marca y las pantallas del UI kit son **composiciones ilustrativas** construidas sobre los tokens — ver CAVEATS.

---

## Qué hay en este proyecto

| Ruta | Qué es |
|---|---|
| `styles.css` | Punto de entrada global (solo `@import`s). Los consumidores enlazan SOLO este archivo. |
| `tokens/` | Custom properties por concern: `colors`, `typography`, `spaces`, `borders`, `shadows`, `elevations`, `transitions`, `controls`, `breakpoints`. |
| `base/` | Reset moderno, estilos base globales, `.fudie-link`. |
| `utilities/` | Helpers globales (`.sr-only`, `.truncate`, `.skeleton`, animaciones de entrada). |
| `components/` | Primitivas React: `forms/` (Button, IconButton, Input, Switch, Checkbox), `feedback/` (Badge, Toast, Spinner), `display/` (Card, Avatar), `navigation/` (Tabs). |
| `ui_kits/fudie-app/` | Recreación ilustrativa de la app móvil: home → menú → checkout → tracking. |
| `guidelines/` | Tarjetas-espécimen (color, tipo, espaciado, marca) para la pestaña Design System. |
| `SKILL.md` | Manifiesto para usar este sistema como Agent Skill. |

---

## CONTENT FUNDAMENTALS

Cómo se escribe la copy de Fudie.

- **Idioma:** español neutro de México. Cercano pero no coloquial en exceso.
- **Persona / tono:** amigable, directo, con energía. Habla **de tú** al usuario ("Pide en minutos", "Tu pedido va en camino", "Volver al inicio").
- **Casing:** *Sentence case* en todo — títulos, botones, etiquetas. NUNCA Title Case ni MAYÚSCULAS (salvo overlines/etiquetas de tarjeta-espécimen, que sí usan `text-transform: uppercase` + `letter-spacing` ancho como recurso tipográfico, no de redacción).
- **Botones:** verbo de acción + objeto, conciso. "Hacer pedido", "Ver menú", "Pagar $182", "Repetir pedido". El CTA principal suele incluir el monto o el conteo ("Ver carrito · 2 items").
- **Estados y feedback:** breves y humanos. "Pedido confirmado", "El restaurante lo está preparando", "Carlos lo lleva en moto". Los tiempos se dan en rangos ("18–24 min", "20–30 min").
- **Números:** precios con `$` y, si aplica, moneda (`$128.00 MXN`); IDs y montos pueden ir en `--font-mono` (`#PED-4821`). Calificaciones con estrella + decimal ("★ 4.7").
- **Emoji:** uso **muy puntual** y solo decorativo en mensajes promocionales/de celebración (ej. "🎉 -20% en tu primer pedido"). No en navegación, botones ni labels. No es un sistema de iconografía — para eso, SVG (ver ICONOGRAPHY).
- **Vibe:** apetitoso y eficiente. La comida es la protagonista; el texto acompaña, no compite.

---

## VISUAL FOUNDATIONS

- **Color · marca:** el rojo `--color-primary #DF2F3A` es el corazón del sistema (acción, marca, estados activos). `primary-dark #C8323D` para hover/press; `primary-light #FF7880` solo decorativo (NO texto encima); `primary-subtle #FFF0F1` para fondos tenues y chips. Los CTAs principales son rojos sólidos con texto blanco.
- **Color · semánticos:** cinco familias completas (`success` verde, `warning` ámbar, `error` rojo, `info` azul, `service` morado), cada una con `base` (sobre blanco, ≥4.5:1), `dark`, `subtle` (fondo) y `text` (texto sobre subtle). `warning` se usa SOLO con texto oscuro (`--color-warning-on`). El sistema está **construido alrededor de la accesibilidad** — cada color documenta su ratio de contraste.
- **Color · neutrales:** escala `gray-50 → gray-900` (paleta tipo Tailwind). Fondo de app `--color-bg` = `gray-50`; superficies `--color-surface` = blanco. Texto `gray-900`, secundario `#656C79`.
- **Tipografía:** **Plus Jakarta Sans** (geométrica humanista, redonda y amigable), pesos 400–800. Mono = stack del sistema (`ui-monospace`) para precios/IDs. Escala fluida con `clamp()` de `xs (12px)` a `4xl (28–36px)`. Títulos en **extrabold/bold** con `tracking-tight` (-0.025em); cuerpo a 16px con `leading-relaxed`. Los `h*` traen `text-wrap: balance`.
- **Espaciado:** escala en **múltiplos de 4px** (`space-1 … space-24`) con aliases semánticos (`space-md`, `space-lg`…). `--card-padding` = 24px. Layout máx `--container-max` 75rem.
- **Radios (clave de la marca):** todo es **redondeado y suave**. `sm 6px` (tags/badges), `md 12px` (inputs, botones), `lg 16px` (cards, botones), `xl 20px` (modales), `2xl 24px` (cards grandes), `full` (pills, avatares, chips de categoría). Los botones usan `radius-md`; los chips de filtro y badges son `full`.
- **Sombras:** escala sutil y difusa, de baja opacidad (0.05–0.08), nunca dura. `shadow-card` = `sm`; `shadow-modal` = `2xl`. La elevación comunica jerarquía, no dramatismo. Hay sombras de **foco** dedicadas por color (`shadow-focus-primary`, `-error`, etc.) para accesibilidad.
- **Bordes:** finos (1px) `--color-border` (`gray-200`); fuertes `gray-300`. El borde primario/error es 2px. Las cards combinan borde fino + sombra `sm`.
- **Fondos / imágenes:** fondo de app neutro (`gray-50`). La fotografía de comida es full-bleed dentro de las cards (parte superior), con esquinas heredando el radio de la card. *No se recibió fotografía real* — el UI kit usa placeholders con degradados cálidos por categoría (durazno, tomate, matcha…). Sin texturas ni patrones repetidos.
- **Gradientes:** NO se usan gradientes de marca en UI (nada de morado-azul). Los únicos degradados son los placeholders de imagen (cálidos, suaves) y el `.skeleton` de carga.
- **Animación:** discreta y funcional. Duraciones `fast 100ms → slower 500ms`; easing por defecto material `cubic-bezier(0.4,0,0.2,1)`. Hay `--ease-bounce` y `--ease-spring` reservados para microinteracciones (ej. el knob del Switch usa spring). Animaciones de entrada `fade-in` / `slide-up` (8px). Respeta `prefers-reduced-motion`.
- **Hover:** los rellenos sólidos oscurecen (`primary → primary-dark`); los ghost/secondary ganan un fondo `gray-100`/`gray-50`. Las cards interactivas hacen *lift* (`translateY(-2px)` + sombra `lg`).
- **Press / active:** los botones encogen levemente (`scale(0.97)`).
- **Foco:** `:focus-visible` con `box-shadow` de doble anillo (`--shadow-focus`) — sin outline por defecto, accesible en alto contraste.
- **Transparencia / blur:** mínima. `--color-backdrop` = `rgb(0 0 0 / 0.4)` para overlays de modal. No hay glassmorphism.
- **Cards:** blanco, borde fino + `shadow-sm`, radio `lg/2xl`, padding 24px. Es el contenedor base de todo: tiles de restaurante, resúmenes de pedido, modales.

---

## ICONOGRAPHY

- **Sistema:** la guía original **no incluía** un set de iconos ni un icon-font. Los iconos de este design system son **SVG inline de trazo** (`stroke`, `stroke-width: 2`, `stroke-linecap/linejoin: round`, grid 24px) — un estilo equivalente a **Lucide / Feather**, coherente con la calidez redondeada de la marca.
- **Recomendación:** adoptar **[Lucide](https://lucide.dev)** como set oficial (mismo peso y estilo redondeado). Es CDN-instalable y casa con los SVG ya usados en componentes (`Toast`, `Checkbox`, `Spinner`) y en el UI kit (`screens.jsx → Ic`).
- **Color:** los iconos heredan `currentColor`; en estado por defecto van en `--color-text-secondary`, activos en `--color-primary`.
- **Emoji:** solo decorativo y puntual en copy promocional (ver CONTENT FUNDAMENTALS). No como iconografía funcional.
- **Sin assets binarios:** no se copiaron PNG/SVG de marca porque no se recibió ninguno. Cuando existan (logo, pin de mapa, ilustraciones vacías), van en `assets/`.

---

## CAVEATS / sustituciones

1. **Fuente:** Plus Jakarta Sans se carga aquí desde **Google Fonts CDN** (no self-hosted). El original usa `.woff2` self-hosted en `/fonts/` (GDPR-safe). Para producción, sube los `.woff2` y restituye las reglas `@font-face`. La pestaña indica "Fonts: none" por esto.
2. **Logo:** no existe logo oficial. La tarjeta *Brand · Logotype* es una **marca tipográfica provisional** (Plus Jakarta Extrabold + rojo). Reemplazar con la marca real.
3. **Imágenes:** sin fotografía de producto. El UI kit usa placeholders con degradado por categoría.
4. **UI kit:** la app es una **recreación ilustrativa** sobre los tokens, no una copia de pantallas reales (no se recibieron). Si compartes Figma o el código de la app, la ajusto a la realidad.

---

## Índice del proyecto (manifest)

**Raíz:** `styles.css` · `readme.md` · `SKILL.md`
**Tokens:** `tokens/{colors,typography,spaces,borders,shadows,elevations,transitions,controls,breakpoints}.css`
**Base:** `base/{reset,base,link}.css` · **Utilities:** `utilities/util.css`
**Componentes:**
- `components/forms/` — `Button`, `IconButton`, `Input`, `Switch`, `Checkbox`
- `components/feedback/` — `Badge`, `Toast`, `Spinner`
- `components/display/` — `Card`, `Avatar`
- `components/navigation/` — `Tabs`

**UI kit:** `ui_kits/fudie-app/` — `index.html` (app interactiva), `screens.jsx`, `README.md`
**Tarjetas-espécimen:** `guidelines/*.card.html` (Colors, Type, Spacing, Brand)
