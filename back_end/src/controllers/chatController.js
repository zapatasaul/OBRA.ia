// Archivo: backend/src/controllers/chatController.js
const { chatTechnical } = require("../services/geminiService"); // Cambiamos la importación

const handleChat = async (req, res) => {
  try {
    const { question, context } = req.body;
    if (!question || !context)
      return res.status(400).json({ error: "Faltan datos." });

    const answer = await chatTechnical(question, context);
    res.json({ answer });
  } catch (error) {
    console.error("Error en el chat:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { handleChat };
