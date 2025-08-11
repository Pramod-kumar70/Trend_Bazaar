const jwt = require("jsonwebtoken");
// Yahan direct secret key define kar do
JWT_SECRET = "wertyu34567890poiuytrewq";

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ success: false, message: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(403).json({ success: false, message: "Invalid token" });
    req.user = decoded;
     req.user.id = decoded.id || decoded._id;
    next();
  });
};
