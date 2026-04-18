// Archivo: backend/src/controllers/analysisController.js
const { extractText } = require("../utils/pdfExtractor");
const { analyzeStructuralRisk } = require("../services/geminiService"); // Cambiamos la importación
const { saveAnalysisRequest, updateAnalysisResult } = require("./database");

const analyzePlan = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Archivo requerido." });
    const location = req.body.location || "Ubicación no especificada";
    const conditions = req.body.conditions || "No especificadas";
    const proyectName = req.body.proyectName || "Proyecto sin nombre";
    const materials = req.body.materials || "No especificados";

    const isImage = req.file.mimetype.startsWith("image/");
    let analysis;
    let extractedData = "Plano analizado visualmente por IA.";

    const storedRecord = await saveAnalysisRequest({
      proyectName,
      location,
      conditions,
      materials,
      proyectDescription: null,
    });

    if (isImage) {
      const base64Image = req.file.buffer.toString("base64");
      // Le pasamos el mimetype dinámico a Gemini
      analysis = await analyzeStructuralRisk(
        base64Image,
        location,
        true,
        req.file.mimetype,
      );
    } else {
      const text = await extractText(req.file.buffer);
      extractedData = text;
      analysis = await analyzeStructuralRisk(text, location, false);
    }

    await updateAnalysisResult(storedRecord.id, JSON.stringify(analysis));

    res.json({
      ...analysis,
      texto_extraido: extractedData,
      saved: {
        ...storedRecord,
        proyectDescription: extractedData,
        apiResult: analysis,
      },
    });
  } catch (error) {
    console.error("Error en el análisis:", error);
    res
      .status(500)
      .json({ error: error.message || "Error procesando el documento" });
  }
};

module.exports = { analyzePlan };
