var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var ProductSchema = new Schema({ name:String ,price:Number,category:String ,offer:String },{collection:'FlipKart',timestamps:true});

module.exports = mongoose.model("Products" , ProductSchema)