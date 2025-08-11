const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  section: { type: String }, // e.g. "Best of Electronics"
  thumbnail: { type: String }, // Image URL
  rating: { type: Number, default: 0 },
  ActualPrice: { type: Number },
  Offer: { type: Number }, // e.g. 25 for 25% off

  // Nested display object
  display: {
    resolution: { type: String },
    screensize: { type: String }
  },

  // Nested smart features
  smartfeatures: {
    os: { type: String }
  },

  // Apps support (array of strings)
  appsSupport: [{ type: String }],

  // Specifications
  specification: {
    color: { type: String },
    lunchYear: { type: String }
  },
   seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SellerModel",
    required: true
  },

  // Offers available (array of objects)
  offerAvailable: [
    {
      name: { type: String }
      // You can add more fields if needed inside each offer
    }
  ]
},
{
  collection: 'FlipKart',
  timestamps: true
});

module.exports = mongoose.model('Products', ProductSchema);
