const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Message = require("../models/Message");
const Project = require("../models/Project");

module.exports = (io) => {
  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      console.log("[SOCKET] handshake received");
      console.log("[SOCKET] authentication started");
      const token = socket.handshake.auth?.token;
      
      if (!token) {
        console.log("[SOCKET] authentication failed: No token provided");
        return next(new Error("Authentication error"));
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select("-password");
      
      if (!user) {
        console.log("[SOCKET] authentication failed: User not found");
        return next(new Error("Authentication error"));
      }
      
      socket.user = user;
      console.log("[SOCKET] authentication success for:", user.email);
      next();
    } catch (err) {
      console.log("[SOCKET] authentication failed:", err.message);
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log("[SOCKET] connected:", socket.id);

    socket.on("join_project", async (projectId) => {
      try {
        console.log(`[SOCKET] join_project: ${projectId} by ${socket.user.email}`);
        
        const project = await Project.findById(projectId);
        if (!project) return;
        
        const isMember = project.owner.toString() === socket.user._id.toString() || 
                         project.members.some(m => (m.user?._id || m.user || m).toString() === socket.user._id.toString());
                         
        if (isMember) {
          socket.join(`project:${projectId}`);
        } else {
          console.log(`[SOCKET] join_project rejected: ${socket.user.email} not a member`);
        }
      } catch (err) {
        console.error("join_project error:", err);
      }
    });

    socket.on("leave_project", (projectId) => {
      socket.leave(`project:${projectId}`);
    });

    socket.on("typing", ({ projectId, userName }) => {
      socket.to(`project:${projectId}`).emit("user_typing", { userName });
    });

    socket.on("stop_typing", ({ projectId }) => {
      socket.to(`project:${projectId}`).emit("user_stop_typing");
    });

    socket.on("send_message", async (data) => {
      try {
        const { projectId, content } = data;
        
        if (!content || !content.trim()) return;
        if (content.length > 2000) return; // Check length
        
        console.log(`[SOCKET] send_message in ${projectId}`);
        
        const project = await Project.findById(projectId);
        if (!project) return;
        
        const isMember = project.owner.toString() === socket.user._id.toString() || 
                         project.members.some(m => (m.user?._id || m.user || m).toString() === socket.user._id.toString());
                         
        if (!isMember) {
          console.log(`[SOCKET] send_message rejected: ${socket.user.email} not a member`);
          return;
        }
        
        const message = await Message.create({
          sender: socket.user._id,
          project: projectId,
          content: content.trim()
        });
        
        const populatedMessage = await Message.findById(message._id).populate("sender", "name email");
        
        io.to(`project:${projectId}`).emit("receive_message", populatedMessage);
      } catch (error) {
        console.error("Message send error:", error);
      }
    });

    socket.on("edit_message", async (data) => {
      try {
        const { messageId, content } = data;
        if (!content || !content.trim()) return;
        
        const message = await Message.findById(messageId).populate("project");
        if (!message || message.deleted) return;
        if (message.sender.toString() !== socket.user._id.toString()) return;

        const project = message.project;
        const isMember = project.owner.toString() === socket.user._id.toString() || 
                         project.members.some(m => (m.user?._id || m.user || m).toString() === socket.user._id.toString());
        if (!isMember) return;
        
        message.content = content.trim();
        message.edited = true;
        message.editedAt = new Date();
        await message.save();
        
        const populatedMessage = await Message.findById(messageId).populate("sender", "name email");
        io.to(`project:${project._id}`).emit("message_edited", populatedMessage);
      } catch (error) {
        console.error("Message edit error:", error);
      }
    });

    socket.on("delete_message", async (data) => {
      try {
        const { messageId } = data;
        const message = await Message.findById(messageId).populate("project");
        if (!message || message.deleted) return;
        if (message.sender.toString() !== socket.user._id.toString()) return;

        const project = message.project;
        const isMember = project.owner.toString() === socket.user._id.toString() || 
                         project.members.some(m => (m.user?._id || m.user || m).toString() === socket.user._id.toString());
        if (!isMember) return;
        
        message.deleted = true;
        message.deletedAt = new Date();
        message.content = "Message deleted";
        await message.save();
        
        io.to(`project:${project._id}`).emit("message_deleted", { messageId });
      } catch (error) {
        console.error("Message delete error:", error);
      }
    });


    socket.on("disconnect", () => {
      console.log("[SOCKET] disconnected:", socket.id);
    });
  });
};
