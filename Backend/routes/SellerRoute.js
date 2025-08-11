var express = require('express')
const router = express.Router()
const SellerReg = require('../controllers/SellerRegistration');
const loginSeller = require('../controllers/SellerLogin');
const { addProduct  } = require('../controllers/SellerAddProduct');
const { getSellerProducts } = require('../controllers/SellerProductController');





router.post('/register' , SellerReg)
router.post("/login", loginSeller);
router.get("/dashboard/:sellerId", getSellerProducts);

router.post("/SellerAddProduct", addProduct);


module.exports = router