const { Server } = require("socket.io");
const {
  meetings,
  participants,
  activeCalls,
} = require("../controllers/meetingControllers");

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Start a call (host initiates)
    socket.on("start-call", ({ sessionId, meetingId, hostName, duration }) => {
      console.log(`📞 Host ${hostName} started call for session ${sessionId}`);

      const now = new Date();
      const endTime = new Date(
        now.getTime() + (duration || 30) * 60000
      );

      // Mark call as active in memory
      activeCalls.set(sessionId, {
        meetingId,
        hostName,
        startedAt: now.toISOString(),
        scheduledEndTime: endTime.toISOString(),
        duration: duration || 30,
        status: "active",
      });

      // Broadcast to all clients
      io.emit("call-started", { sessionId, meetingId, hostName });
      socket.emit("call-start-confirmed", { sessionId, meetingId });
    });

    // Check if call is active
    socket.on("check-call-status", ({ sessionId }) => {
      const callInfo = activeCalls.get(sessionId);

      socket.emit("call-status-response", {
        sessionId,
        isActive: !!callInfo,
        callInfo: callInfo || null,
      });
    });

    // End a call
    socket.on("end-call", ({ sessionId }) => {
      console.log(`📞 Call ended for session ${sessionId}`);

      activeCalls.delete(sessionId);

      io.emit("call-ended", { sessionId });
    });
  });
};
function handleParticipantLeave(socket, meetingId, participantId) {
    const participant = participants.get(socket.id);

    if (participant) {
        console.log(`${participant.participantName} left meeting ${meetingId}`);

        // Check if this is the host leaving
        const isHost = participant.isHost;
        const participantNameLeaving = participant.participantName;
        const sessionId = participant.sessionId;

        // Notify others
        socket.to(meetingId).emit('participant-left', {
            participantId: participant.participantId,
            participantName: participant.participantName
        });

        // If host is leaving, emit host-left event
        if (isHost) {
            console.log(`🎯 Host ${participantNameLeaving} left meeting ${meetingId}`);
            socket.to(meetingId).emit('host-left', {
                hostName: participantNameLeaving,
                meetingId: meetingId,
                sessionId: sessionId
            });
        }

        // Clean up
        socket.leave(meetingId);
        participants.delete(socket.id);

        if (meetings.has(meetingId)) {
            meetings.get(meetingId).delete(socket.id);

            // Remove meeting if empty
            if (meetings.get(meetingId).size === 0) {
                meetings.delete(meetingId);
                console.log(`Meeting ${meetingId} ended (no participants)`);
            }
        }
    }
}

module.exports = setupSocket;
