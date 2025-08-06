// controllers/messageController.js

import messageModel from "../models/messageModel.js";
import userModel from "../models/userModel.js";
import cloudinary from "../config/cloudinaryConfig.js";
import { getReceiverSocketId, io } from "../utils/socket.js";
import fs from "fs";

// GET all users except current
export const getAllUsers = async (req, res) => {
  try {
    const userId = req.user._id;

    const filteredUsers = await userModel
      .find({ _id: { $ne: userId } })
      .select("-password");

    res.status(200).json({ success: true, users: filteredUsers });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Users not found",
      error: error.message,
    });
  }
};

// GET messages between two users
export const getMessages = async (req, res) => {
  try {
    const receiverId = req.params.id.trim();
    const myId = req.user._id;

    const receiver = await userModel.findById(receiverId);
    if (!receiver) {
      return res.status(400).json({
        success: false,
        message: "Receiver Id Invalid",
      });
    }

    const messages = await messageModel
      .find({
        $or: [
          { senderId: myId, receiverId: receiverId },
          { senderId: receiverId, receiverId: myId },
        ],
      })
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({
      success: false,
      message: "Error While Getting Messages",
      error: error.message,
    });
  }
};

// POST send a message (text or media)
export const sendMessage = async (req, res) => {
  try {
    const text = req.body?.text?.trim() || "";
    const media = req?.files?.media;
    const { id: receiverId } = req.params;
    const senderId = req.user._id.toString();

    const receiver = await userModel.findById(receiverId);
    if (!receiver) {
      return res.status(400).json({
        success: false,
        message: "Receiver ID is invalid",
      });
    }

    if (!text && !media) {
      return res.status(400).json({
        success: false,
        message: "Cannot send empty message",
      });
    }

    let mediaUrl = "";

    // Upload media if present
    if (media) {
      if (
        !media.mimetype.startsWith("image/") &&
        !media.mimetype.startsWith("video/")
      ) {
        return res.status(400).json({
          success: false,
          message: "Only image or video files are allowed",
        });
      }

      try {
        const uploadResponse = await cloudinary.uploader.upload(
          media.tempFilePath,
          {
            resource_type: "auto",
            folder: "CHAT_APP_MEDIA",
            transformation: [
              { width: 1080, height: 1080, crop: "limit" },
              { quality: "auto" },
              { fetch_format: "auto" },
            ],
          }
        );

        mediaUrl = uploadResponse?.secure_url;

        fs.unlink(media.tempFilePath, (err) => {
          if (err) console.error("Temp file cleanup failed:", err);
        });
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload media",
        });
      }
    }

    // Create and emit message
    const newMessage = await messageModel.create({
      senderId,
      receiverId,
      text,
      media: mediaUrl,
    });

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({
      success: false,
      message: "Error while sending message",
      error: error.message,
    });
  }
};

// 2
// import messageModel from "../models/messageModel.js";
// import userModel from "../models/userModel.js";
// import cloudinary from "../config/cloudinaryConfig.js";
// import { getReceiverSocketId, io } from "../utils/socket.js";
// import fs from "fs"; // ✅ Required for temp file deletion

// // --GET-- Get all users except the current user
// export const getAllUsers = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const filteredUsers = await userModel
//       .find({ _id: { $ne: userId } })
//       .select("-password");

//     return res.status(200).json({
//       success: true,
//       users: filteredUsers,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       message: "Users not found",
//       error: error.message,
//     });
//   }
// };

// // get messages
// export const getMessages = async (req, res) => {
//   try {
//     const receiverId = req.params.id.trim();
//     const myId = req.user._id;

//     const receiver = await userModel.findById(receiverId);
//     if (!receiver) {
//       return res.status(400).json({
//         success: false,
//         message: "Receiver Id Invalid",
//       });
//     }

//     const messages = await messageModel
//       .find({
//         $or: [
//           { senderId: myId, receiverId: receiverId },
//           { senderId: receiverId, receiverId: myId },
//         ],
//       })
//       .sort({ createdAt: 1 });

//     return res.status(200).json({
//       success: true,
//       messages,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       message: "Error While Getting Message",
//       error: error.message,
//     });
//   }
// };

// // --POST-- Send Message
// export const sendMessage = async (req, res) => {
//   try {
//     const text = req.body?.text?.trim() || "";
//     const media = req?.files?.media;
//     const { id: receiverId } = req.params;
//     const senderId = req.user._id.toString();

//     const receiver = await userModel.findById(receiverId);
//     if (!receiver) {
//       return res.status(400).json({
//         success: false,
//         message: "Receiver ID is invalid",
//       });
//     }

//     if (!text && !media) {
//       return res.status(400).json({
//         success: false,
//         message: "Cannot send empty message",
//       });
//     }

//     let mediaUrl = "";

//     try {
//       if (media) {
//         if (
//           !media.mimetype.startsWith("image/") &&
//           !media.mimetype.startsWith("video/")
//         ) {
//           return res.status(400).json({
//             success: false,
//             message: "Only image or video files are allowed",
//           });
//         }

