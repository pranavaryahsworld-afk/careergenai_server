const express = require("express");
const http = require("http");
const cors = require("cors");

const meetingRoutes = require("./routes/meetingRoutes");
const setupSocket = require("./socket/socket");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/", meetingRoutes);

// Socket.IO
setupSocket(server);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
