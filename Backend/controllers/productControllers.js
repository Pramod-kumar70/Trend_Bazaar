var Product = require("../models/product");

// Home Page Data
const getAllProducts = async (req, res) => {
  try {
    const topTrendy = await Product.find({
      category: { $in: ["Electronics", "electronics"] }
    }).limit(7);

    const sports = await Product.find({
      category: { $in: ["Sports", "sports"] }
    }).limit(7);

    const TvData = await Product.find({category:{$in:["TV" ,"Tv", "tv"]}}).limit(7)

    const moreData = await Product.find({
      category: { $in: ["beauty", "food", "toys", "Fashion"] }
    }).limit(7);

    res.status(200).json({
      TopTrendy: topTrendy,
      sports: sports,
      MoreData: moreData,
      TvProduct:TvData
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// View All Page Data by Category
const getProductsByCategory = async (req, res) => {
  try {
    let categoryName = req.params.name.toLowerCase();

    // Map category name to database category values
    let categoryMap = {
      toptrendy: ["Electronics", "electronics"],
      sports: ["Sports", "sports"],
      moredata: ["beauty", "food", "toys", "Fashion"]
      
    };

    let categories = categoryMap[categoryName] || [];

    if (categories.length === 0) {
      return res.status(404).json({ message: "Invalid category name" });
    }

    const products = await Product.find({ category: { $in: categories } });

    res.status(200).json({ SearchedProduct: products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


var Product = require("../models/product");

// Related products by category
const getProductsByCategoryName = async (req, res) => {
  try {
    const category = req.params.category;

    if (!category) {
      return res.status(400).json({ success: false, message: "Category is required" });
    }

    const products = await Product.find({
      category: { $regex: new RegExp("^" + category + "$", "i") } // case-insensitive match
    });

    res.status(200).json({ success: true, products });
  } catch (err) {
    console.error("Error fetching products by category:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};



module.exports = {
  getAllProducts,
  getProductsByCategory , getProductsByCategoryName
};
