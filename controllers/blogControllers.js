const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Blog = require("../models/blogModel");



const allBlogs = asyncHandler(async (req, res) => {
    
    if (req.query.search) {
        const keyword = req.query.search
          ? {
              $or: [{ title: { $regex: req.query.search, $options: "i" } }],
            }
          : {};

        const blogs = await Blog.find(keyword)
          .sort({ createdAt: -1 })
          .populate("user", "-password");;
        res.send(blogs);
    }
    else {
        const blog = await Blog.find()
          .sort({ createdAt: -1 })
          .populate("user", "-password");
        res.send(blog);
    }
});


const composeBlog = asyncHandler(async (req, res) => {
    const { title, postContent, user } = req.body;

    var newBlog = {
    "user": user._id,
    "title": title,
    "postContent": postContent
    }

    try {
        const blog = await Blog.create(newBlog);
        res.json(blog);
    }
    catch (error) {
        res.status(400);
    }    
})

const deleteBlog = asyncHandler(async (req, res) => {
    const { blogId }  = req.body;
    console.log(blogId);
    
    try {
      const blog = await Blog.findByIdAndDelete(blogId);
      res.send(blog);
    } catch (error) {
      res.status(400);
    }    
})


module.exports = {
    allBlogs,
    composeBlog,
    deleteBlog,
    
};
