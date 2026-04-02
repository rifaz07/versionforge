
const signup = (req, res) => {
 res.send("Signup");
};

const login = (req, res) => {
  res.send("Login");
};

const getAllUsers = (req, res) => {
  res.send("Get all users");
};

const getUserProfile = (req, res) => {
  res.send("Get user profile");
};

const updateUserProfile = (req, res) => {
 res.send("Update user profile");
};

const deleteUserProfile = (req, res) => {
    res.send("Delete user profile");
};

module.exports = {
  getAllUsers,
  signup,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};