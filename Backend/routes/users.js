const express = require("express");
const router = express.Router();
const User = require("../models/users_table");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_Secret = "wertyu34567890poiuytrewq"; // Ek hi key use hogi sab jagah

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, profileImage } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required", success: false });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists", success: false });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      profileImage
    });

    const savedUser = await newUser.save();

    const token = jwt.sign({ id: savedUser._id, email: savedUser.email }, JWT_Secret, {
      expiresIn: "1d",
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        profileImage: savedUser.profileImage,
      },
      token,
      success: true,
    });
  } catch (error) {
    console.error("Register error", error);
    return res.status(500).json({ message: error.message, success: false });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User doesn't exist" });

   

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_Secret, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      success: true,
      message: "User login successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error("Login error", error);
    return res.status(500).json({ message: error.message, success: false });
  }
});

// Middleware
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });

  try {
    const decoded = jwt.verify(token, JWT_Secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid token." });
  }
};


router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update Profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const updateData = {};
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.email) updateData.email = req.body.email;
    if (req.body.phone) updateData.phone = req.body.phone;
    if (req.body.address) updateData.address = req.body.address;
    if (req.body.profileImage) updateData.profileImage = req.body.profileImage;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.put("/change-password", authMiddleware, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});





// Google register
router.post("/google-register", async (req, res) => {
  try {
    const { name, email, photo } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name,
        email,
        password: "google-oauth",   // 👈 required hai, to ek dummy string dal do
        profileImage: photo         // 👈 photo ko profileImage mein map karo
      });
      await user.save();
    }

    // ✅ JWT token generate karte hain
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "mySecretKey",
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Google signup success",
      user,
      token
    });
  } catch (error) {
    console.error("Google signup error:", error);
    return res.status(500).json({
      message: "Error in Google signup",
      error: error.message
    });
  }
});






// Google Login
router.post("/google-login", async (req, res) => {
  try {
    const { name, email, photo } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required", success: false });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Agar user nahi hai toh naya bana do
      user = new User({
        name: name || "Google User",
        email,
        password: "google-oauth",  // dummy password
        profileImage: photo || ""
      });
      await user.save();
    }

    // JWT token generate karo
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_Secret,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Google login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage
      },
      token
    });
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({
      success: false,
      message: "Error in Google login",
      error: error.message
    });
  }
});














module.exports = router;


