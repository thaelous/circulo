import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Server-side Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Helper for waiting between attempts
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Determines if an error is transient (503 Service Unavailable, 429, overloaded, etc.)
function isTransientError(error: any): boolean {
  if (!error) return false;
  const status = error.status || error.statusCode || error.code || error.response?.status;
  if (status === 503 || status === 429 || status === 500 || status === 502 || status === 504) {
    return true;
  }
  const str = `${error.message || ""} ${error.details || ""} ${error.statusText || ""}`.toLowerCase();
  return (
    str.includes("503") ||
    str.includes("unavailable") ||
    str.includes("overloaded") ||
    str.includes("high demand") ||
    str.includes("resource exhausted") ||
    str.includes("rate limit") ||
    str.includes("try again") ||
    str.includes("econnreset") ||
    str.includes("socket hang up")
  );
}

// Executes generateContent with up to 3 automatic retries and 3s wait time
async function generateContentWithRetry(
  aiClient: GoogleGenAI,
  generateParams: any,
  maxAttempts: number = 3,
  retryDelayMs: number = 3000
) {
  let attempt = 0;
  // Models to prioritize: Flash models with high availability
  const modelsToTry = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-3.8-flash"];

  while (attempt < maxAttempts) {
    attempt++;
    const currentModel = modelsToTry[attempt - 1] || "gemini-3.8-flash";
    try {
      console.log(`[Gemini API] Iniciando intento ${attempt} de ${maxAttempts} con modelo '${currentModel}'...`);
      const response = await aiClient.models.generateContent({
        ...generateParams,
        model: currentModel,
      });
      console.log(`[Gemini API] Intento ${attempt} completado exitosamente.`);
      return response;
    } catch (error: any) {
      const isRetryable = isTransientError(error);
      console.warn(
        `[Gemini API] Error en intento ${attempt}/${maxAttempts} (${error?.status || "error"}): ${error?.message}`
      );

      if (attempt < maxAttempts && isRetryable) {
        console.log(
          `[Gemini API] Detectado 503/UNAVAILABLE (alta demanda). Esperando ${retryDelayMs / 1000}s antes de reintentar (Intento ${attempt + 1}/${maxAttempts})...`
        );
        await sleep(retryDelayMs);
      } else {
        throw error;
      }
    }
  }
  throw new Error("Se superó el número máximo de intentos para procesar la imagen.");
}

