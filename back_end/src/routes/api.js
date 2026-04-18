const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const { analyzePlan } = require("../controllers/analysisController");
const { handleChat } = require("../controllers/chatController");
const { getBaseDatabase } = require("../controllers/database");

router.post(
    "/analyze-plan",
    upload.fields([
        { name: "files", maxCount: 10 },
        { name: "file", maxCount: 1 },
    ]),
    analyzePlan,
);
router.post("/chat-tecnico", handleChat);
router.get("/database", getBaseDatabase);


module.exports = router;
