const express = require("express");
const { addToCart } = require("../controllers/CartControllers");
const { verifyToken } = require("../Middleware/AuthMiddleware");
const {ShowCart} = require("../controllers/ShowCart");
const { removeFromCart } = require("../controllers/RemoveCartItem");
const router = express.Router();

router.post("/add", verifyToken, addToCart);
router.get("/" ,verifyToken,  ShowCart)
router.delete("/remove/:productId", verifyToken, removeFromCart);


module.exports = router;
