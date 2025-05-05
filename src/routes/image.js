const multer = require("multer");
const { uploadImage, getImage } = require("../controller/image");
const express = require("express")
const router = express.Router()
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/uploadImage/:id", upload.single("image"), uploadImage);
router.get("/getImage/:id", getImage);

module.exports = router