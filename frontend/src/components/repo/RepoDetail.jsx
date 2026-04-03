import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import Navbar from "../Navbar";
import "./repo.css";

const RepoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [repo, setRepo] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Issue form state
  const [issueTitle, setIssueTitle] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [issueLoading, setIssueLoading] = useState(false);
  const [issueError, setIssueError] = useState("");

  useEffect(() => {
    fetchRepo();
    fetchIssues();
  }, [id]);

  const fetchRepo = async () => {
    try {
      const response = await api.get(`/repo/${id}`);
      setRepo(response.data);
    } catch (err) {
      console.error("Error fetching repo:", err);
      setError("Failed to fetch repository!");
    } finally {
      setLoading(false);
    }
  };

  const fetchIssues = async () => {
    try {
      const response = await api.get(`/issue/all/${id}`);
      setIssues(response.data);
    } catch (err) {
      setIssues([]);
    }
  };

  const handleCreateIssue = async (e) => {
    e.preventDefault();
    setIssueError("");

    if (!issueTitle || !issueDescription) {
      setIssueError("Title and description are required!");
      return;
    }

    try {
      setIssueLoading(true);
      await api.post(`/issue/create/${id}`, {
        title: issueTitle,
        description: issueDescription,
      });

      setIssueTitle("");
      setIssueDescription("");
      setIssueLoading(false);
      fetchIssues(); // refresh issues
    } catch (err) {
      console.error("Error creating issue:", err);
      setIssueError(err.response?.data?.error || "Failed to create issue!");
      setIssueLoading(false);
    }
  };

  const handleToggleVisibility = async () => {
    try {
      const response = await api.patch(`/repo/toggle/${id}`);
      setRepo(response.data.repository);
    } catch (err) {
      console.error("Error toggling visibility:", err);
    }
  };

  const handleDeleteRepo = async () => {
    if (!window.confirm("Are you sure you want to delete this repository?")) return;

    try {
      await api.delete(`/repo/delete/${id}`);
      navigate("/");
    } catch (err) {
      console.error("Error deleting repo:", err);
    }
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="repo-detail-wrapper">
        <p className="loading">Loading...</p>
      </div>
    </>
  );

  if (error) return (
    <>
      <Navbar />
      <div className="repo-detail-wrapper">
        <p className="error-message">{error}</p>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="repo-detail-wrapper">

        {/* Repo Header */}
        <div className="repo-header">
          <div className="repo-header-left">
            <h2 className="repo-name">{repo?.name}</h2>
            <span className={`badge ${repo?.visibility}`}>
              {repo?.visibility}
            </span>
          </div>
          <div className="repo-header-right">
            <button
              className="toggle-btn"
              onClick={handleToggleVisibility}
            >
              Make {repo?.visibility === "public" ? "Private" : "Public"}
            </button>
            <button
              className="delete-btn"
              onClick={handleDeleteRepo}
            >
              Delete Repo
            </button>
          </div>
        </div>

        {/* Repo Info */}
        <div className="repo-info">
          <p className="repo-description">
            {repo?.description || "No description provided"}
          </p>
          <p className="repo-meta">
            Owner: <span>{repo?.owner?.username || "Unknown"}</span>
          </p>
          <p className="repo-meta">
            Created: <span>{new Date(repo?.createdAt).toDateString()}</span>
          </p>
        </div>

        <hr className="repo-divider" />

        {/* Create Issue Form */}
        <div className="issue-form-section">
          <h3>Create New Issue</h3>

          {issueError && <p className="error-message">{issueError}</p>}

          <div className="issue-form">
            <input
              type="text"
              className="input"
              placeholder="Issue title"
              value={issueTitle}
              onChange={(e) => setIssueTitle(e.target.value)}
            />
            <textarea
              className="input textarea"
              placeholder="Describe the issue..."
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              rows={4}
            />
            <button
              className="create-btn"
              disabled={issueLoading}
              onClick={handleCreateIssue}
            >
              {issueLoading ? "Creating..." : "Create Issue"}
            </button>
          </div>
        </div>

        <hr className="repo-divider" />

        {/* Issues List */}
        <div className="issues-section">
          <h3>Issues ({issues.length})</h3>

          {issues.length === 0 ? (
            <p className="empty">No issues yet!</p>
          ) : (
            issues.map((issue) => (
              <div key={issue._id} className="issue-card">
                <div className="issue-card-left">
                  <span className={`issue-status ${issue.status}`}>
                    {issue.status}
                  </span>
                  <div>
                    <h4>{issue.title}</h4>
                    <p>{issue.description}</p>
                  </div>
                </div>
                <p className="issue-date">
                  {new Date(issue.createdAt).toDateString()}
                </p>
              </div>
            ))
          )}
        </div>

      </div>
    </>
  );
};

export default RepoDetail;