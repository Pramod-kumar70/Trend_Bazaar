// controllers/ViewAllController.js

var Product = require("../models/product");

const ViewAllProducts = async (req, res) => {
  try {
    const { category } = req.params;
    const { minPrice, maxPrice, sort } = req.query;

    let query = {};

    if (category.toLowerCase() === "toptrendy") {
      query.category = { $in: ["Electronics", "electronics"] };
    } else if (category.toLowerCase() === "sports") {
      query.category = { $in: ["Sports", "sports"] };
    } else if (category.toLowerCase() === "moredata") {
      query.category = { $in: ["beauty", "food", "toys", "Fashion"] };
    }

    if (minPrice && maxPrice) {
      query.price = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
    }

    let products = await Product.find(query);

    if (sort === "lowToHigh") {
      products = products.sort((a, b) => a.price - b.price);
    } else if (sort === "highToLow") {
      products = products.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      products = products.sort((a, b) => b.rating - a.rating);
    }

    res.status(200).json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching category products" });
  }
};

module.exports = ViewAllProducts;
