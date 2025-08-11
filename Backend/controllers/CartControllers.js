
const Cart = require("../models/Cart");
const Product = require("../models/product")

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    // Check agar product already cart me hai
    let cartItem = await Cart.findOne({ userId, productId });

    if (cartItem) {
      return res.status(200).json({
        success: true,
        message: "Product already in cart",
        alreadyInCart: true
      });
    }

    // Naya entry create karo
    cartItem = new Cart({
      userId,
      productId,
      quantity: quantity || 1
    });
    await cartItem.save();

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      alreadyInCart: false
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
