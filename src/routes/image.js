const multer = require("multer");
const { uploadImage, getImage, deleteImage } = require("../controller/image");
const express = require("express")
const router = express.Router()
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/uploadImage/:id", upload.single("image"), uploadImage);
router.get("/getImage/:id", getImage);
router.delete("/deleteImage/:id", deleteImage);

module.exports = router