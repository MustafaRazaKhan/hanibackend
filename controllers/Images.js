const multer = require("multer");
const path = require("path");
const Image = require("../models/Image");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "images/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// todo Initialize multer with the storage configuration
const images = multer({ storage: storage }).single("imagePaths", 1); // Allow up to 10 photos

const addImageController = async (req, res) => {
 
  try {
    const filePath = req.file ? req.file.path : ''; 
    const newImage = new Image({
      imagePaths: filePath, // Store the file paths in the database
    });

    const savedImage = await newImage.save();
    res.status(201).json({
      success: true,
      msg: "Images added successfully!",
      savedImage,
    });
  } catch (error) {
    if (error instanceof multer.MulterError) {
      // Handle multer-specific errors
      return res
        .status(400)
        .json({ success: false, msg: "Multer error occurred" });
    }
    res.status(500).json({ success: false, msg: "Server error", error });
  }
};

const imagesController = async (req, res) => {
  try {
    const allImages = await Image.find({});
    if (allImages) {
      return res.status(200).send({
        success: true,
        msg: "allImages get Successfully!",
        allImages,
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      msg: "Server error: " + error.message,
    });
  }
};
const deleteController = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the product by ID to get the file path
    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).json({ success: false, msg: "image not found" });
    }

    // Delete the file from the upload folder if it exists
    if (image.imagePaths) {
      const filePath = path.join(__dirname, "..", image.imagePaths);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Remove the product from MongoDB
    await Image.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      msg: "image and associated file deleted successfully!",
    });
  } catch (error) {
 
    
    res.status(500).json({ success: false, msg: "Server error: " + error.message });
  }
};
module.exports = {
  addImageController,
  imagesController,
  deleteController,
  images,
};
