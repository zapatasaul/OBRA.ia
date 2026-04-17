const { GoogleGenerativeAI } = require("@google/generative-ai");

// Inicializamos el cliente de Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeStructuralRisk = async (
  content,
  location,
  isImage = false,
  mimeType = null,
) => {
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

    let promptParts = [systemPrompt];

    if (isImage) {
      promptParts.push({
        inlineData: {
          data: content, // string base64 limpio
          mimeType: mimeType || "image/jpeg",
        },
      });
      promptParts.push(
        "Analiza las notas y diagramas de este plano estructural y extrae los datos solicitados en formato JSON.",
      );
    } else {
      promptParts.push(`Documento extraído:\n${content}`);
    }

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
