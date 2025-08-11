const Product = require("../models/product");

// controllers/productController.js mein addProduct function update karo

const SellerModel = require("../models/Seller_Tbl");

exports.addProduct = async (req, res) => {
  try {
    const {
      title, price, category, section, thumbnail, rating, ActualPrice,
      Offer, display, smartfeatures, appsSupport, specification, brand,
      stock, warranty, highlights, tags, offerAvailable, seller,
    } = req.body;

    if (!seller) {
      return res.status(400).json({ message: "Seller is required" });
    }

    const newProduct = new Product({
      title,
      price,
      category,
      section,
      thumbnail,
      rating,
      ActualPrice,
      Offer,
      display,
      smartfeatures,
      appsSupport,
      specification,
      brand,
      stock,
      warranty,
      highlights,
      tags,
      offerAvailable,
      seller,
    });

    const savedProduct = await newProduct.save();

    // Update seller document: push product id into products array
    await SellerModel.findByIdAndUpdate(seller, {
      $push: { products: savedProduct._id }
    });

    res.status(201).json({ message: "Product added successfully", product: savedProduct });
  } catch (err) {
    console.error("Error in addProduct:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.getSellerWithProducts = async (req, res) => {
    try {
        const { sellerId } = req.params;

        const sellerData = await SellerModel.findById(sellerId).populate("products");

        if (!sellerData) {
            return res.status(404).json({ success: false, message: "Seller not found" });
        }

        res.json({ success: true, seller: sellerData });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
