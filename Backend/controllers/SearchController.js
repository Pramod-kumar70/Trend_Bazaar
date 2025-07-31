const AllProduct = require('../models/product');

const SearchProductByName = async (req, res) => {
    const { name } = req.params;

    try {
        if (!name) {
            return res.status(400).json({ message: "ProductName is required in params." });
        }

        
        const Item = await AllProduct.find({
            category: { $regex: name, $options: 'i' }
        });

        res.status(200).json({ SearchedProduct: Item });
    } catch (error) {
        console.error("SearchProductByName error:", error);
        res.status(500).json({
            message: "Error occurred while searching for product by name.",
            error: error.message
        });
    }
};

module.exports = SearchProductByName;
