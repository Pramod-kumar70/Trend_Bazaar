// controllers/SearchController.js

var Product = require("../models/product");

const SearchProductByName = async (req, res) => {
  try {
    const { name } = req.params;
    const { minPrice, maxPrice, sort } = req.query; // filters

    let query = {};

    // "all" ho to filter na lagao, warna multi-field search lagao
    if (name && name.toLowerCase() !== "all") {
      query.$or = [
        { title: { $regex: name, $options: "i" } },
        { brand: { $regex: name, $options: "i" } },
        { category: { $regex: name, $options: "i" } },
        { tags: { $regex: name, $options: "i" } },
      ];
    }

    // Price filter
    if (minPrice && maxPrice) {
      query.price = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
    }

    let products = await Product.find(query);

    // Sorting
    if (sort === "lowToHigh") {
      products = products.sort((a, b) => a.price - b.price);
    } else if (sort === "highToLow") {
      products = products.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      products = products.sort((a, b) => b.rating - a.rating);
    }

    res.status(200).json({ SearchedProduct: products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching products" });
  }
};

module.exports = SearchProductByName;
