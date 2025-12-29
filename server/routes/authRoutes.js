import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";

const router = express.Router();

// Multer (store file temporarily)
const storage = multer.diskStorage({});
const upload = multer({ storage });

// 🧩 SIGNUP
router.post("/signup", upload.single("profilePhoto"), async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      confirmPassword,
      mobileNumber,
      collegeId,
      department,
      year,
      role,
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    let profilePhotoUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "college_event_profiles",
      });
      profilePhotoUrl = result.secure_url;
    }

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      mobileNumber,
      collegeId,
      department,
      year,
      role,
      profilePhoto: profilePhotoUrl,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

// 🧩 LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
