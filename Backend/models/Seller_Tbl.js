var mongoose = require('mongoose');

var SellerSchema = new mongoose.Schema({
    fullname: { type: String, required: true, trim: true },
    businessName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    businessAddress: { type: String, required: true, trim: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Products" }], // 🔹 Added products array
    createdAt: { type: Date, default: Date.now }
}, { collection: "SellerTable", timestamps: true });

module.exports = mongoose.model("SellerModel", SellerSchema);
