/**
 * ============================================================================
 *  SERVIDOR MCP DIDÁCTICO
 * ============================================================================
 *
 *  MCP (Model Context Protocol) es un protocolo estándar que permite a un
 *  modelo (como Claude, dentro de Claude Code) conectarse con herramientas y
 *  datos externos de forma segura y uniforme.
 *
 *  Un servidor MCP puede exponer TRES tipos de capacidades:
 *
 *    1) TOOLS      -> Funciones que el modelo puede INVOCAR (verbos: calcular,
 *                     crear, consultar...). El modelo decide cuándo llamarlas.
 *
 *    2) RESOURCES  -> Datos que el modelo/cliente puede LEER (sustantivos: un
 *                     fichero, una configuración, un perfil...). Son de solo
 *                     lectura, como un GET.
 *
 *    3) PROMPTS    -> Plantillas de conversación reutilizables. En Claude Code
 *                     aparecen como comandos que el usuario puede lanzar.
 *
 *  Este servidor implementa un ejemplo de cada uno.
 *
 *  Transporte: STDIO (entrada/salida estándar). Es el más simple y el que usa
 *  Claude Code por defecto: arranca el proceso y habla con él por stdin/stdout.
 *  POR ESO: nunca uses console.log() para depurar (contaminaría el protocolo).
 *  Para logs usa console.error(), que va por stderr y no interfiere.
 * ============================================================================
 */

import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// ---------------------------------------------------------------------------
// 1. Creamos el servidor. name y version son metadatos que el cliente ve.
// ---------------------------------------------------------------------------
const server = new McpServer({
  name: "mcp-didactico",
  version: "1.0.0",
});

// ===========================================================================
//  TOOLS  (herramientas invocables por el modelo)
// ===========================================================================

/**
 * TOOL 1: `saludar`
 * El ejemplo más simple posible: recibe un nombre y devuelve un saludo.
 * Sirve para ver el flujo entrada -> handler -> salida.
 *
 * IMPORTANTE sobre `inputSchema`: es un OBJETO PLANO de campos Zod
 * ({ nombre: z.string() }), NO se envuelve en z.object(...). Es el error
 * más común al empezar con el SDK.
 */
server.registerTool(
  "saludar",
  {
    title: "Saludar",
    description: "Devuelve un saludo personalizado para el nombre indicado.",
    inputSchema: {
      nombre: z.string().describe("Nombre de la persona a saludar"),
    },
  },
  async ({ nombre }) => {
    return {
      // El resultado siempre es un array `content` de bloques.
      content: [{ type: "text", text: `¡Hola, ${nombre}! Bienvenido a MCP 👋` }],
    };
  }
);

/**
 * TOOL 2: `calcular_iva`
 * Muestra parámetros TIPADOS con validación real gracias a Zod:
 *   - `base` debe ser un número positivo.
 *   - `tipo` es opcional (por defecto 21, el IVA general en España).
 * Si el modelo/cliente envía datos inválidos, el SDK rechaza la llamada
 * automáticamente ANTES de entrar en el handler.
 */
server.registerTool(
  "calcular_iva",
  {
    title: "Calcular IVA",
    description:
      "Calcula el IVA de un importe base y devuelve base, cuota y total.",
    inputSchema: {
      base: z.number().positive().describe("Importe base sin IVA (en euros)"),
      tipo: z
        .number()
        .min(0)
        .max(100)
        .default(21)
        .describe("Porcentaje de IVA a aplicar. Por defecto 21."),
    },
  },
  async ({ base, tipo }) => {
    const cuota = +(base * (tipo / 100)).toFixed(2);
    const total = +(base + cuota).toFixed(2);

    const resumen =
      `Base: ${base} €\n` +
      `IVA (${tipo}%): ${cuota} €\n` +
      `Total: ${total} €`;

    return {
      content: [{ type: "text", text: resumen }],
    };
  }
);

/**
 * TOOL 3: `consultar_clima`
 * El caso realista: una tool que llama a una API EXTERNA de verdad.
 * Usa Open-Meteo (gratuita y sin API key). Hace dos pasos:
 *   1) Geocoding: convierte el nombre de la ciudad en latitud/longitud.
 *   2) Forecast: pide el tiempo actual para esas coordenadas.
 *
 * Puntos didácticos:
 *   - `fetch` es global en Node 18+ (no hace falta instalar nada).
 *   - Un handler puede ser asíncrono y esperar (await) llamadas de red.
 *   - Hay que GESTIONAR ERRORES: si la ciudad no existe o la API falla,
 *     devolvemos un resultado de error legible con `isError: true` en vez
 *     de lanzar una excepción sin control.
 */
