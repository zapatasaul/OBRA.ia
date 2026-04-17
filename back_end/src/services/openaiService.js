const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const analyzeStructuralRisk = async (text, location) => {
  const prompt = `Eres OBRA.ai, un ingeniero estructural experto en evaluación de proyectos.
Analiza el siguiente plano/documento junto con la ubicación del proyecto (${location}).
Devuelve un JSON estrictamente con la siguiente estructura y claves:
{
  "estructura": {
    "tipo": "Descripción corta",
    "factibilidad": "Evaluación técnica",
    "problemas_detectados": ["Problema 1", "Problema 2"],
    "recomendaciones": ["Rec 1", "Rec 2"]
  },
  "riesgos": {
    "suelo": [
      { "riesgo": "...", "impacto": "...", "probabilidad": "...", "recomendacion": "..." }
    ],
    "clima": [
      { "riesgo": "...", "impacto": "...", "probabilidad": "...", "recomendacion": "..." }
    ]
  }
}
Sé técnico, preciso y enfocado en ejecución real de obra.
Documento: ${text}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [{ role: "user", content: prompt }],
  });

  return JSON.parse(response.choices[0].message.content);
};

const chatTechnical = async (question, context) => {
  const systemPrompt = `Eres un ingeniero residente experto en obra civil y estructuras.
Responde únicamente en base a: Factibilidad estructural, Riesgos de suelo, Riesgos climáticos.
No des opiniones generales. Responde con criterio técnico profesional utilizando este contexto:
${JSON.stringify(context)}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: question },
    ],
  });

  return response.choices[0].message.content;
};

module.exports = { analyzeStructuralRisk, chatTechnical };
