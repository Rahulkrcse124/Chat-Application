// backend/socket.js

import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();

const userSocketMap = {}; // userId: socketId
let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: [process.env.FRONTEND_URL],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected to the server", socket.id);

    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap[userId] = socket.id;
    }

    // Notify all clients about online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("A user disconnected", socket.id);

      if (userId) {
        delete userSocketMap[userId];
      }

      // Notify again after removal
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
}

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

export { io };

// import { Server } from "socket.io";
// import dotenv from "dotenv";

// dotenv.config();

// const userSocketMap = {};

// let io;

// export function initSocket(server) {
//   io = new Server(server, {
//     cors: {
//       origin: [process.env.FRONTEND_URL],
//       credentials: true,
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log("A user connected to the server", socket.id);

//     const userId = socket.handshake.query.userId;

//     if (userId) {
//       userSocketMap[userId] = socket.id;
//     }

//     io.emit("getOnlineUsers", Object.keys(userSocketMap));

//     socket.on("disconnect", () => {
//       console.log("A user disconnected", socket.id);
//       if (userId) {
//         delete userSocketMap[userId];
//       }
//       io.emit("getOnlineUsers", Object.keys(userSocketMap));
//     });
//   });
// }

// export function getReceiverSocketId(userId) {
//   return userSocketMap[userId];
// }

// export { io };
