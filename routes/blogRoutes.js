const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {allBlogs, composeBlog, deleteBlog} = require("../controllers/blogControllers")


const router = express.Router();

router.route("/").get(allBlogs);
router.route("/compose").post(composeBlog);
router.route("/deleteblog").post(deleteBlog);




module.exports = router;