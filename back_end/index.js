require("dotenv").config();
const express = require("express");
const cors = require("cors");
const apiRoutes = require("./src/routes/api");
const { initializeDatabase } = require("./src/controllers/database");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/api", apiRoutes);

const startServer = async () => {
  try {
    await initializeDatabase();
    console.log("✅ Base de datos SQLite inicializada.");

    app.listen(PORT, () => {
      console.log(`🏗️ Backend OBRA.ai corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al inicializar la base de datos:", error);
    process.exit(1);
  }
};

startServer();
