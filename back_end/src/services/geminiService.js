const { GoogleGenerativeAI } = require("@google/generative-ai");

// Inicializamos el cliente de Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeStructuralRisk = async (inputs, location) => {
  try {
    // 🔥 Usamos la versión 2.5 exacta que te arrojó el diagnóstico
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const systemPrompt = `Eres OBRA.ai, un ingeniero estructural experto. 
Analiza el documento o plano estructural junto con la ubicación del proyecto (${location}).
Devuelve un JSON estrictamente con la siguiente estructura:
{
  "estructura": {
    "tipo": "Descripción corta",
    "factibilidad": "Evaluación técnica",
    "problemas_detectados": ["Problema 1", "Problema 2"],
    "recomendaciones": ["Rec 1", "Rec 2"]
  },
  "riesgos": {
    "suelo": [{ "riesgo": "...", "impacto": "...", "probabilidad": "...", "recomendacion": "..." }],
    "clima": [{ "riesgo": "...", "impacto": "...", "probabilidad": "...", "recomendacion": "..." }]
  }
}`;

    const promptParts = [systemPrompt];
    const texts = Array.isArray(inputs?.texts) ? inputs.texts : [];
    const images = Array.isArray(inputs?.images) ? inputs.images : [];

    if (texts.length > 0) {
      promptParts.push(`Contenido consolidado:\n${texts.join("\n\n")}`);
    }

    for (const image of images) {
      promptParts.push({
        inlineData: {
          data: image.data,
          mimeType: image.mimeType || "image/jpeg",
        },
      });
    }

    promptParts.push(
      "Analiza toda la información adjunta (texto e imágenes) y extrae los datos solicitados en formato JSON.",
    );

    const result = await model.generateContent(promptParts);
    const responseText = result.response.text();

    return JSON.parse(responseText);
  } catch (error) {
    console.error("❌ Error interno en Gemini (Análisis):", error);
    throw new Error(
      "Falló la comunicación con Gemini API al analizar el documento.",
    );
  }
};

const chatTechnical = async (question, context) => {
  try {
    // 🔥 También actualizamos el chat a la versión 2.5
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `Eres un ingeniero residente experto en obra civil y estructuras.
Responde únicamente en base a: Factibilidad estructural, Riesgos de suelo, Riesgos climáticos.
No des opiniones generales. Responde con criterio técnico profesional utilizando este contexto del proyecto: 
${JSON.stringify(context)}`,
    });

    const result = await model.generateContent(question);
    return result.response.text();
  } catch (error) {
    console.error("❌ Error interno en Gemini (Chat):", error);
    throw new Error("Falló la comunicación con Gemini API en el chat.");
  }
};

module.exports = { analyzeStructuralRisk, chatTechnical };
