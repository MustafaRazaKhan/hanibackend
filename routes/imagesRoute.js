const express = require("express");
const {
  images,
  addImageController,
  imagesController,
  deleteController,
} = require("../controllers/Images");
const router = express.Router();

// Route for adding a new product with photo uploads
router.post("/add", images, addImageController); // Using the same endpoint for upload and creation
router.get("/images", imagesController); // Using the same endpoint for upload and creation
router.delete("/delete/:id", deleteController); // Using the same endpoint for upload and creation

module.exports = router;
