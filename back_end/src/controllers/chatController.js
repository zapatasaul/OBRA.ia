const { chatTechnical } = require("../services/openaiService");

const handleChat = async (req, res) => {
  try {
    const { question, context } = req.body;
    if (!question || !context)
      return res.status(400).json({ error: "Faltan datos." });

    const answer = await chatTechnical(question, context);
    res.json({ answer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { handleChat };