//         const uploadResponse = await cloudinary.uploader.upload(
//           media.tempFilePath,
//           {
//             resource_type: "auto",
//             folder: "CHAT_APP_MEDIA",
//             transformation: [
//               { width: 1080, height: 1080, crop: "limit" },
//               { quality: "auto" },
//               { fetch_format: "auto" },
//             ],
//           }
//         );

//         mediaUrl = uploadResponse?.secure_url;

//         fs.unlink(media.tempFilePath, (err) => {
//           if (err) console.error("Temp file cleanup failed:", err);
//         });
//       }

//       const newMessage = await messageModel.create({
//         senderId,
//         receiverId,
//         text,
//         media: mediaUrl,
//       });

//       const receiverSocketId = getReceiverSocketId(receiverId);
//       if (receiverSocketId) {
//         io.to(receiverSocketId).emit("newMessage", newMessage);
//       }

//       return res.status(201).json({
//         success: true,
//         message: "Message sent successfully",
//         data: newMessage,
//       });
//     } catch (uploadError) {
//       console.error("Cloudinary upload error:", uploadError);
//       return res.status(500).json({
//         success: false,
//         message: "Failed to upload media. Please try again later.",
//       });
//     }
//   } catch (error) {
//     console.error("Send message error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error while sending message",
//       error: error.message,
//     });
//   }
// };

// 1
// import messageModel from "../models/messageModel.js";
// import userModel from "../models/userModel.js";
// import cloudinary from "../config/cloudinaryConfig.js";
// import { getReceiverSocketId, io } from "../utils/socket.js";

// // --GET-- Get all users except the current user
// export const getAllUsers = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const filteredUsers = await userModel
//       .find({ _id: { $ne: userId } })
//       .select("-password");

//     return res.status(200).json({
//       success: true,
//       users: filteredUsers,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       message: "Users not found",
//       error: error.message,
//     });
//   }
// };

// // get messages
// export const getMessages = async (req, res) => {
//   try {
//     const receiverId = req.params.id.trim();
//     const myId = req.user._id;

//     const receiver = await userModel.findById(receiverId);
//     if (!receiver) {
//       return res.status(400).json({
//         success: false,
//         message: "Receiver Id Invalid",
//       });
//     }

//     const messages = await messageModel
//       .find({
//         $or: [
//           { senderId: myId, receiverId: receiverId },
//           { senderId: receiverId, receiverId: myId },
//         ],
//       })
//       .sort({ createdAt: 1 });

//     return res.status(200).json({
//       success: true,
//       messages,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       message: "Error While Getting Message",
//       error: error.message,
//     });
//   }
// };

// // --POST-- Send Message
// export const sendMessage = async (req, res) => {
//   try {
//     const { text } = req.body;
//     const media = req?.files?.media;
//     const { id: receiverId } = req.params;
//     const senderId = req.user._id.toString();

//     // Check if receiver exists
//     const receiver = await userModel.findById(receiverId);
//     if (!receiver) {
//       return res.status(400).json({
//         success: false,
//         message: "Receiver ID is invalid",
//       });
//     }

//     // Sanitize and validate message
//     const sanitizedText = text?.trim() || "";
//     if (!sanitizedText && !media) {
//       return res.status(400).json({
//         success: false,
//         message: "Cannot send empty message",
//       });
//     }

//     let mediaUrl = "";

//     // Upload media if provided
//     try {
//       if (media) {
//         // Optional: Validate file type
//         if (
//           !media.mimetype.startsWith("image/") &&
//           !media.mimetype.startsWith("video/")
//         ) {
//           return res.status(400).json({
//             success: false,
//             message: "Only image or video files are allowed",
//           });
//         }

//         const uploadResponse = await cloudinary.uploader.upload(
//           media.tempFilePath,
//           {
//             resource_type: "auto",
//             folder: "CHAT_APP_MEDIA",
//             transformation: [
//               { width: 1080, height: 1080, crop: "limit" },
//               { quality: "auto" },
//               { fetch_format: "auto" },
//             ],
//           }
//         );

//         mediaUrl = uploadResponse?.secure_url;

//         // Optional: Delete temp file
//         fs.unlink(media.tempFilePath, (err) => {
//           if (err) console.error("Temp file cleanup failed:", err);
//         });
//       }

//       // Save message to DB
//       const newMessage = await messageModel.create({
//         senderId,
//         receiverId,
//         text: sanitizedText,
//         media: mediaUrl,
//       });

//       // Send real-time message via Socket.io
//       const receiverSocketId = getReceiverSocketId(receiverId);
//       if (receiverSocketId) {
//         io.to(receiverSocketId).emit("newMessage", newMessage);
//       }

//       return res.status(201).json({
//         success: true,
//         message: "Message sent successfully",
//         data: newMessage,
//       });
//     } catch (uploadError) {
//       console.error("Cloudinary upload error:", uploadError);
//       return res.status(500).json({
//         success: false,
//         message: "Failed to upload media. Please try again later.",
//       });
//     }
//   } catch (error) {
//     console.error("Send message error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error while sending message",
//       error: error.message,
//     });
//   }
// };
