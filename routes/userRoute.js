const express = require("express");
const {
  usersController,
  userController,
  userUpdateController,
  userDeleteController,
} = require("../controllers/User");
const router = express.Router(); // Corrected this line

// todo register a new user

router.get("/users", usersController);
router.get("/singleuser/:id", userController);
router.patch("/updateuser/:id", userUpdateController);
router.delete("/deleteuser/:id", userDeleteController);

module.exports = router;
