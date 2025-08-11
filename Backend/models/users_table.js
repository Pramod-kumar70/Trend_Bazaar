var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String } // ✅ Cloudinary ka image URL store karega
  },
  { collection: "Auth", timestamps: true }
);

module.exports = mongoose.model("AuthModel", userSchema);
