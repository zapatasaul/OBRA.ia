const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeStructuralRisk = async (inputs, location) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const systemPrompt = `Eres OBRA.ai, un Ingeniero Estructural Senior y Project Manager Financiero experto.
Tu tarea es analizar detalladamente los documentos y planos proporcionados, cruzando la información con las condiciones geotécnicas y climáticas reales de la ubicación: ${location}.

REGLAS CRÍTICAS DE EJECUCIÓN (PROHIBIDO INCUMPLIRLAS):
1. SIMULACIÓN OBLIGATORIA (CERO N/A): Tienes ESTRICTAMENTE PROHIBIDO usar palabras como "N/A", "No disponible", "Desconocido" o dejar campos vacíos. Si un dato no está en el plano, DEBES ASUMIR el escenario más probable basado en la industria de la construcción para la ubicación y generar estimaciones numéricas realistas. Esto es un simulador preventivo, requiero proyecciones sí o sí.
2. ANÁLISIS VISUAL Y COORDENADAS: Revisa la imagen minuciosamente. Si hay fallos, márcalos. Si no hay fallos, marca las conexiones estructurales más importantes. El campo "coordenadas_caja" DEBE contener exactamente 4 números [ymin, xmin, ymax, xmax] en escala de 0 a 1000.
3. CÁLCULO FINANCIERO INVENTADO PERO LÓGICO: Si no conoces el costo, investiga la media en la zona de desarrollo, y usa parámetros estándar (ej. +10% sobrecosto, 2 semanas de retraso). Justifícalo técnicamente.

Devuelve ÚNICA Y ESTRICTAMENTE un JSON con este formato exacto:
{
  "estructura": {
    "tipo": "[Deduce el tipo exacto]",
    "factibilidad": "[Análisis técnico]",
    "problemas_detectados": [
      { 
        "descripcion": "[Fallo detectado o punto crítico]", 
        "coordenadas_caja": [ymin, xmin, ymax, xmax] 
      }
    ],
    "recomendaciones": ["[Rec 1]", "[Rec 2]"]
  },
  "riesgos": {
    "suelo": [
      { 
        "riesgo": "[Riesgo geotécnico]", 
        "impacto": "[Daño físico]", 
        "probabilidad": "[Alta | Media | Baja]", 
        "recomendacion": "[Técnica mitigación]", 
        "impacto_costo_tiempo": "[Ej: +8% en pilotes, +2 semanas]" 
      }
    ],
    "clima": [
      { 
        "riesgo": "[Riesgo climático]", 
        "impacto": "[Impacto logística]", 
        "probabilidad": "[Alta | Media | Baja]", 
        "recomendacion": "[Plan mitigación]", 
        "impacto_costo_tiempo": "[Ej: +5% en bombeo, +1 semana]" 
      }
    ]
  },
  "impacto_global": {
    "nivel_riesgo_general": "[Bajo | Medio | Alto | Crítico]",
    "sobrecosto_estimado_porcentaje": "[Ej: +12% a +18%]",
    "retraso_estimado_tiempo": "[Ej: 4 a 6 semanas]",
    "justificacion_financiera": "[Explicación técnica/financiera]"
  }
}`;

    const promptParts = [systemPrompt];
    const texts = Array.isArray(inputs?.texts) ? inputs.texts : [];
    const images = Array.isArray(inputs?.images) ? inputs.images : [];

    if (texts.length > 0) {
      promptParts.push(
        `Contenido consolidado del documento:\n${texts.join("\n\n")}`,
      );
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
      "Analiza la información adjunta y genera el reporte ejecutivo JSON. Recuerda: Deduce parámetros realistas si falta información.",
    );

    const result = await model.generateContent(promptParts);
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error("❌ Error interno en Gemini (Análisis):", error);
    throw new Error(
      `Falló la comunicación con Gemini API al analizar el documento: ${error.message}`,
    );
  }
};

const chatTechnical = async (question, context) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `Eres un ingeniero residente experto en obra civil, estructuras y finanzas de proyectos.
Responde únicamente en base a: Factibilidad estructural, Riesgos de suelo, Riesgos climáticos y Presupuesto/Tiempo.
Si el usuario te pregunta por soluciones, dales un aproximado realista de costos o metodologías de obra.
No des opiniones generales. Responde con criterio técnico profesional y deductivo utilizando este contexto del proyecto: 
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
