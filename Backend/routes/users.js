var express = require("express");
var router = express.Router();
var User = require("../models/users_table");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const JWT_Secret = "wertyu34567890poiuytrewq";

router.post("/register", async function (req, res) {
  try {
    const { name, email, password, profileImage } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required", success: false });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists", success: false });
    }

    // Password hash karna
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newuser = new User({
      name,
      email,
      password: hashedPassword,
      profileImage  // optional
    });

    const saveuser = await newuser.save();

    // JWT token generate karna (optional)
    const token = jwt.sign({ id: saveuser._id, email: saveuser.email }, JWT_Secret, {
      expiresIn: "1d",
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: saveuser._id,
        name: saveuser.name,
        email: saveuser.email,
        profileImage: saveuser.profileImage,
      },
      token,
      success: true,
    });
  } catch (error) {
    console.error("Register error", error);
    return res.status(500).json({ message: error.message, success: false });
  }
});

module.exports = router;

router.post("/login", async function (req, res) {
  try {
    const { email, password } = req.body;
    const user =await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User does't exits" });

    const token = jwt.sign({ _id: user._id, email: user.email }, JWT_Secret, {
      expiresIn: "7d",
    });

    return res
      .status(200)
      .json({ success: true, message: "User login successfully" ,token ,user });
  } catch (error) {
    console.error("Error in login", error);
    return res.status(500).json({ message: error.message, success: false });
  }
});

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_Secret);
    req.user = decoded; // attach user payload to request
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid token." });
  }
};



exports.getProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, "MY_SUPER_SECRET_KEY_123");
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, "MY_SUPER_SECRET_KEY_123");

    const updateData = {
      name: req.body.name,
      email: req.body.email
    };
    if (req.body.profileImage) {
      updateData.profileImage = req.body.profileImage;
    }

    const updatedUser = await User.findByIdAndUpdate(decoded.id, updateData, { new: true }).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


exports.updateProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, "MY_SUPER_SECRET_KEY_123");

    const updateData = {
      name: req.body.name,
      email: req.body.email
    };
    if (req.body.profileImage) {
      updateData.profileImage = req.body.profileImage;
    }

    const updatedUser = await User.findByIdAndUpdate(decoded.id, updateData, { new: true }).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = router;
