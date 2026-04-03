const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient, ObjectId } = require("mongodb");

let client;

// DB Connection 
async function connectClient() {
  if (!client) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not defined in .env");
    }
    client = new MongoClient(uri);
    await client.connect();
  }
}

// Helper 
function getCollection() {
  return client.db("versionforge").collection("users");
}

//Signup
async function signup(req, res) {
  const { username, password, email } = req.body;

  try {
    // Input validation
    if (!username || !password || !email) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    await connectClient();
    const usersCollection = getCollection();

    // Check both username AND email
    const existingUser = await usersCollection.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res.status(400).json({ message: "Username or email already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      repositories: [],
      followedUsers: [],
      starRepos: [],
    };

    const result = await usersCollection.insertOne(newUser);

    const token = jwt.sign(
      { id: result.insertedId },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    return res.status(201).json({ token, userId: result.insertedId });
  } catch (err) {
    console.error("Error during signup:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
}

//Login 
async function login(req, res) {
  const { email, password } = req.body;

  try {
    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    await connectClient();
    const usersCollection = getCollection();

    const user = await usersCollection.findOne({ email: email.toLowerCase() });
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
    await connectClient();
    const usersCollection = getCollection();

    const users = await usersCollection
      .find({}, { projection: { password: 0 } })
      .toArray();

    return res.json(users);
  } catch (err) {
    console.error("Error during fetching:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
}

//Get User Profile
async function getUserProfile(req, res) {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid User ID!" });
  }

  try {
    await connectClient();
    const usersCollection = getCollection();

    const user = await usersCollection.findOne(
      { _id: new ObjectId(id) },
      { projection: { password: 0 } }
    );

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

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid User ID!" });
  }

  if (!email && !password) {
    return res.status(400).json({ message: "Nothing to update!" });
  }

  try {
    await connectClient();
    const usersCollection = getCollection();

    const updateFields = {};
    if (email) updateFields.email = email.toLowerCase();
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateFields },
      { returnDocument: "after", projection: { password: 0 } }
    );

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

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid User ID!" });
  }

  try {
    await connectClient();
    const usersCollection = getCollection();

    const result = await usersCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
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