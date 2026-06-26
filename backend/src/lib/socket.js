import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      // "https://real-time-chat-app-with-video-call-using.onrender.com"
    ],
  },
});

// Used to store online users: { userId: socketId }
const userSocketMap = {};

export function getReceiverSocketId(userId) {
  // console.log("socket infos for debugs: ", userId, userSocketMap)
  return userSocketMap[userId] || null;
}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`✅ User connected: ${userId} -> Socket ID: ${socket.id}`);
  }

  // Emit updated list of online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("call-user", ({ to, from, signal }) => {
    const receiverSocketId = getReceiverSocketId(to);
    if (receiverSocketId) {
      console.log(`📞 Calling user ${to} from ${from}`);
      io.to(receiverSocketId).emit("incoming-call", { from, signal });
    } else {
      console.warn(`⚠️ User ${to} is offline or not found.`);
    }
  });

  socket.on("answer-call", ({ to, signal }) => {
    const callerSocketId = getReceiverSocketId(to);
    if (callerSocketId) {
      console.log(`✅ Call answered by ${userId} for ${to}`);
      io.to(callerSocketId).emit("call-answered", { signal });
    } else {
      console.warn(`⚠️ Caller ${to} not found.`);
    }
  });

  socket.on("ice-candidate", ({candidate, to  }) => {
    const receiverSocketId = getReceiverSocketId(to);
    if (receiverSocketId) {
      console.log(`❄️ Sending ICE candidate from ${userId} to ${to}`);
      io.to(receiverSocketId).emit("ice-candidate", { candidate, from: userId });
    } else {
      console.warn(`⚠️ ICE candidate receiver ${to} not found.`);
    }
  });

  socket.on("end-call", ({ to }) => {
    const receiverSocketId = getReceiverSocketId(to);
    if (receiverSocketId) {
      console.log(`🚫 Call ended by ${userId} for ${to}`);
      io.to(receiverSocketId).emit("call-ended");
    } else {
      console.warn(`⚠️ Cannot end call, user ${to} not found.`);
    }
  });

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
      console.log(`❌ User disconnected: ${userId}`);
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export { io, app, server };
