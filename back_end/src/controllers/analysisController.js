// Archivo: backend/src/controllers/analysisController.js
const { extractText } = require("../utils/pdfExtractor");
const { analyzeStructuralRisk } = require("../services/geminiService"); // Cambiamos la importación
const { saveAnalysisRequest, updateAnalysisResult } = require("./database");

const analyzePlan = async (req, res) => {
  try {
    let uploadedFiles = [];

    if (Array.isArray(req.files) && req.files.length > 0) {
      uploadedFiles = req.files;
    } else if (req.files && typeof req.files === "object") {
      const filesField = Array.isArray(req.files.files) ? req.files.files : [];
      const fileField = Array.isArray(req.files.file) ? req.files.file : [];
      uploadedFiles = [...filesField, ...fileField];
    } else if (req.file) {
      uploadedFiles = [req.file];
    }

    if (uploadedFiles.length === 0) {
      return res.status(400).json({ error: "Debes subir al menos un archivo." });
    }

    const location = req.body.location || "Ubicación no especificada";
    const conditions = req.body.conditions || "No especificadas";
    const proyectName = req.body.proyectName || "Proyecto sin nombre";
    const materials = req.body.materials || "No especificados";
    let analysis;
    let extractedData = "";

    const storedRecord = await saveAnalysisRequest({
      proyectName,
      location,
      conditions,
      materials,
      proyectDescription: null,
    });

    const imageInputs = [];
    const textInputs = [];

    for (const file of uploadedFiles) {
      const isImage = file.mimetype && file.mimetype.startsWith("image/");

      if (isImage) {
        imageInputs.push({
          data: file.buffer.toString("base64"),
          mimeType: file.mimetype,
          fileName: file.originalname,
        });
        textInputs.push(`[Imagen adjunta: ${file.originalname}]`);
      } else {
        const text = await extractText(file.buffer);
        textInputs.push(`--- Documento: ${file.originalname} ---\n${text}`);
      }
    }

    extractedData = textInputs.join("\n\n");
    analysis = await analyzeStructuralRisk(
      {
        texts: textInputs,
        images: imageInputs,
      },
      location,
    );

    await updateAnalysisResult(storedRecord.id, JSON.stringify(analysis));

    res.json({
      ...analysis,
      texto_extraido: extractedData,
      archivos_procesados: uploadedFiles.map((file) => file.originalname),
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
