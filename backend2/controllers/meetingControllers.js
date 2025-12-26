const {
  generateMeetingId,
  generateRandomMeetingId,
} = require("../utils/meeting-id-generator");

// In-memory stores
const meetings = new Map();
const participants = new Map();
const activeCalls = new Map();

/* =====================
   HOME
===================== */
const home = (req, res) => {
  res.send("WebRTC Signaling Server is running.");
};

/* =====================
   HEALTH CHECK
===================== */
const healthCheck = (req, res) => {
  res.json({
    status: "ok",
    activeMeetings: meetings.size,
    activeParticipants: participants.size,
    activeCalls: activeCalls.size,
  });
};

/* =====================
   GENERATE MEETING ID
===================== */
const generateMeeting = (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    const meetingId = generateRandomMeetingId();
    return res.json({ meetingId, success: true });
  }

  const meetingId = generateMeetingId(sessionId);
  res.json({ sessionId, meetingId, success: true });
};

module.exports = {
  home,
  healthCheck,
  generateMeeting,
  meetings,
  participants,
  activeCalls,
};
