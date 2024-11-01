const multer = require("multer");
const path = require("path");
const Product = require("../models/Product");
const fs = require("fs"); // todo Adjust the import based on your project structure
// !Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/";
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
const upload = multer({ storage: storage }).single("photoPaths", 1); // !Allow up to 10 photos

// ? Controller to handle the product addition
const addProductController = async (req, res) => {
  try {
    // todo Destructure the incoming data from the body
    const {
      category,
      subCategory,
      designName,
      grossWeight,
      netWeight,
      description,
      price,
    } = req.body;
    // ? Access the file sent from the frontend
    const filePath = req.file ? req.file.path : '';  // ? Handles the file path
    // ! Log to confirm values
    // todo console.log({ category, subCategory, designName, grossWeight, netWeight, description, price });
    // ! console.log(req.file); //  Logs the uploaded file details

    // todo  Create a new product instance
    const newProduct = new Product({
      category,
      subCategory,
      designName,
      grossWeight,
      netWeight,
      description,
      price,
      photoPaths: filePath, // ? Store the single file path
    });

    // todo Save the product to the database
    const savedProduct = await newProduct.save();

    // ! Return a success response
    res.status(201).json({
      success: true,
      msg: "Product added successfully!",
      savedProduct,
    });
  } catch (error) {
    
    res.status(500).json({ error: error.message });
  }
};
// ? get all the Products
const productsController = async (req, res) => {
  try {
    const allProduct = await Product.find({});
    if (allProduct) {
      return res.status(200).send({
        success: true,
        msg: "allProduct get Successfully!",
        allProduct,
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      msg: "Server error: " + error.message,
    });
  }
};
const goldController = async (req, res) => {
  try {
    const goldProducts = await Product.find({ category: "gold" });
    if (goldProducts) {
      return res.status(200).send({
        success: true,
        msg: "Gold products retrieved successfully!",
        goldProducts,
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      msg: "Server error: " + error.message,
    });
  }
};

const silverController = async (req, res) => {
  try {
    const silverProducts = await Product.find({ category: "silver" });
  ; // Corrected to log silverProduct
    if (silverProducts) {
      return res.status(200).send({
        success: true,
        msg: "Silver products retrieved successfully!",
        silverProducts,
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      msg: "Server error: " + error.message,
    });
  }
};

// todo filter product based on particular category
const categoryController = async (req, res) => {
  try {
    const { category } = req.params;

    // Group products by subcategory and count the number of products in each subcategory
    const groupedProducts = await Product.aggregate([
      { $match: { category } }, // Match products by category
      { $group: { _id: "$subCategory", count: { $sum: 1 } } }, // Group by subcategory and sum the count
    ]);

    if (!groupedProducts.length) {
      return res
        .status(404)
        .json({ success: false, msg: "No products found for this category" });
    }

    res.status(200).json({
      success: true,
      groupedProducts, // Return the grouped products with the sum of each subcategory
    });
  } catch (error) {

    res.status(500).json({ success: false, msg: "Server error" });
  }
};
const subCategoryController = async (req, res) => {
  try {
    const subcategory = req.params.subcategory;

    // todo Group products by subcategory and count the number of products in each subcategory
    const filterSub = await Product.find({
      subCategory: subcategory,
    });

    if (!filterSub.length) {
      return res
        .status(404)
        .json({ success: false, msg: "No products found for this category" });
    }

    res.status(200).json({
      success: true,
      filterSub, //  todo Return the grouped products with the sum of each subcategory
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};
const singleProductController = async (req, res) => {
  try {
    const id = req.params.id;
   
   

    // ! Group products by subcategory and count the number of products in each subcategory
    const product = await Product.findOne({
      _id: id,
    });
    res.status(200).json({
      success: true,
      product, // Return the grouped products with the sum of each subcategory
    });
  } catch (error) {

    res.status(500).json({ success: false, msg: "Server error" });
  }
};
const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;
    // Find the product by ID to get the file path
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, msg: "Product not found" });
    }

    // Delete the file from the upload folder if it exists
    if (product.photoPaths) {
      const filePath = path.join(__dirname, "..", product.photoPaths);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Remove the product from MongoDB
    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      msg: "Product and associated file deleted successfully!",
    });
  } catch (error) {

    res.status(500).json({ success: false, msg: "Server error: " + error.message });
  }
};

// Export the delete controller


// ? Export the controller and multer middleware
module.exports = {
  upload,
  addProductController,
  productsController,
  categoryController,
  subCategoryController,
  singleProductController,
  silverController,
  goldController,deleteProductController
};
