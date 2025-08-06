import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinaryConfig.js";
import { generateJwtToken } from "../utils/jwtToken.js";

// Create new user ----signUp---
export const signUp = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Field validation
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    //  Password length check
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    //  Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    //  Check if email already exists
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //  Create user
    const user = new userModel({
      fullName,
      email,
      password: hashedPassword,
      avatar: {
        public_id: "",
        url: "",
      },
    });

    await user.save();

    //  Generate JWT token
    generateJwtToken(user, "User registered successfully", 201, res);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
      error: error.message,
    });
  }
};

// signIn --(login)--
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found, please register your email",
      });
    }

    // match password
    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    //return the result of token generator
    return generateJwtToken(user, "User login Successfully", 200, res);
  } catch (error) {
    console.log("Error while login", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while login",
      error: error.message,
    });
  }
};

// signOut-- (Logout)-- second method
export const signOut = async (req, res) => {
  try {
    // Clear the JWT cookie
    res.clearCookie("token", {
      httpOnly: true,
      maxAge: 0,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development" ? true : false,
    });

    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("Error while logout:", error);
    return res.status(500).json({
      success: false,
      message: "Logout failed. Please try again.",
      error: error.message,
    });
  }
};

// getuser
export const getUser = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({
      success: true,
      message: "User found successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while getting user",
    });
  }
};

// update profile
export const updateProfile = async (req, res) => {
  try {
    const { fullName, email } = req.body;

    if (fullName?.trim().length === 0 || email?.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Fullname and Email cant be empty",
      });
    }

    const avatar = req?.files?.avatar;
    let cloudinaryResponse = {};

    if (avatar) {
      try {
        const oldAvatarPublicId = req.user?.avatar?.public_id;
        if (oldAvatarPublicId && oldAvatarPublicId.length > 0) {
          await cloudinary.uploader.destroy(oldAvatarPublicId);
        }

        cloudinaryResponse = await cloudinary.uploader.upload(
          avatar.tempFilePath,
          {
            folder: "CHAT_APP_USERS_AVATARS",
            transformation: [
              { width: 300, height: 300, crop: "limit" },
              { quality: "auto" },
              { fetch_format: "auto" },
            ],
          }
        );
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        return res.status(500).json({
          success: false,
          message: "failed to upload avatar . please try again later",
        });
      }
    }
    let data = { fullName, email };

    if (
      avatar &&
      cloudinaryResponse?.public_id &&
      cloudinaryResponse?.secure_url
    ) {
      data.avatar = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      };
    }
    let user = await userModel.findByIdAndUpdate(req.user._id, data, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in avatar",
      error: error.message,
    });
  }
};
