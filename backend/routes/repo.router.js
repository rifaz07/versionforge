const express = require("express");
const repoController = require("../controllers/repoController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeMiddleware = require("../middleware/authorizeMiddleware");

const repoRouter = express.Router();

repoRouter.get("/repo/all", repoController.getAllRepositories);
repoRouter.get("/repo/name/:name", repoController.fetchRepositoryByName);
repoRouter.get(
  "/repo/user/:userID",
  repoController.fetchRepositoriesForCurrentUser,
);
repoRouter.get("/repo/:id", repoController.fetchRepositoryById);

// Protected routes
repoRouter.post(
  "/repo/create",
  authMiddleware,
  repoController.createRepository,
);
repoRouter.put(
  "/repo/update/:id",
  authMiddleware,
  authorizeMiddleware,
  repoController.updateRepositoryById,
);
repoRouter.delete(
  "/repo/delete/:id",
  authMiddleware,
  authorizeMiddleware,
  repoController.deleteRepositoryById,
);
repoRouter.patch(
  "/repo/toggle/:id",
  authMiddleware,
  authorizeMiddleware,
  repoController.toggleVisibilityById,
);

module.exports = repoRouter;
