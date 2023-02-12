const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  updateProfile
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();



router.route("/").get(protect, allUsers);
router.route("/").post(registerUser);
router.route("/updateprofile").put(protect, updateProfile)
router.post("/login", authUser);

module.exports = router;
