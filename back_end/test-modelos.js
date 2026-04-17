require("dotenv").config();

async function revisarModelos() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.log("❌ No se encontró la API Key en el archivo .env");
    return;
  }

  console.log("🔍 Consultando a Google qué modelos tienes disponibles...");

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
    );
    const data = await response.json();

    if (data.error) {
      console.log("❌ Error de Google:", data.error.message);
      return;
    }

    console.log("✅ Tu API Key tiene acceso a los siguientes modelos:\n");
    const modelosSoportados = data.models.map((m) => m.name);
    console.log(modelosSoportados.join("\n"));
  } catch (error) {
    console.log("❌ Error de conexión:", error.message);
  }
}

revisarModelos();
