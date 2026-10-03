const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Project = require('../models/Project');
const Message = require('../models/Message');

const checkProjectMembership = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) return { project: null, role: null };

  const isOwner = project.owner.toString() === userId.toString();
  const member = project.members.find((m) => m.user?.toString() === userId.toString());

  if (isOwner) return { project, role: "owner" };
  if (member) return { project, role: member.role };
  return { project, role: null };
};

module.exports = (io) => {
  io.use(async (socket, next) => {
    console.log("Socket.IO connection attempt");
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        console.log("Socket authentication failed: No token provided");
        return next(new Error("Authentication error: No token provided"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        console.log("Socket authentication failed: User not found");
        return next(new Error("Authentication error: User not found"));
      }

      socket.user = user;
      console.log("Socket authenticated:", socket.user._id);
      next();
    } catch (error) {
      console.log("Socket authentication failed:", error.message);
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id} (User: ${socket.user.name})`);

    socket.on('join_project', async (projectId) => {
      try {
        const { project, role } = await checkProjectMembership(projectId, socket.user._id);
        if (!project || !role) {
          return socket.emit('chat_error', { message: 'Not authorized to join this project chat' });
        }

        const roomName = `project:${projectId}`;
        socket.join(roomName);
        console.log(`User ${socket.user.name} joined room ${roomName}`);
        
        socket.emit('joined_project', { projectId });
      } catch (error) {
        console.error('Join project error:', error);
        socket.emit('chat_error', { message: 'Failed to join project chat' });
      }
    });

    socket.on('leave_project', (projectId) => {
      const roomName = `project:${projectId}`;
      socket.leave(roomName);
      console.log(`User ${socket.user.name} left room ${roomName}`);
    });

    socket.on('send_message', async (data) => {
      try {
        const { projectId, content } = data;
        
        if (!projectId || !content || content.trim().length === 0) {
          return socket.emit('chat_error', { message: 'Project ID and valid content are required' });
        }
        if (content.length > 2000) {
          return socket.emit('chat_error', { message: 'Message is too long (max 2000 characters)' });
        }

        const { project, role } = await checkProjectMembership(projectId, socket.user._id);
        if (!project || !role) {
          return socket.emit('chat_error', { message: 'Not authorized to send messages to this project' });
        }

        // Viewers are typically read-only, but let's allow everyone to chat unless explicitly restricted
        // Let's assume viewers can chat, or if we want to restrict viewers:
        // if (role === 'viewer') return socket.emit('chat_error', { message: 'Viewers cannot send messages' });

        const message = new Message({
          sender: socket.user._id,
          project: projectId,
          content: content.trim()
        });

        await message.save();

        const populatedMessage = await Message.findById(message._id).populate('sender', 'name email');

        // Broadcast to the room
        io.to(`project:${projectId}`).emit('new_message', populatedMessage);

      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('chat_error', { message: 'Failed to send message' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};