app.post("/api/analyze-wheel", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/jpeg", notes } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "No se proporcionó la imagen de la rueda laboral." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "Falta configurar la clave de API GEMINI_API_KEY en las variables de entorno.",
      });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, "");

    const systemInstruction = `Eres un experto en desarrollo organizacional y facilitador de liderazgo.
Tu tarea es analizar la imagen de una 'Rueda Laboral aplicada en Liderazgo' que el usuario subirá, la cual contiene calificaciones actuales y notas manuscritas sobre 'Puntos Palanca' (P.P.) y 'Puntos Impacto' (P.I.).

Con base en esta imagen y los criterios organizacionales establecidos, debes generar estrictamente un reporte ejecutivo individual de resultados y recomendaciones que cumpla de forma exacta con los siguientes lineamientos:

1. FORMATO Y EXTENSIÓN:
- Estructura el resultado para que no exceda una cuartilla (hoja vertical tamaño carta).
- Mantén un tono profesional, objetivo, claro y directo.

2. ESTRUCTURA DEL REPORTE:
- Encabezado: Extrae de la imagen el nombre de la persona, puesto (si aplica), fecha de aplicación y fecha de seguimiento.
- Gráfica y proyección: Describe el panorama de la gráfica de araña (autoevaluación actual y meta acordada al plazo establecido en escala de 1 a 10 o porcentaje equivalente). Incluye obligatoriamente la nota al pie: "Resultados basados en autoevaluación y diálogo individual; no constituyen una evaluación de desempeño de terceros".
- Lectura Breve (Máximo 4 frases): Presenta hasta dos fortalezas prioritarias y dos áreas de oportunidad prioritarias (atendiendo de manera directa los 'Puntos Palanca' y 'Puntos Impacto' manuscritos en la hoja). Explica cada hallazgo con una frase clara (máximo 4 frases en total).
- Acciones Recomendadas: Presenta una tabla compacta con exactamente 6 filas organizadas de la siguiente manera:
  * 3 acciones para sostener fortalezas.
  * 3 acciones para desarrollar áreas de oportunidad.
  Cada fila debe contener: [Propósito] | [Acción sugerida (debe incluir un verbo observable, una situación de aplicación y una frecuencia o plazo, integrando el enfoque de Liderazgo Situacional - SLII cuando corresponda)] | [Evidencia breve de aplicación].
- Seguimiento: Indica la evidencia que se revisará y la fecha del próximo encuentro registrada en la imagen.

RESTRICCIÓN CRÍTICA:
No inventes datos, no completes información faltante que no esté respaldada por los trazos o las notas de la imagen, y limítate estrictamente a los hallazgos observados. Si un dato no aparece en la hoja, indícalo de forma verídica y sobria (ej. 'No especificado en la hoja').`;

    const promptText = `Analiza detalladamente la imagen adjunta de la Rueda Laboral de Liderazgo.
Interpreta las calificaciones actuales marcadas en los radios, cualquier meta/proyección trazada, las siglas o notas de Puntos Palanca (P.P.) y Puntos Impacto (P.I.), y el recuadro de acuerdos y seguimiento.
${notes ? `Notas adicionales aportadas por el facilitador: "${notes}"` : ""}

Devuelve un JSON con la estructura estricta solicitada para la cuartilla ejecutiva.`;

    const generateParams = {
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType || "image/jpeg",
              data: cleanBase64,
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        systemInstruction,
        temperature: 0.15,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            header: {
              type: Type.OBJECT,
              properties: {
                nombre: { type: Type.STRING, description: "Nombre extraído de la imagen" },
                puesto: { type: Type.STRING, description: "Puesto o rol si aplica extraído de la imagen" },
                fechaAplicacion: { type: Type.STRING, description: "Fecha de aplicación registrada" },
                fechaSeguimiento: { type: Type.STRING, description: "Fecha de seguimiento registrada" },
              },
              required: ["nombre", "puesto", "fechaAplicacion", "fechaSeguimiento"],
            },
            graficaProyeccionDescripcion: {
              type: Type.STRING,
              description: "Descripción concisa del panorama de la gráfica de araña: autoevaluación actual y meta acordada al plazo establecido en escala de 1 a 10 o % equivalente",
            },
            dimensiones: {
              type: Type.ARRAY,
              description: "Ejes de la rueda con calificación actual, meta si aplica, y marcas P.P. o P.I.",
              items: {
                type: Type.OBJECT,
                properties: {
                  nombre: { type: Type.STRING, description: "Nombre de la dimensión/eje" },
                  puntuacion: { type: Type.NUMBER, description: "Calificación autoevaluación actual (1 a 10 o %)" },
                  metaProyeccion: { type: Type.NUMBER, description: "Meta acordada al plazo establecido si visible" },
                  escala: { type: Type.STRING, description: "Escala utilizada (1-10 o 0-100%)" },
                  esPalanca: { type: Type.BOOLEAN, description: "Si está marcado como Punto Palanca (P.P.)" },
                  esImpacto: { type: Type.BOOLEAN, description: "Si está marcado como Punto Impacto (P.I.)" },
                  observacionesVisuales: { type: Type.STRING, description: "Anotación manuscrita asociada" },
                },
                required: ["nombre", "puntuacion"],
              },
            },
            lecturaBreve: {
              type: Type.OBJECT,
              properties: {
                fortalezas: {
                  type: Type.ARRAY,
                  description: "Hasta dos fortalezas prioritarias atendiendo Puntos Palanca (P.P.). 1 frase clara por hallazgo.",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      dimension: { type: Type.STRING },
                      esPuntoPalanca: { type: Type.BOOLEAN },
                      fraseExplicativa: { type: Type.STRING, description: "Una sola frase clara" },
                    },
                    required: ["dimension", "esPuntoPalanca", "fraseExplicativa"],
                  },
                },
                areasOportunidad: {
                  type: Type.ARRAY,
                  description: "Hasta dos áreas de oportunidad prioritarias atendiendo Puntos Impacto (P.I.). 1 frase clara por hallazgo.",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      dimension: { type: Type.STRING },
                      esPuntoImpacto: { type: Type.BOOLEAN },
                      fraseExplicativa: { type: Type.STRING, description: "Una sola frase clara" },
                    },
                    required: ["dimension", "esPuntoImpacto", "fraseExplicativa"],
                  },
                },
              },
              required: ["fortalezas", "areasOportunidad"],
            },
            puntosPalancaIdentificados: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Puntos Palanca (P.P.) identificados textualmente en la hoja",
            },
            puntosImpactoIdentificados: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Puntos Impacto (P.I.) identificados textualmente en la hoja",
            },
            accionesRecomendadas: {
              type: Type.OBJECT,
              properties: {
                paraFortalezas: {
                  type: Type.ARRAY,
                  description: "Exactamente 3 acciones para sostener fortalezas",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      proposito: { type: Type.STRING, description: "Propósito (ej. 'Sostener Fortaleza')" },
                      accionSugerida: {
                        type: Type.STRING,
                        description: "Acción sugerida con verbo observable, situación de aplicación, frecuencia/plazo y enfoque SLII",
                      },
                      evidenciaBreve: { type: Type.STRING, description: "Evidencia breve de aplicación observable" },
                      verboObservable: { type: Type.STRING, description: "Verbo observable inicial" },
                      enfoqueSLII: { type: Type.STRING, description: "Estilo SLII aplicado (ej. S3 / S4)" },
                    },
                    required: ["proposito", "accionSugerida", "evidenciaBreve"],
                  },
                },
                paraOportunidades: {
                  type: Type.ARRAY,
                  description: "Exactamente 3 acciones para desarrollar áreas de oportunidad",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      proposito: { type: Type.STRING, description: "Propósito (ej. 'Desarrollar Oportunidad')" },
                      accionSugerida: {
                        type: Type.STRING,
                        description: "Acción sugerida con verbo observable, situación de aplicación, frecuencia/plazo y enfoque SLII",
                      },
                      evidenciaBreve: { type: Type.STRING, description: "Evidencia breve de aplicación observable" },
                      verboObservable: { type: Type.STRING, description: "Verbo observable inicial" },
                      enfoqueSLII: { type: Type.STRING, description: "Estilo SLII aplicado (ej. S1 / S2)" },
                    },
                    required: ["proposito", "accionSugerida", "evidenciaBreve"],
                  },
                },
              },
              required: ["paraFortalezas", "paraOportunidades"],
            },
            seguimiento: {
              type: Type.OBJECT,
              properties: {
                evidenciaARevisar: {
                  type: Type.STRING,
                  description: "Evidencia que se revisará indicada o derivada de los acuerdos de la hoja",
                },
                fechaProximoEncuentro: {
                  type: Type.STRING,
                  description: "Fecha del próximo encuentro registrada en la imagen",
                },
              },
              required: ["evidenciaARevisar", "fechaProximoEncuentro"],
            },
            notaAlPieObligatoria: {
              type: Type.STRING,
              description: "Texto obligatorio: 'Resultados basados en autoevaluación y diálogo individual; no constituyen una evaluación de desempeño de terceros.'",
            },
            resumenEjecutivoCuartilla: {
              type: Type.STRING,
              description: "Transcripción del reporte completo en texto estructurado de una cuartilla",
            },
          },
          required: [
            "header",
            "graficaProyeccionDescripcion",
            "dimensiones",
            "lecturaBreve",
            "accionesRecomendadas",
            "seguimiento",
            "notaAlPieObligatoria",
          ],
        },
      },
    };

    // Execute with automatic retry logic (3s backoff, max 3 attempts)
    const response = await generateContentWithRetry(ai, generateParams, 3, 3000);
    const rawText = response.text || "";

    // Parse safely in try...catch without throwing unexpected token error on markdown / plain text
    let parsedResult: any = null;
    let isRawText = false;

    try {
      let cleaned = rawText.trim();
      if (cleaned.startsWith("```json")) {
        cleaned = cleaned.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
      } else if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
      }

      // First attempt: direct JSON parse
      try {
        const directParsed = JSON.parse(cleaned);
        if (directParsed && typeof directParsed === "object") {
          parsedResult = directParsed;
        }
      } catch (_jsonErr) {
        // Second attempt: extract JSON enclosed between outer braces
        const firstBrace = cleaned.indexOf("{");
        const lastBrace = cleaned.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          const substringJson = cleaned.substring(firstBrace, lastBrace + 1);
          parsedResult = JSON.parse(substringJson);
        }
      }
    } catch (_parseErr) {
      // Ignored: will fallback to plain text/markdown
    }

    if (parsedResult && parsedResult.header) {
      return res.json({ success: true, data: parsedResult, isRawText: false });
    }

    // Fallback: Model returned non-JSON text or markdown
    console.log(
      "[Gemini API] La respuesta no viene en formato JSON estricto. Renderizando directamente como texto/markdown en el reporte."
    );

    const nombreMatch = rawText.match(/(?:Nombre|Colaborador|Líder)[:\s*]+([^\n\r,]+)/i);
    const puestoMatch = rawText.match(/(?:Puesto|Rol)[:\s*]+([^\n\r,]+)/i);
    const fechaApMatch = rawText.match(/(?:Fecha de Aplicación|Aplicación)[:\s*]+([^\n\r,]+)/i);
    const fechaSegMatch = rawText.match(/(?:Fecha de Seguimiento|Seguimiento)[:\s*]+([^\n\r,]+)/i);

    const fallbackData = {
      header: {
        nombre: nombreMatch ? nombreMatch[1].replace(/[*#]/g, "").trim() : "Líder Evaluado",
        puesto: puestoMatch ? puestoMatch[1].replace(/[*#]/g, "").trim() : "No especificado",
        fechaAplicacion: fechaApMatch ? fechaApMatch[1].replace(/[*#]/g, "").trim() : "Registrada en hoja",
        fechaSeguimiento: fechaSegMatch ? fechaSegMatch[1].replace(/[*#]/g, "").trim() : "Por definir",
      },
      graficaProyeccionDescripcion: "Evaluación y proyección de liderazgo extraídas del diagnóstico de la hoja.",
      dimensiones: [],
      lecturaBreve: {
        fortalezas: [],
        areasOportunidad: [],
      },
      puntosPalancaIdentificados: [],
      puntosImpactoIdentificados: [],
      accionesRecomendadas: {
        paraFortalezas: [],
        paraOportunidades: [],
      },
      seguimiento: {
        evidenciaARevisar: "Evidencias acordadas en la sesión de autodiagnóstico.",
        fechaProximoEncuentro: fechaSegMatch ? fechaSegMatch[1].replace(/[*#]/g, "").trim() : "Por definir",
      },
      notaAlPieObligatoria:
        "Resultados basados en autoevaluación y diálogo individual; no constituyen una evaluación de desempeño de terceros.",
      resumenEjecutivoCuartilla: rawText,
      rawMarkdown: rawText,
      isRawText: true,
    };

    return res.json({ success: true, data: fallbackData, isRawText: true, rawText });
  } catch (error: any) {
    console.error("Error analyzing wheel:", error);
    const is503 = isTransientError(error);
    return res.status(is503 ? 503 : 500).json({
      error:
        error?.message ||
        "El servicio del modelo no estuvo disponible tras varios intentos. Por favor prueba de nuevo.",
      isTransient: is503,
    });
  }
});

// Configure Vite or serve static assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor iniciado en http://0.0.0.0:${PORT}`);
  });
}

startServer();
