const Seller = require("../models/Seller_Tbl");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET || "default_secret";

const loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;

    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    if (!seller.password) {
      return res.status(400).json({ message: "Password not set for this account" });
    }

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: seller._id }, SECRET_KEY, { expiresIn: "7d" });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: seller._id,
        fullname: seller.fullname,
        email: seller.email,
        businessName: seller.businessName
      }
    });
  } catch (error) {
    console.error("Error in loginSeller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = loginSeller;
