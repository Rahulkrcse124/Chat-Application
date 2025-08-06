import express from "express";
const router = express.Router();
import { isAuthenticated } from "../middleware/authMiddleware.js";

import {
  signUp,
  signIn,
  signOut,
  getUser,
  updateProfile,
} from "../controllers/userController.js";

//POST:  create new account(signup)
router.post("/sign-up", signUp);

// POST:  sign in ---Login--
router.post("/sign-in", signIn);

// GET: sign out or logout
router.get("/sign-out", isAuthenticated, signOut);
// router.post("/sign-out", isAuthenticated, signOut);

//GET: getuser
router.get("/me", isAuthenticated, getUser);

//UPDATE: update profile
router.put("/update-profile", isAuthenticated, updateProfile);

export default router;
