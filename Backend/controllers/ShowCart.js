const Cart = require("../models/Cart");


// 📌 Show Cart (Only logged-in user's cart)
exports.ShowCart = async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.user.id })
      .populate("productId", "name price thumbnail")
      .populate("userId", "name email");

    if (!cartItems.length) {
      return res.json({ success: true, user: null, items: [] });
    }

    res.json({
      success: true,
      user: {
        name: cartItems[0].userId.name,
        email: cartItems[0].userId.email
      },
      items: cartItems.map(item => ({
        _id: item._id,
        quantity: item.quantity,
        product: item.productId
      }))
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
