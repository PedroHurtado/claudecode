# Sesión 4 · Lección 2 — Flujo de trabajo con Git

> **Dónde estamos.** La lección anterior cerró con una idea: trabajar por tareas acotadas y, cuando hace falta, en paralelo. Eso solo es viable si Git no se convierte en un cuello de botella. Esta lección cubre cómo Claude Code trabaja con Git —commits, revisión, PRs, conflictos— y la pieza que hace posible el paralelismo real: los *worktrees*.

---

## 1. Commits y revisión de cambios

Claude Code entiende Git de forma nativa. Le puedes pedir el flujo completo en lenguaje natural: "revisa lo que hemos cambiado, haz un commit con un mensaje convencional, y enséñame el diff antes". Pero el valor no está en que sepa ejecutar `git`; está en el **criterio de cómo lo encajas en tu trabajo**.

### El flujo "Explore, Plan, Code, Commit"

Es la práctica fundacional que conviene tener como esqueleto mental, y conecta con todo lo que vimos en sesiones anteriores:

1. **Explore:** Claude explora el código relevante (aquí encaja el subagente Explore de la Sesión 3, que mantiene la lectura fuera de tu contexto).
2. **Plan:** le pides un plan paso a paso antes de tocar nada (el modo Plan de la Sesión 1).
3. **Code:** implementa.
4. **Commit:** revisa los cambios y comitea.

### Revisar antes de comitear: `/diff` y la disciplina del checkpoint

La regla de oro del trabajo con IA y Git: **revisa el diff antes de comitear.** Claude escribe código correcto la mayoría de las veces, pero "la mayoría" no es "siempre", y un commit es justo el punto donde quieres cazar el error antes de que se propague.

Una buena costumbre es usar el commit como *checkpoint*: tras una serie de ediciones, revisa el diff (`git diff`, o `/diff` que abre un visor interactivo de todos los cambios que Claude ha hecho), y solo entonces comitea. Es tu oportunidad de cazar fallos antes de que se acumulen.

### Mensajes de commit con un comando

Aquí se cierra un círculo de la Sesión 2: el comando `/commit` que construiste —el que embebía `git diff --cached` con `!` y redactaba el mensaje a partir del diff real— es exactamente la herramienta para esto. Lo retomamos ahora con su contexto completo: un commit bien hecho parte del diff real, no de lo que el modelo *cree* que cambió.

---

## 2. Pull requests y resolución de conflictos

### Pull requests

Claude Code puede generar el PR completo: analiza todos los commits de la rama, redacta título y descripción, y lo abre. Con un servidor MCP de GitHub conectado (lo viste en la Sesión 3) puedes ir más allá: "revisa el PR #456 y sugiere mejoras", "abre una issue para este bug", todo sin salir del terminal.

El patrón típico de una rama de feature, sea trabajo tuyo o de un worktree (siguiente sección):

```bash
git push -u origin feature/pagos
gh pr create --title "Añadir integración de pagos con Stripe" --base main
```

> **Criterio, no automatismo.** Que Claude pueda redactar el PR no significa que debas aceptarlo a ciegas. El PR es el artefacto que otra persona va a revisar; su descripción tiene que reflejar de verdad qué cambia y por qué. Trata la redacción de Claude como un borrador muy bueno que tú validas, igual que harías con el diff.

### Resolución de conflictos

Cuando dos ramas tocan lo mismo, hay conflicto de merge. Claude puede ayudarte a resolverlos: entiende el contexto de ambos lados y propone la fusión. Pero aquí la cautela es mayor que en un commit normal, porque un conflicto mal resuelto puede mezclar de forma sutil dos intenciones distintas. La práctica sana: que Claude proponga la resolución, pero que **tú revises el resultado** antes de cerrarlo, leyendo qué se quedó de cada lado.

La mejor resolución de conflictos, de todas formas, es **prevenirlos**, y eso nos lleva directos a los worktrees.

---

## 3. Worktrees para sesiones en paralelo

### 3.1. El problema que resuelven

Imagina la escena: tienes a Claude refactorizando el middleware de autenticación y entra un bug crítico que hay que arreglar ya. En un mundo sin worktrees, tus opciones son malas: o haces `git stash` de trabajo a medias y pierdes contexto, o abres otro terminal, **clonas el repo otra vez**, reinstalas dependencias y arrancas una sesión nueva desde cero. En ambos casos pierdes diez minutos y el hilo.

Y el problema de fondo es peor si intentas correr varias sesiones de Claude apuntando al **mismo directorio**: dos agentes editando el mismo fichero a la vez producen salida corrupta o se pisan los cambios; comparten estado y hacen asunciones incorrectas sobre lo que el otro está haciendo. Clonar el repo entero por cada tarea paralela tampoco escala: un repo con historia, assets y dependencias puede pesar varios gigas, y pagas ese coste cada vez.

### 3.2. Qué es un worktree

Un **git worktree** es un directorio de trabajo separado, con sus propios ficheros y su propia rama, que **comparte la misma historia y el mismo remoto** que tu checkout principal. En vez de una carpeta con tu repo, tienes varias, cada una en su rama, todas apuntando a la misma base de datos de Git por debajo:

```
mi-proyecto/            ← worktree principal (rama main)
mi-proyecto-pagos/      ← worktree enlazado (feature/pagos)
mi-proyecto-refactor/   ← worktree enlazado (feature/refactor)
```

