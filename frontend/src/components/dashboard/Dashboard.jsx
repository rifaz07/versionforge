
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        const response = await api.get(`/repo/user/${userId}`);
        setRepositories(response.data.repositories || []);
      } catch (err) {
        console.error("Error while fetching repositories:", err);
        setError("Failed to fetch your repositories!");
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await api.get("/repo/all");
        setSuggestedRepositories(response.data.repositories || []);
      } catch (err) {
        console.error("Error while fetching suggested repositories:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      try {
        const response = await api.get(`/userProfile/${userId}`);
        setUsername(response.data.username || "");
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
    fetchUser();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

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
            className="w-8 h-8 bg-[#58a6ff] rounded-full flex items-center justify-center text-xs font-semibold text-white"
          >
            {username ? username[0].toUpperCase() : "U"}
          </button>
        </div>
      </nav>

      {/* Body */}
      <div className="grid grid-cols-[220px_1fr_220px] min-h-[calc(100vh-56px)]">

        {/* Left Sidebar */}
        <aside className="border-r border-[#30363d] p-4 bg-[#161b22]">
          <p className="text-[11px] text-[#8b949e] uppercase tracking-widest font-medium mb-3">
            Suggested
          </p>
          {loading ? (
            <p className="text-[#8b949e] text-xs">Loading...</p>
          ) : suggestedRepositories.length === 0 ? (
            <p className="text-[#8b949e] text-xs">No repos found!</p>
          ) : (
            suggestedRepositories.map((repo) => (
              <div
                key={repo._id}
                onClick={() => navigate(`/repo/${repo._id}`)}
                className="p-3 rounded-lg border border-[#30363d] mb-2 cursor-pointer hover:border-[#58a6ff] transition-colors bg-[#0d1117]"
              >
                <p className="text-[#58a6ff] text-xs font-mono font-medium mb-1">
                  {repo.name}
                </p>
                <p className="text-[#8b949e] text-[11px] leading-relaxed">
                  {repo.description || "No description"}
                </p>
              </div>
            ))
          )}
        </aside>

        {/* Main Content */}
        <main className="p-6 bg-[#0d1117]">

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-[#161b22] rounded-lg p-4 border border-[#30363d]">
              <p className="text-[11px] text-[#8b949e] mb-1">Repositories</p>
              <p className="text-2xl font-mono font-medium text-white">
                {repositories.length}
              </p>
            </div>
            <div className="bg-[#161b22] rounded-lg p-4 border border-[#30363d]">
              <p className="text-[11px] text-[#8b949e] mb-1">Public</p>
              <p className="text-2xl font-mono font-medium text-white">
                {repositories.filter(r => r.visibility === "public").length}
              </p>
            </div>
            <div className="bg-[#161b22] rounded-lg p-4 border border-[#30363d]">
              <p className="text-[11px] text-[#8b949e] mb-1">Private</p>
              <p className="text-2xl font-mono font-medium text-white">
                {repositories.filter(r => r.visibility === "private").length}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              value={searchQuery}
              placeholder="Search repositories..."
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-[#161b22] border border-[#30363d] rounded-lg text-white text-sm placeholder-[#8b949e] outline-none focus:border-[#58a6ff] transition-colors"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 border border-[#f85149] rounded-lg text-[#f85149] text-sm">
              {error}
            </div>
          )}

          {/* Repo List */}
          <div className="flex flex-col gap-3">
            {loading ? (
              <p className="text-[#8b949e] text-sm">Loading...</p>
            ) : searchResults.length === 0 ? (
              <p className="text-[#8b949e] text-sm">No repositories found!</p>
            ) : (
              searchResults.map((repo) => (
                <div
                  key={repo._id}
                  onClick={() => navigate(`/repo/${repo._id}`)}
                  className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 cursor-pointer hover:border-[#58a6ff] transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[#58a6ff] font-mono font-medium text-sm">
                      {repo.name}
                    </p>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                      repo.visibility === "public"
                        ? "bg-[#1a4a1a] text-[#3fb950]"
                        : "bg-[#4a1a1a] text-[#f85149]"
                    }`}>
                      {repo.visibility}
                    </span>
                  </div>
                  <p className="text-[#8b949e] text-xs mb-3 leading-relaxed">
                    {repo.description || "No description provided"}
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-[11px] text-[#8b949e]">
                      <span className="w-2 h-2 rounded-full bg-[#EF9F27] inline-block"></span>
                      JavaScript
                    </span>
                    <span className="text-[11px] text-[#8b949e]">
                      Updated today
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="border-l border-[#30363d] p-4 bg-[#161b22]">
          <p className="text-[11px] text-[#8b949e] uppercase tracking-widest font-medium mb-3">
            Events
          </p>
          {[
            { date: "Dec 15", name: "Tech Conference" },
            { date: "Dec 25", name: "Developer Meetup" },
            { date: "Jan 5", name: "React Summit" },
          ].map((event) => (
            <div
              key={event.name}
              className="p-3 rounded-lg border border-[#30363d] mb-2 bg-[#0d1117]"
            >
              <p className="text-[11px] font-mono text-[#8b949e] mb-1">
                {event.date}
              </p>
              <p className="text-xs font-medium text-white">{event.name}</p>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;