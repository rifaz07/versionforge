const mongoose = require("mongoose");
const Issue = require("../models/issueModel");

//Helper 
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

//Create Issue 
async function createIssue(req, res) {
  const { title, description } = req.body;
  const { id } = req.params;  // repo ID

  if (!isValidId(id)) {
    return res.status(400).json({ error: "Invalid Repository ID!" });
  }

  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required!" });
  }

  try {
    const issue = new Issue({
      title: title.trim(),
      description: description.trim(),
      repository: id,
    });

    await issue.save();
    return res.status(201).json({ message: "Issue created successfully!", issue });
  } catch (err) {
    console.error("Error during issue creation:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
}

// Get All Issues For A Repo
async function getAllIssues(req, res) {
  const { id } = req.params;  // repo ID

  if (!isValidId(id)) {
    return res.status(400).json({ error: "Invalid Repository ID!" });
  }

  try {
    const issues = await Issue.find({ repository: id });  // ✅ await added

    if (!issues.length) {
      return res.status(404).json({ error: "No issues found for this repository!" });
    }

    return res.status(200).json(issues);
  } catch (err) {
    console.error("Error during issue fetching:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
}

//Get Issue By ID
async function getIssueById(req, res) {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ error: "Invalid Issue ID!" });
  }

  try {
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }

    return res.json(issue);
  } catch (err) {
    console.error("Error during issue fetching:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
}

//Update Issue By ID
async function updateIssueById(req, res) {
  const { id } = req.params;
  const { title, description, status } = req.body;

  if (!isValidId(id)) {
    return res.status(400).json({ error: "Invalid Issue ID!" });
  }

  if (!title && !description && !status) {
    return res.status(400).json({ error: "Nothing to update!" });
  }

  try {
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }

    if (title) issue.title = title.trim();
    if (description) issue.description = description.trim();
    if (status) issue.status = status;

    await issue.save();
    return res.json({ message: "Issue updated successfully!", issue });
  } catch (err) {
    console.error("Error during issue updation:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
}

//Delete Issue By ID
async function deleteIssueById(req, res) {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ error: "Invalid Issue ID!" });
  }

  try {
    const issue = await Issue.findByIdAndDelete(id);  // ✅ await added
    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }

    return res.json({ message: "Issue deleted successfully!" });
  } catch (err) {
    console.error("Error during issue deletion:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssueById,
  deleteIssueById,
};