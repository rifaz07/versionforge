
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const CreateRepo = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    if (!name) {
      setError("Repository name is required!");
      return;
    }

    try {
      setLoading(true);
      const owner = localStorage.getItem("userId");
      await api.post("/repo/create", { name, description, visibility, owner });
      setLoading(false);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to create repository!");
      setLoading(false);
    }
  };

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
        <button
          onClick={() => navigate("/profile")}
          className="px-3 py-1.5 bg-transparent border border-[#30363d] hover:bg-[#21262d] text-white text-xs font-medium rounded-md transition-colors"
        >
          Profile
        </button>
      </nav>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <h2 className="text-xl font-semibold text-white mb-1">
          Create a New Repository
        </h2>
        <p className="text-[#8b949e] text-sm mb-6">
          A repository contains all your project files and revision history.
        </p>

        <hr className="border-[#30363d] mb-6" />

        {error && (
          <div className="mb-4 p-3 border border-[#f85149] rounded-lg text-[#f85149] text-xs">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-6">

          {/* Repo Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white">
              Repository Name
              <span className="text-[#f85149] ml-1">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. my-awesome-project"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-[#161b22] border border-[#30363d] rounded-lg text-white text-sm placeholder-[#8b949e] outline-none focus:border-[#58a6ff] transition-colors"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white">
              Description
              <span className="text-[#8b949e] ml-1 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="Short description of your repository"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-[#161b22] border border-[#30363d] rounded-lg text-white text-sm placeholder-[#8b949e] outline-none focus:border-[#58a6ff] transition-colors"
            />
          </div>

          <hr className="border-[#30363d]" />

          {/* Visibility */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-white">Visibility</label>

            {/* Public */}
            <div
              onClick={() => setVisibility("public")}
              className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                visibility === "public"
                  ? "border-[#58a6ff] bg-[#161b22]"
                  : "border-[#30363d] hover:border-[#8b949e]"
              }`}
            >
              <span className="text-2xl">🌐</span>
              <div>
                <h4 className="text-sm font-medium text-white mb-1">Public</h4>
                <p className="text-xs text-[#8b949e]">
                  Anyone on the internet can see this repository
                </p>
              </div>
              <div className={`ml-auto w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                visibility === "public"
                  ? "border-[#58a6ff]"
                  : "border-[#30363d]"
              }`}>
                {visibility === "public" && (
                  <div className="w-2 h-2 rounded-full bg-[#58a6ff]" />
                )}
              </div>
            </div>

            {/* Private */}
            <div
              onClick={() => setVisibility("private")}
              className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                visibility === "private"
                  ? "border-[#58a6ff] bg-[#161b22]"
                  : "border-[#30363d] hover:border-[#8b949e]"
              }`}
            >
              <span className="text-2xl">🔒</span>
              <div>
                <h4 className="text-sm font-medium text-white mb-1">Private</h4>
                <p className="text-xs text-[#8b949e]">
                  Only you can see this repository
                </p>
              </div>
              <div className={`ml-auto w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                visibility === "private"
                  ? "border-[#58a6ff]"
                  : "border-[#30363d]"
              }`}>
                {visibility === "private" && (
                  <div className="w-2 h-2 rounded-full bg-[#58a6ff]" />
                )}
              </div>
            </div>
          </div>

          <hr className="border-[#30363d]" />

          {/* Submit */}
          <button
            disabled={loading}
            onClick={handleCreate}
            className="w-fit px-5 py-2 bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {loading ? "Creating..." : "Create Repository"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRepo;