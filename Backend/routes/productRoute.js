var express = require('express');
var router = express.Router();
var getallproducts = require('../controllers/productControllers')
var getParticularDataById = require('../controllers/ParticularDataByID');
const SearchProductByName = require('../controllers/SearchController');




router.get('/' , getallproducts)
router.get('/:id' ,getParticularDataById)
router.get('/find/:name' , SearchProductByName)

module.exports = router;