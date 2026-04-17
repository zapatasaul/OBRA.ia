const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const { analyzePlan } = require("../controllers/analysisController");
const { handleChat } = require("../controllers/chatController");

router.post("/analyze-plan", upload.single("file"), analyzePlan);
router.post("/chat-tecnico", handleChat);

module.exports = router;
