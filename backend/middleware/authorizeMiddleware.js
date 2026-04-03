const mongoose = require("mongoose");
const Repository = require("../models/repoModel");

async function authorizeMiddleware(req, res, next) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid Repository ID!" });
  }

  try {
    const repository = await Repository.findById(id);

    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    if (repository.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized! You don't own this repository." });
    }

    next();
  } catch (err) {
    console.error("Authorize middleware error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = authorizeMiddleware;