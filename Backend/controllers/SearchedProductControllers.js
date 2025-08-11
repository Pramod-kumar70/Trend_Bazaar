var Product  = require("../models/product")

const SearchedProductControllers =async (req ,res) =>{

    const {id} = req.params;

    try {

        const temp = await Product.findById(id)
        res.status(200).json({Data:temp})

        
    } catch (error) {
        res.status(500).json({message:error.message})
        
    }


}

module.exports = SearchedProductControllers