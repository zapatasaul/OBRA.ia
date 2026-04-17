const pdfParse = require("pdf-parse");

const extractText = async (buffer) => {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    throw new Error("Error extrayendo texto del documento.");
  }
};

module.exports = { extractText };
