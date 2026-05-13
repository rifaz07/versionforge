const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/userModel");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

//Signup
async function signup(req, res) {
  const { username, password, email } = req.body;

  try {
    if (!username || !password || !email) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email: email.toLowerCase() }] });
    if (existingUser) {
      return res.status(400).json({ message: "Username or email already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const result = await newUser.save();

    const token = jwt.sign(
      { id: result._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    return res.status(201).json({ token, userId: result._id });
  } catch (err) {
    console.error("Error during signup:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
}

//Login
async function login(req, res) {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    return res.json({ token, userId: user._id });
  } catch (err) {
    console.error("Error during login:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
}

//Get All Users
async function getAllUsers(req, res) {
  try {
    const users = await User.find({}).select("-password").lean();
    return res.json(users);
  } catch (err) {
    console.error("Error during fetching:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
}

//Get User Profile
async function getUserProfile(req, res) {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ message: "Invalid User ID!" });
  }

  try {
    const user = await User.findById(id).select("-password").lean();

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    return res.json(user);
  } catch (err) {
    console.error("Error during fetching:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
}

//Update User Profile
async function updateUserProfile(req, res) {
  const { id } = req.params;
  const { email, password } = req.body;

  if (!isValidId(id)) {
    return res.status(400).json({ message: "Invalid User ID!" });
  }

  if (!email && !password) {
    return res.status(400).json({ message: "Nothing to update!" });
  }

  try {
    const updateFields = {};
    if (email) updateFields.email = email.toLowerCase();
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    const result = await User.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("-password");

    if (!result) {
      return res.status(404).json({ message: "User not found!" });
    }

    return res.json(result);
  } catch (err) {
    console.error("Error during updating:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
}

//Delete User Profile
async function deleteUserProfile(req, res) {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ message: "Invalid User ID!" });
  }

  try {
    const result = await User.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "User not found!" });
    }

    return res.json({ message: "User Profile Deleted!" });
  } catch (err) {
    console.error("Error during deleting:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  signup,
  login,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
