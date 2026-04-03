
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";

const RepoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [repo, setRepo] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      fetchIssues();
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
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
      <p className="text-[#8b949e] text-sm">Loading...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
      <p className="text-[#f85149] text-sm">{error}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">

      {/* Navbar */}
      <nav className="bg-[#161b22] border-b border-[#30363d] px-6 h-14 flex items-center justify-between sticky top-0 z-10">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
            <svg viewBox="0 0 16 16" className="w-4 h-4 fill-black">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
          </div>
          <span className="text-white font-semibold text-sm">VersionForge</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/repo/create")}
            className="px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-medium rounded-md transition-colors"
          >
            + New Repo
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="px-3 py-1.5 bg-transparent border border-[#30363d] hover:bg-[#21262d] text-white text-xs font-medium rounded-md transition-colors"
          >
            Profile
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Repo Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold text-[#58a6ff] font-mono">
              {repo?.name}
            </h2>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              repo?.visibility === "public"
                ? "bg-[#1a4a1a] text-[#3fb950]"
                : "bg-[#4a1a1a] text-[#f85149]"
            }`}>
              {repo?.visibility}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleVisibility}
              className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-white text-xs font-medium rounded-md transition-colors"
            >
              Make {repo?.visibility === "public" ? "Private" : "Public"}
            </button>
            <button
              onClick={handleDeleteRepo}
              className="px-3 py-1.5 bg-[#da3633] hover:bg-[#b62324] text-white text-xs font-medium rounded-md transition-colors"
            >
              Delete Repo
            </button>
          </div>
        </div>

        {/* Repo Info */}
        <div className="mb-6 flex flex-col gap-2">
          <p className="text-[#8b949e] text-sm">
            {repo?.description || "No description provided"}
          </p>
          <p className="text-[#8b949e] text-xs">
            Owner: <span className="text-white font-medium">{repo?.owner?.username || "Unknown"}</span>
          </p>
          <p className="text-[#8b949e] text-xs">
            Created: <span className="text-white font-medium">{new Date(repo?.createdAt).toDateString()}</span>
          </p>
        </div>

        <hr className="border-[#30363d] mb-6" />

        {/* Create Issue Form */}
        <div className="mb-6">
          <h3 className="text-base font-semibold text-white mb-4">
            Create New Issue
          </h3>

          {issueError && (
            <div className="mb-3 p-3 border border-[#f85149] rounded-lg text-[#f85149] text-xs">
              {issueError}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Issue title"
              value={issueTitle}
              onChange={(e) => setIssueTitle(e.target.value)}
              className="w-full px-4 py-2 bg-[#161b22] border border-[#30363d] rounded-lg text-white text-sm placeholder-[#8b949e] outline-none focus:border-[#58a6ff] transition-colors"
            />
            <textarea
              placeholder="Describe the issue..."
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 bg-[#161b22] border border-[#30363d] rounded-lg text-white text-sm placeholder-[#8b949e] outline-none focus:border-[#58a6ff] transition-colors resize-y"
            />
            <button
              disabled={issueLoading}
              onClick={handleCreateIssue}
              className="w-fit px-4 py-2 bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {issueLoading ? "Creating..." : "Create Issue"}
            </button>
          </div>
        </div>

        <hr className="border-[#30363d] mb-6" />

        {/* Issues List */}
        <div>
          <h3 className="text-base font-semibold text-white mb-4">
            Issues ({issues.length})
          </h3>

          {issues.length === 0 ? (
            <p className="text-[#8b949e] text-sm">No issues yet!</p>
          ) : (
            <div className="flex flex-col gap-3">
              {issues.map((issue) => (
                <div
                  key={issue._id}
                  className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 hover:border-[#58a6ff] transition-colors flex items-start justify-between"
                >
                  <div className="flex items-start gap-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${
                      issue.status === "open"
                        ? "bg-[#1a4a1a] text-[#3fb950]"
                        : "bg-[#4a1a1a] text-[#f85149]"
                    }`}>
                      {issue.status}
                    </span>
                    <div>
                      <h4 className="text-sm font-medium text-white mb-1">
                        {issue.title}
                      </h4>
                      <p className="text-xs text-[#8b949e]">
                        {issue.description}
                      </p>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#8b949e] whitespace-nowrap ml-4">
                    {new Date(issue.createdAt).toDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RepoDetail;