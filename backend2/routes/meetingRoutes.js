const express = require("express");
const {
  home,
  healthCheck,
  generateMeeting,
} = require("../controllers/meetingControllers");

const router = express.Router();

router.get("/", home);
router.get("/health", healthCheck);
router.post("/generate-meeting-id", generateMeeting);

module.exports = router;
