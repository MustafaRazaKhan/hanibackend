
const express = require("express");
const app = express();
const path = require("path");

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const categoryRoute = require("./routes/categoryRoute");
const productRoute = require("./routes/productRoute");
const imageRoute = require("./routes/imagesRoute");
const cartRoute = require("./routes/cartRoute");
dotenv.config();
app.use(express.json());
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static("uploads"));
app.use("/images", express.static("images"));

// todo json middleware app.use(json());
app.use(cors());
// ! data base connetion
const dbConnect = async () => {
  // mongodb+srv://mrkec_243122:<db_password>@cluster0.j5hwsil.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
  try {
    const res = await mongoose.connect(
      "mongodb+srv://mrkec_243122:mrkec_243122@cluster0.j5hwsil.mongodb.net/hanigolds?retryWrites=true&w=majority&appName=Cluster0"
    );
    if (res) {
      console.log("connection is sucessfully connected");
    }
  } catch (error) {
    console.log(error.message);
  }
};
dbConnect();

// todo all routes
app.use("/api/auth", authRoute);
// todo user routes
app.use("/api/user", userRoute);
// ? category routees
app.use("/api/category", categoryRoute);
// ! product routes
app.use("/api/product", productRoute);
// ? all images routes
app.use("/api/image", imageRoute);
// ! add to cart routes
app.use("/api/cart", cartRoute);

// todo for live server checking
app.get("/get", (req, res) => {
  res.status(200).send("<h1>Server is running</h1>");
});

// ? port is listening
const PORT = process.env.PORT || 8080;

app.listen(PORT, (req, res) => {
  console.log("server is running");
});
