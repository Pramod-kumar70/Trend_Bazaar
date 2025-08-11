const Cart = require('../models/Cart');

exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItemId = req.params.productId; // match with route

    const deletedItem = await Cart.findOneAndDelete({
      _id: cartItemId,  // cart ka document id
      userId
    });

    if (!deletedItem) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.json({ success: true, message: 'Item removed successfully' });
  } catch (error) {
    console.error("Error removing item:", error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
