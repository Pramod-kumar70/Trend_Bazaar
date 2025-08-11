const SellerModel = require("../models/Seller_Tbl");

const getSellerProducts = async (req, res) => {
    try {
        const { sellerId } = req.params;

        // Seller को products के साथ populate करो
        const seller = await SellerModel.findById(sellerId).populate("products");

        if (!seller) {
            return res.status(404).json({ message: "Seller not found" });
        }

        res.status(200).json({
            sellerDetails: {
                id: seller._id,
                fullname: seller.fullname,
                businessName: seller.businessName,
                email: seller.email,
                phone: seller.phone
            },
            products: seller.products
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { getSellerProducts };
