# MCP didáctico 🧩

Servidor **MCP (Model Context Protocol)** de ejemplo para la clase de **Claude Code**.
Muestra las tres capacidades que puede exponer un servidor MCP, con código muy comentado.

| Capacidad     | Qué es                                   | Ejemplo en este servidor            |
| ------------- | ---------------------------------------- | ----------------------------------- |
| **Tools**     | Funciones que el modelo **invoca**       | `saludar`, `calcular_iva`, `consultar_clima` (API real) |
| **Resources** | Datos que el cliente **lee** (read-only) | `notas://curso`, `alumno://{id}/perfil` |
| **Prompts**   | Plantillas de conversación reutilizables | `revisar-codigo`                    |

> 📄 Explicación completa (qué y por qué, con diagramas): [`docs/mcp-servidor-didactico.md`](../docs/mcp-servidor-didactico.md)

---

## 1. Requisitos

- Node.js 18+ (recomendado 20+)
- Claude Code

## 2. Instalar y compilar

```bash
cd mcp-didactico
npm install
npm run build
```

Esto genera `build/server.js`.

Durante el desarrollo puedes evitar compilar cada vez con:

```bash
npm run dev      # ejecuta src/server.ts directamente con tsx
```

## 3. Probarlo con el MCP Inspector (recomendado en clase)

El [Inspector](https://github.com/modelcontextprotocol/inspector) es una UI web
para explorar el servidor sin Claude: ver sus tools, invocarlas, leer recursos...

```bash
npm run inspector
```

Se abrirá una interfaz donde podrás lanzar `saludar`, `calcular_iva`, leer
`notas://curso`, etc. Ideal para enseñar el protocolo "en vivo".

## 4. Registrarlo en Claude Code

### Opción A — comando (rápido)

```bash
claude mcp add mcp-didactico -- node "ruta/absoluta/a/mcp-didactico/build/server.js"
```

### Opción B — fichero `.mcp.json` (compartible con la clase) ✅ ya incluido

Ya hay un [`.mcp.json`](../.mcp.json) listo en la raíz del proyecto con ruta
**relativa**, así que la clase solo tiene que abrir Claude Code en esa carpeta:

```json
{
  "mcpServers": {
    "mcp-didactico": {
      "command": "node",
      "args": ["mcp-didactico/build/server.js"]
    }
  }
}
```

> La ruta es relativa a la raíz del proyecto. Si mueves el servidor a otro sitio,
> usa una ruta absoluta (en Windows: `C:/Users/tu-usuario/.../build/server.js`).

Comprueba que Claude Code lo detecta:

```bash
claude mcp list
```

## 5. Usarlo dentro de Claude Code

- **Tools**: pídele *"usa la herramienta calcular_iva con base 100"* y verá el resultado.
- **Resources**: puedes referenciar `@mcp-didactico` para adjuntar recursos.
- **Prompts**: aparecen como comandos (p. ej. `/mcp-didactico:revisar-codigo`).

---

## Estructura

```
mcp-didactico/
├── src/
│   └── server.ts      # Todo el servidor, comentado paso a paso
├── package.json
├── tsconfig.json
└── README.md
```

## Errores típicos (para avisar a los alumnos)

1. **`inputSchema` / `argsSchema` es un objeto plano**, `{ nombre: z.string() }`,
   **no** `z.object({ ... })`.
2. **Nunca `console.log()`** en un servidor stdio: contamina el protocolo.
   Usa `console.error()` para depurar (va por stderr).
3. Recuerda **recompilar** (`npm run build`) tras cambiar el código antes de
   que Claude Code lo recargue, si registras `build/server.js`.
