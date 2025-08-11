const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "AuthModel", required: true }, // ✅ match kiya
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Products", required: true }, // ✅ already correct
  quantity: { type: Number, default: 1 }
});

module.exports = mongoose.model("Cart", cartSchema);
