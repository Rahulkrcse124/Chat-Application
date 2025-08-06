import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated! Please login",
      });
    }

    // Verify token
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decode) {
      return res.status(401).json({
        success: false,
        message: "Token verification failed! Please login again",
      });
    }

    // Attach user to request
    const user = await userModel.findById(decode.id); // ✅ Correct usage
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Auth Error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication error",
      error: error.message,
    });
  }
};