Cada directorio es totalmente independiente en cuanto a ficheros en disco, pero no duplican la historia de Git. Correr cada sesión de Claude Code en su propio worktree significa que **las ediciones de una sesión nunca tocan los ficheros de otra**: puedes tener a Claude construyendo una feature en un terminal mientras arreglas un bug en un segundo, sin interferencia y sin riesgo de pisarse.

### 3.3. Cómo se usan en Claude Code

Claude Code tiene soporte nativo. La forma rápida:

```bash
# Terminal 1: una sesión aislada en su worktree y su rama
claude --worktree feature-pagos     # (o la forma corta: claude -w feature-pagos)

# Terminal 2: otra tarea, otro worktree, en paralelo
claude -w bugfix-auth
```

Claude crea un worktree aislado bajo `.claude/worktrees/`, hace checkout de una rama nueva ahí, y arranca una sesión acotada a ese directorio. Tu working tree principal queda intacto. Mientras Claude trabaja en un worktree, tú puedes estar **revisando** lo que terminó en otro: no esperas, diriges.

También puedes pedírselo en lenguaje natural durante una sesión ("trabaja en un worktree") y Claude lo crea con su herramienta interna.

> **Detalles que ahorran disgustos:**
> - **Añade `.claude/worktrees/` a tu `.gitignore`** para que el contenido de los worktrees no aparezca como ficheros sin seguir en tu checkout principal.
> - Los worktrees **parten de la rama por defecto del repo** (`origin/HEAD`), así que arrancan de un árbol limpio que coincide con el remoto. Si la feature A necesita las migraciones de la feature B, **no las corras en paralelo**: por defecto cada worktree parte del remoto limpio y no ve los cambios del otro. Construye la dependencia, mergéala, y entonces empieza la otra.
> - **Limpieza:** los worktrees que creas con `--worktree` interactivo te preguntan al salir si quieres conservarlos o borrarlos. Pero los creados en modo no interactivo (con `-p`, que verás en la lección de automatización) **no se limpian solos**; los quitas con `git worktree remove`.
> - Cada worktree puede necesitar su propia config de entorno (su `.env`, sus puertos). Para copiar ficheros automáticamente al crear un worktree, usa un fichero `.worktreeinclude` en la raíz (sintaxis de `.gitignore`).

### 3.4. Conexión con los subagentes

Un puente con la Sesión 3: los subagentes también pueden correr en su propio worktree para que sus ediciones en paralelo no choquen. Le pides a Claude que "use worktrees para sus agentes", o lo fijas en un subagente personalizado añadiendo `isolation: worktree` a su frontmatter. Cada subagente recibe un worktree temporal que se elimina solo cuando termina sin cambios. Es la combinación que permite paralelismo real sin colisiones.

---

## 4. Cuándo el paralelismo ayuda y cuándo estorba

Como con los subagentes, paralelizar a lo loco es un antipatrón. Los worktrees brillan cuando:

- Tienes **features independientes** que se pueden desarrollar a la vez sin depender unas de otras.
- Quieres seguir tu propio trabajo en un worktree mientras Claude corre una tarea larga en otro.
- Necesitas atender un bug urgente sin destruir el contexto de lo que estabas haciendo.

Y estorban cuando las tareas **dependen entre sí** (por el tema de la rama base limpia que vimos), o cuando son tan pequeñas que el overhead de montar y limpiar worktrees no compensa frente a hacerlas en secuencia.

---

## Ejercicio

1. Desde un repo con git, crea dos worktrees con `claude -w <nombre>` en dos terminales y asígnales tareas **independientes**. Comprueba que cada sesión solo ve sus propios ficheros y que no se pisan.
2. En uno de los worktrees, lleva la feature hasta el PR: `git push` y `gh pr create`. Revisa el diff con `/diff` antes de comitear y valida la descripción del PR que redacta Claude.
3. Provoca a propósito una dependencia entre dos worktrees (la feature A necesita algo de la B) y observa que, al partir de la rama base limpia, A no ve los cambios de B. Resuélvelo con el orden correcto: construir B, mergear, empezar A.

El objetivo es sentir la diferencia entre trabajo serializado (una tarea cada vez) y trabajo paralelo aislado (varias sesiones que no se tocan), y saber cuándo cada uno.

---

## Referencias

Documentación oficial de Anthropic (comprobada en junio de 2026). Las URLs son estables, pero el contenido se actualiza con frecuencia; si algún detalle difiere de lo que veas en pantalla, la fuente oficial manda.

1. **Run parallel sessions with worktrees (Claude Code).** Referencia oficial: el flag `--worktree`/`-w`, la ubicación en `.claude/worktrees/`, la rama base, `.worktreeinclude`, el aislamiento de subagentes (`isolation: worktree`) y la limpieza.
   <https://code.claude.com/docs/en/worktrees>

2. **Claude Code best practices** (blog de ingeniería de Anthropic). El flujo "Explore, Plan, Code, Commit" y las buenas prácticas de trabajo con Git asistido.
   <https://www.anthropic.com/engineering/claude-code-best-practices>

> **Comprobar en clase:** `claude -w <nombre>` para abrir un worktree, `git worktree list` para ver los activos, `/diff` para revisar cambios antes de comitear, y `gh pr create` para abrir el PR. Recuerda añadir `.claude/worktrees/` al `.gitignore`.

> **Siguiente lección:** ya sabes versionar y paralelizar. Falta asegurar que lo que se produce funciona: testing y TDD asistido por IA, el ciclo test-implementación-refactor, y cómo verificar cobertura y resultados sin fiarte solo de que "parece que va".
