var crypto = require("crypto");

// Secret key for encryption - should be in .env in production
var SECRET_KEY = process.env.MEETING_SECRET_KEY || "webrtc-secret-key-2024";

/**
 * Generate a secure meeting ID from a session ID
 * Uses HMAC-SHA256 to create a one-way hash that can't be reversed
 * @param {string} sessionId - The session ID
 * @returns {string} - Secure meeting ID (12 characters)
 */
function generateMeetingId(sessionId) {
  // Create HMAC hash using session ID
  var hmac = crypto.createHmac("sha256", SECRET_KEY);
  hmac.update(sessionId.toString());
  var hash = hmac.digest("hex");

  // Take first 12 characters and convert to uppercase for readability
  var meetingId = hash.substring(0, 12).toUpperCase();

  return meetingId;
}

/**
 * Verify if a meeting ID matches a session ID
 * @param {string} meetingId - The meeting ID to verify
 * @param {string} sessionId - The session ID to check against
 * @returns {boolean} - True if they match
 */
function verifyMeetingId(meetingId, sessionId) {
  var expectedMeetingId = generateMeetingId(sessionId);
  return meetingId.toUpperCase() === expectedMeetingId.toUpperCase();
}

/**
 * Generate a completely random meeting ID
 * @returns {string} - Random meeting ID (12 characters)
 */
function generateRandomMeetingId() {
  return crypto.randomBytes(6).toString("hex").toUpperCase();
}

module.exports = {
  generateMeetingId: generateMeetingId,
  verifyMeetingId: verifyMeetingId,
  generateRandomMeetingId: generateRandomMeetingId,
};
