require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/error");

const app = express();
const server = http.createServer(app);

// Socket.IO (chat + live notifications) - Member B builds the handlers in sockets/chat.js
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL, credentials: true },
});
require("./sockets/chat")(io);
app.set("io", io);

// Global middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }));

// Health check
app.get("/api/health", (req, res) => res.json({ success: true, message: "Research Collaboration Tool API is running" }));

// Temporary test email endpoint
app.get("/api/test-email", async (req, res) => {
  try {
    const sendEmail = require("./utils/sendEmail");
    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: "ResearchHub Email Test",
      html: `<h2>ResearchHub Email Test</h2>
<p>Nodemailer and Gmail SMTP are working correctly.</p>
<p>This is a temporary development test.</p>`
    });
    res.json({ success: true, message: "Test email sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to send test email" });
  }
});

// Mount routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/invitations", require("./routes/invitationRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api", require("./routes/documentRoutes"));
app.use("/api", require("./routes/taskRoutes"));
app.use("/api", require("./routes/resourceRoutes"));
app.use("/api", require("./routes/researchPaperRoutes"));
app.use("/api", require("./routes/milestoneRoutes"));
app.use("/api", require("./routes/referenceRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/projects/:projectId/activities", require("./routes/activityRoutes"));
app.use("/api/search", require("./routes/searchRoutes"));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  server.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
});