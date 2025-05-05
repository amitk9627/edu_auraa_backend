const { default: mongoose } = require("mongoose");

// Schema
const ImageSchema = new mongoose.Schema({
    id: { type: String, required:true},
    name: String,
    img: {
      data: Buffer,
      contentType: String,
    },
  });

  const ImageModel = mongoose.model("media image", ImageSchema);

  module.exports = ImageModel;