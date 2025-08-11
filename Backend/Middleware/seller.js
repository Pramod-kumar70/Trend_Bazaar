const jwt = require("jsonwebtoken");
const Seller = require("../models/Seller_Tbl");

const JWT_SECRET = process.env.JWT_SECRET || "wertyu34567890poiuytrewq";

exports.SellerAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ success: false, message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Optionally DB से verify
    const seller = await Seller.findById(decoded.id || decoded._id).select("-password");
    if (!seller)
      return res.status(404).json({ success: false, message: "Seller not found" });

    req.user = seller;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
};
