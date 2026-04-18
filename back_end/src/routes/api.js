const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const { analyzePlan } = require("../controllers/analysisController");
const { handleChat } = require("../controllers/chatController");
const { getBaseDatabase } = require("../controllers/database");

router.post("/analyze-plan", upload.single("file"), analyzePlan);
router.post("/chat-tecnico", handleChat);
router.get("/database", getBaseDatabase);


module.exports = router;