server.registerTool(
  "consultar_clima",
  {
    title: "Consultar clima",
    description:
      "Consulta el tiempo actual de una ciudad usando la API pública Open-Meteo.",
    inputSchema: {
      ciudad: z.string().describe("Nombre de la ciudad, p. ej. 'Madrid'"),
    },
  },
  async ({ ciudad }) => {
    try {
      // Paso 1: geocoding (ciudad -> coordenadas).
      const geoUrl =
        "https://geocoding-api.open-meteo.com/v1/search" +
        `?name=${encodeURIComponent(ciudad)}&count=1&language=es&format=json`;
      const geoResp = await fetch(geoUrl);
      const geo = (await geoResp.json()) as {
        results?: { latitude: number; longitude: number; name: string; country?: string }[];
      };

      if (!geo.results || geo.results.length === 0) {
        return {
          isError: true,
          content: [{ type: "text", text: `No he encontrado la ciudad "${ciudad}".` }],
        };
      }

      const lugar = geo.results[0];

      // Paso 2: forecast (coordenadas -> tiempo actual).
      const meteoUrl =
        "https://api.open-meteo.com/v1/forecast" +
        `?latitude=${lugar.latitude}&longitude=${lugar.longitude}` +
        "&current=temperature_2m,wind_speed_10m";
      const meteoResp = await fetch(meteoUrl);
      const meteo = (await meteoResp.json()) as {
        current?: { temperature_2m: number; wind_speed_10m: number };
        current_units?: { temperature_2m: string; wind_speed_10m: string };
      };

      const c = meteo.current;
      const u = meteo.current_units;
      if (!c) {
        return {
          isError: true,
          content: [{ type: "text", text: "La API no ha devuelto datos de clima." }],
        };
      }

      const texto =
        `Clima en ${lugar.name}${lugar.country ? ", " + lugar.country : ""}:\n` +
        `Temperatura: ${c.temperature_2m} ${u?.temperature_2m ?? "°C"}\n` +
        `Viento: ${c.wind_speed_10m} ${u?.wind_speed_10m ?? "km/h"}`;

      return { content: [{ type: "text", text: texto }] };
    } catch (error) {
      // Cualquier fallo de red o de parseo se convierte en un error controlado.
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error consultando el clima: ${(error as Error).message}`,
          },
        ],
      };
    }
  }
);

// ===========================================================================
//  RESOURCES  (datos de solo lectura que el cliente puede leer)
// ===========================================================================

/**
 * RESOURCE ESTÁTICO: `notas://curso`
 * Una URI fija que siempre devuelve el mismo contenido. Ideal para exponer
 * configuración, documentación o, como aquí, las notas del curso.
 */
server.registerResource(
  "notas-curso",
  "notas://curso",
  {
    title: "Notas del curso",
    description: "Apuntes rápidos del curso de Claude Code + MCP.",
    mimeType: "text/markdown",
  },
  async (uri) => {
    const contenido = [
      "# Notas del curso de MCP",
      "",
      "- Un servidor MCP expone Tools, Resources y Prompts.",
      "- Tools = acciones que el modelo invoca.",
      "- Resources = datos que se leen (solo lectura).",
      "- Prompts = plantillas reutilizables.",
      "- Transporte por defecto en Claude Code: stdio.",
    ].join("\n");

    return {
      contents: [{ uri: uri.href, text: contenido }],
    };
  }
);

/**
 * RESOURCE DINÁMICO: `alumno://{id}/perfil`
 * Usa una `ResourceTemplate` con un parámetro `{id}` en la URI. El cliente
 * puede pedir alumno://1/perfil, alumno://2/perfil, etc. y el valor de `id`
 * llega como argumento al handler.
 */
const ALUMNOS: Record<string, { nombre: string; nivel: string }> = {
  "1": { nombre: "Ana", nivel: "principiante" },
  "2": { nombre: "Luis", nivel: "intermedio" },
  "3": { nombre: "Marta", nivel: "avanzado" },
};

server.registerResource(
  "alumno-perfil",
  new ResourceTemplate("alumno://{id}/perfil", { list: undefined }),
  {
    title: "Perfil de alumno",
    description: "Ficha de un alumno del curso a partir de su id.",
    mimeType: "application/json",
  },
  async (uri, { id }) => {
    const alumno = ALUMNOS[String(id)];
    const datos = alumno ?? { error: `No existe el alumno con id ${id}` };

    return {
      contents: [{ uri: uri.href, text: JSON.stringify(datos, null, 2) }],
    };
  }
);

// ===========================================================================
//  PROMPTS  (plantillas de conversación reutilizables)
// ===========================================================================

/**
 * PROMPT: `revisar-codigo`
 * Genera un mensaje ya preparado para pedirle a Claude que revise un fragmento
 * de código. En Claude Code el usuario podría lanzarlo y rellenar `codigo`.
 *
 * Nota: `argsSchema`, igual que `inputSchema`, es un objeto plano de campos
 * Zod, no un z.object(...).
 */
server.registerPrompt(
  "revisar-codigo",
  {
    title: "Revisar código",
    description: "Crea un prompt para que Claude revise un fragmento de código.",
    argsSchema: {
      codigo: z.string().describe("El código a revisar"),
    },
  },
  ({ codigo }) => {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text:
              "Revisa el siguiente código. Señala bugs, problemas de " +
              "legibilidad y posibles mejoras. Sé conciso:\n\n" +
              "```\n" +
              codigo +
              "\n```",
          },
        },
      ],
    };
  }
);

// ===========================================================================
//  ARRANQUE
// ===========================================================================

async function main() {
  // Conectamos el servidor al transporte stdio y quedamos a la escucha.
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // OJO: por stderr (no stdout) para no romper el protocolo.
  console.error("Servidor MCP didáctico en marcha (stdio) ✔");
}

main().catch((error) => {
  console.error("Error fatal arrancando el servidor MCP:", error);
  process.exit(1);
});
