var express = require('express');
var router = express.Router();

var { getAllProducts, getProductsByCategory, getProductsByCategoryName } = require('../controllers/productControllers');
var getParticularDataById = require('../controllers/ParticularDataByID');
var SearchProductByName = require('../controllers/SearchController');
var SearchedProductControllers = require("../controllers/SearchedProductControllers");

// Home page (TopTrendy, Sports, MoreData)
router.get('/', getAllProducts);

// View All by category (toptrendy, sports, moredata)
router.get('/viewall/:name', getProductsByCategory);

// Product details by ID (single product)
router.get('/:id', getParticularDataById);

// Search by product name
router.get('/find/:name', SearchProductByName);

// Search product details by name & id
router.get('/find/:name/:id', SearchedProductControllers);

router.get('/viewall/:category', getProductsByCategory);

router.get("/category/:category", getProductsByCategoryName);

module.exports = router;
