import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

app.use(express.json());

// API generate endpoint
app.post("/api/generate", async (req, res) => {
  try {
    const { topic, platform, tone, length = "medio", includeEmojis, includeHashtags } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Por favor, introduce una idea o tema para el post." });
    }

    if (!apiKey) {
      return res.status(500).json({
        error: "Falta la clave API de Gemini (GEMINI_API_KEY). Configúrala en el panel de Secrets.",
      });
    }

    // Prepare system instructions and constraints based on platform and length
    let platformConstraints = "";
    if (platform === "linkedin") {
      let lenConstraint = "Entre 800 y 1200 caracteres.";
      if (length === "corto") {
        lenConstraint = "Corto y al grano. Entre 300 y 600 caracteres.";
      } else if (length === "largo") {
        lenConstraint = "Detallado y profundo. Entre 1200 y 1800 caracteres.";
      }
      platformConstraints = `
- Longitud: ${lenConstraint}
- Hook obligatorio: El post DEBE comenzar con una primera línea (gancho o hook) extremadamente atractiva que incite a seguir leyendo ('ver más').
- Formato: Estructurado con espacio en blanco abundante, listas con viñetas elegantes si procede, fácil de leer en móvil.
`;
    } else if (platform === "instagram") {
      let lenConstraint = "Entre 180 y 250 caracteres (sin contar hashtags si están incluidos).";
      if (length === "corto") {
        lenConstraint = "Muy breve y directo. Entre 100 y 150 caracteres (sin contar hashtags si están incluidos).";
      } else if (length === "largo") {
        lenConstraint = "Extenso y descriptivo. Entre 250 y 450 caracteres (sin contar hashtags si están incluidos).";
      }
      platformConstraints = `
- Longitud: ${lenConstraint}
- Estilo: Visual, directo, cercano, con un fuerte llamado a la acción (CTA) al final.
`;
    } else {
      // X / Twitter
      let lenConstraint = "Estrictamente MÁXIMO 240 caracteres totales. Sé conciso e impactante.";
      if (length === "corto") {
        lenConstraint = "Súper breve, máximo 140 caracteres totales. Directo al grano.";
      } else if (length === "largo") {
        lenConstraint = "Estrictamente MÁXIMO 280 caracteres totales (límite absoluto de la plataforma). Exprime el espacio disponible al máximo sin pasarte.";
      }
      platformConstraints = `
- Longitud: ${lenConstraint}
`;
    }

    let toneDescription = "";
    switch (tone) {
      case "profesional":
        toneDescription = "Tono profesional: Experto, estructurado, claro, con vocabulario de negocios, genera confianza y autoridad. Sin rodeos.";
        break;
      case "cercano":
        toneDescription = "Tono cercano: Amistoso, conversacional, como si hablaras con un amigo. Cuenta una pequeña experiencia o anécdota y utiliza 'tú' de manera directa.";
        break;
      case "motivacional":
        toneDescription = "Tono motivacional: Inspirador, energético, con palabras de acción fuertes. Empuja al lector a tomar acción y superar obstáculos.";
        break;
      case "controversial":
        toneDescription = "Tono controversial o provocador: Desafía una creencia popular o mito común de tu sector, empieza con una declaración audaz y haz una pregunta que fomente el debate en los comentarios.";
        break;
      default:
        toneDescription = "Tono profesional, experto y claro.";
    }

    const emojiInstruction = includeEmojis 
      ? "Usa emojis relevantes distribuidos de forma estética y natural." 
      : "No uses ABSOLUTAMENTE NINGÚN emoji en la publicación.";

    const hashtagInstruction = includeHashtags
      ? "Incluye entre 3 y 5 hashtags relevantes y de alto rendimiento al final del post."
      : "No incluyas ABSOLUTAMENTE NINGÚN hashtag en la publicación.";

    const prompt = `
Eres un experto en copywriting para redes sociales y personal branding. Conoces perfectamente los algoritmos, formatos de lectura y límites de caracteres de las redes sociales.

Tu tarea es generar DOS (2) variantes distintas de un post en base a la siguiente idea/tema:
"${topic}"

REQUISITOS DE LA PLATAFORMA (${platform.toUpperCase()}):
${platformConstraints}

REQUISITOS DE TONO (${tone.toUpperCase()}):
${toneDescription}

OTRAS DIRECTRICES:
- Emojis: ${emojiInstruction}
- Hashtags: ${hashtagInstruction}
- Idioma: Escribe enteramente en Español (Castellano).
- Variabilidad: Las dos variantes deben ser significativamente diferentes en su enfoque, estructura o gancho inicial para dar opciones reales al usuario.
- Calidad: Evita frases vacías o clichés de IA ("¿Alguna vez te has preguntado...?"). Ve al grano con contenido que aporte valor real.

Genera las dos variantes respetando rigurosamente los límites de caracteres y formatos solicitados.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Eres un copywriter estrella especializado en redes sociales. Tu trabajo es redactar contenido natural, adictivo, que suene humano y que esté perfectamente optimizado para conseguir interacción y clics.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            variant1: {
              type: Type.STRING,
              description: "Primera variante del post optimizada para la plataforma elegida."
            },
            variant2: {
              type: Type.STRING,
              description: "Segunda variante del post con un ángulo o gancho diferente al de la primera."
            }
          },
          required: ["variant1", "variant2"]
        }
      }
    });

    const resultText = response.text || "{}";
    const resultJson = JSON.parse(resultText);

    res.json({
      variants: [
        resultJson.variant1 || "Error al generar la variante 1.",
        resultJson.variant2 || "Error al generar la variante 2."
      ]
    });

  } catch (error: any) {
    console.error("Error generating post content:", error);
    res.status(500).json({
      error: "Error interno del servidor al conectar con Gemini API: " + (error.message || error),
    });
  }
});

// Setup Vite development server or production assets
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();
