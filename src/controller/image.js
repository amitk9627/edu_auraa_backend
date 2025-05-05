const multer = require("multer");
const ImageModel = require("../model/image");

const uploadImage = async (req, res) => {
  try {
    
    if (!req.file || !req.params.id) {
      console.log("Missing file or id. No file uploaded")
      return res
      .status(400)
      .json({ success: false, message: "Missing file or id. No file uploaded" });
    }
    console.log("File received:", req.file.originalname); // ✅ Debug log

    const newImage = new ImageModel({
      id: req.params.id,
      name: req.file.originalname,
      img: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });

    await newImage.save();
    console.log("Image saved:", newImage.name); // ✅ Confirm DB save

    res.json({ success: true, message: "Image uploaded successfully" });
  } catch (err) {
    console.error("Upload error:", err); // ✅ Error log
    res.status(500).json({ success: false, message: err.message });
  }
};

const getImage = async (req, res) => {
    try {
      const images = await ImageModel.find({id: req.params.id});
  
      const imageList = images.map((img) => ({
        id: img._id,
        name: img.name,
        contentType: img.img.contentType,
        base64: img.img.data.toString("base64"),
      }));

      if (imageList.length == 0) {
        return res.status(404).json({ success: false, message: "Image not found" });
      }
  
      // res.set("Content-Type", image.img.contentType);
      // res.send(image.img.data);

      res.json({ success: true, images: imageList });

    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  const deleteImage = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedImage = await ImageModel.findByIdAndDelete(id);
  
      if (!deletedImage) {
        return res.status(404).json({ success: false, message: "Image not found" });
      }
  
      res.json({ success: true, message: "Image deleted successfully" });
    } catch (err) {
      console.error("Delete error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  };
  
module.exports = { uploadImage, getImage, deleteImage };
