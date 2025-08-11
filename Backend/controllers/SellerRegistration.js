const Seller = require("../models/Seller_Tbl");
const bcrypt = require("bcryptjs");

const SellerReg = async (req, res) => {
    try {
        const { fullname, businessName, email, phone, businessAddress, password } = req.body;

        // ✅ Basic Validation
        if (!fullname || !businessName || !email || !phone || !businessAddress || !password) {
            return res.status(400).json({ message: "⚠ All fields are required!" });
        }

        // ✅ Check if seller already exists
        const existingSeller = await Seller.findOne({ email });
        if (existingSeller) {
            return res.status(400).json({ message: "❌ Email is already registered!" });
        }

        // ✅ Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Save seller
        const newSeller = new Seller({
            fullname,
            businessName,
            email,
            phone,
            businessAddress,
            password: hashedPassword
        });

        await newSeller.save();

        return res.status(201).json({
            message: "✅ Seller registered successfully!",
            seller: { ...newSeller._doc, password: undefined } // password hide
        });

    } catch (error) {
        console.error("Error registering seller:", error);
        return res.status(500).json({ message: "❌ Server error", error: error.message });
    }
};

module.exports = SellerReg;
