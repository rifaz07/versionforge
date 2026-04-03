const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

// ─── Helpers ────────────────────────────────────────────────
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const serverError = (res, err, context = "Operation") => {
  console.error(`Error during ${context}:`, err.message);
  return res.status(500).json({ error: "Internal server error" });
};

// ─── Create Repository ──────────────────────────────────────
async function createRepository(req, res) {
  const { owner, name, content, description, visibility } = req.body;

  try {
    if (!name?.trim()) {
      return res.status(400).json({ error: "Repository name is required!" });
    }

    if (!isValidId(owner)) {
      return res.status(400).json({ error: "Invalid User ID!" });
    }

    // Duplicate check — same owner, same repo name
    const existing = await Repository.findOne({ owner, name: name.trim() });
    if (existing) {
      return res.status(409).json({ error: "You already have a repository with this name!" });
    }

    const newRepository = new Repository({
      name: name.trim(),
      description: description?.trim(),
      visibility: visibility || "public",
      owner,
      content: content || [],
    });

    const result = await newRepository.save();

    return res.status(201).json({
      message: "Repository created!",
      repositoryID: result._id,
    });
  } catch (err) {
    return serverError(res, err, "repository creation");
  }
}

// ─── Get All Repositories (with pagination) ─────────────────
async function getAllRepositories(req, res) {
  const page  = Math.max(1, parseInt(req.query.page)  || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 10);
  const skip  = (page - 1) * limit;

  try {
    const [repositories, total] = await Promise.all([
      Repository.find({})
        .populate("owner", "username email")
        .populate("issues")
        .skip(skip)
        .limit(limit)
        .lean(),
      Repository.countDocuments(),
    ]);

    return res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      repositories,
    });
  } catch (err) {
    return serverError(res, err, "fetching repositories");
  }
}

// ─── Fetch Repository By ID ──────────────────────────────────
async function fetchRepositoryById(req, res) {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ error: "Invalid Repository ID!" });
  }

  try {
    const repository = await Repository.findById(id)
      .populate("owner", "username email")
      .populate("issues")
      .lean();

    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    return res.json(repository);
  } catch (err) {
    return serverError(res, err, "fetching repository by ID");
  }
}

// ─── Fetch Repository By Name ────────────────────────────────
async function fetchRepositoryByName(req, res) {
  const { name } = req.params;

  if (!name?.trim()) {
    return res.status(400).json({ error: "Repository name is required!" });
  }

  try {
    const repositories = await Repository.find({ name: name.trim() })
      .populate("owner", "username email")
      .populate("issues")
      .lean();

    if (!repositories.length) {
      return res.status(404).json({ error: "No repositories found with that name!" });
    }

    return res.json(repositories);
  } catch (err) {
    return serverError(res, err, "fetching repository by name");
  }
}

// ─── Fetch Repositories For Current User ────────────────────
async function fetchRepositoriesForCurrentUser(req, res) {
  const { userID } = req.params;

  if (!isValidId(userID)) {
    return res.status(400).json({ error: "Invalid User ID!" });
  }

  try {
    const repositories = await Repository.find({ owner: userID })
      .populate("issues")
      .lean();

    if (!repositories.length) {
      return res.status(404).json({ error: "No repositories found for this user!" });
    }

    return res.json({ message: "Repositories found!", repositories });
  } catch (err) {
    return serverError(res, err, "fetching user repositories");
  }
}

// ─── Update Repository By ID ─────────────────────────────────
async function updateRepositoryById(req, res) {
  const { id } = req.params;
  const { content, description } = req.body;

  if (!isValidId(id)) {
    return res.status(400).json({ error: "Invalid Repository ID!" });
  }

  if (!content && !description) {
    return res.status(400).json({ error: "Nothing to update!" });
  }

  try {
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    if (content) repository.content.push(content.trim());
    if (description) repository.description = description.trim();

    const updatedRepository = await repository.save();

    return res.json({
      message: "Repository updated successfully!",
      repository: updatedRepository,
    });
  } catch (err) {
    return serverError(res, err, "updating repository");
  }
}

// ─── Toggle Visibility ───────────────────────────────────────
async function toggleVisibilityById(req, res) {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ error: "Invalid Repository ID!" });
  }

  try {
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    repository.visibility = repository.visibility === "public" ? "private" : "public";

    const updatedRepository = await repository.save();
    await updatedRepository.populate("owner", "username email");

    return res.json({
      message: `Repository is now ${updatedRepository.visibility}!`,
      repository: updatedRepository,
    });
  } catch (err) {
    return serverError(res, err, "toggling visibility");
  }
}

// ─── Delete Repository By ID ─────────────────────────────────
async function deleteRepositoryById(req, res) {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ error: "Invalid Repository ID!" });
  }

  try {
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    // Delete issues first, then repo — safe order
    await Issue.deleteMany({ repository: id });
    await repository.deleteOne();

    return res.json({
      message: "Repository deleted successfully!",
      deletedRepositoryId: id,
    });
  } catch (err) {
    return serverError(res, err, "deleting repository");
  }
}

module.exports = {
  createRepository,
  getAllRepositories,
  fetchRepositoryById,
  fetchRepositoryByName,
  fetchRepositoriesForCurrentUser,
  updateRepositoryById,
  toggleVisibilityById,
  deleteRepositoryById,
};