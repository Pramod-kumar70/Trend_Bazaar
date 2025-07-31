var Product = require("../models/product")

const getProductById = async (req ,res) =>{

    const {id} = req.params;

   try {
     const ParticularProduct = await Product.findById(id);
     res.status(200).json({ParticularProduct})
   } catch (error) {

    res.status(500).json({message:"Error found in Particular id" ,error})
    
   }
    


}

module.exports = getProductById