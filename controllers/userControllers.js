const User = require("../models/userModel")
const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");



const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic, skills, skillRating } = req.body
    
  if (!name || !email || !password || !skills || !skillRating) {
        res.status(400);
        throw new Error("Please Enter all the Feilds");
  };

  const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
  };

  const user = await User.create({
    name,
    email,
    password,
    pic,
    skills,
    skillRating,
  });
  
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            skills: user.skills,
            skillRating: user.skillRating,
            token: generateToken(user._id),
        });
    }
    else {
        res.status(400);
        throw new Error("Failed to create User");
    }
});





// ---------------------------------------------------Authenticalte user--------------------------------------------------------------





const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }); //cheks if the email is present in the database or not


  //if user exist (based on email) then it checks the password
  if (user && (await user.matchPassword(password))) { //this function sends password to brypt to match the password in User model
        res.json({
            _id: user._id,             //this json will be used when we deal with frontend and want to show these values on frontend
            name: user.name,
            email: user.email,
            pic: user.pic,
            skills: user.skills,
            skillRating: user.skillRating,
            token: generateToken(user._id),
        })
    }
    else {
        res.send(401);
        throw new Error("Invalid Email or Password");
    }
})







//------------------------------------- search user based on their name and email and skills------------------------------------------//





//  /api/user?search=priyanshu

const allUsers = asyncHandler(async (req, res) => {

  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
          { skills: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword)
    .find({ _id: { $ne: req.user._id } })
    .sort({ skillRating: "desc"});
  res.send(users);
});





//----------------------------------Update The Profile of The User-----------------------------------------------------------------------//



const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, pic, skills, skillRating } = req.body;


      const update = {
        name: name,
        pic: pic,
        skills: skills,
        skillRating: skillRating
      };
      const filter = { email: email };
      const user = await User.findOneAndUpdate(filter, update, {
        new: true,
      });

      if (user) {
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          pic: user.pic,
          skills: user.skills,
          skillRating: user.skillRating,
          token: generateToken(user._id),
        });
      } else {
        res.status(400);
        throw new Error("Failed to create User");
      }
})









module.exports = { registerUser, authUser, allUsers, updateProfile};