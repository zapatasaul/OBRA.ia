const { extractText } = require("../utils/pdfExtractor");
const { analyzeStructuralRisk } = require("../services/openaiService");

const analyzePlan = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Archivo requerido." });
    const location = req.body.location || "Ubicación no especificada";

    const text = await extractText(req.file.buffer);
    const analysis = await analyzeStructuralRisk(text, location);

    res.json({ ...analysis, texto_extraido: text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { analyzePlan };
