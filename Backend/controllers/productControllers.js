var Product = require("../models/product")

const getallproducts = async (req ,res) =>{

   try {
     const topTrendy = await Product.find({category:{$in:['Electronics' ,'electronics']}}).limit(7);



     
     const Sports = await Product.find({category:{$in:['Sports' , 'sports']}})
    const More = await Product.find({category:{$in:["beauty","food","toys","Fashion"]}})

     res.status(200).json({TopTrendy:topTrendy , sports : Sports , MoreData : More})
   } catch (err) {
    res.status(500).json({message:err})
    
   }
}
module.exports = getallproducts


