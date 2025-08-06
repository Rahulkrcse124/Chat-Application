import express from "express";
const router = express.Router();
import { isAuthenticated } from "../middleware/authMiddleware.js";
import {
  getAllUsers,
  getMessages,
  sendMessage,
} from "../controllers/messageController.js";

router.get("/users", isAuthenticated, getAllUsers);
router.get("/:id", isAuthenticated, getMessages);

router.post("/send/:id", isAuthenticated, sendMessage);

export default router;
