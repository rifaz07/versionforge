import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import Navbar from "../Navbar";
import "./repo.css";

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

      const response = await api.post("/repo/create", {
        name,
        description,
        visibility,
        owner,
      });

      setLoading(false);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to create repository!");
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="repo-wrapper">
        <div className="repo-box">
          <h2 className="repo-title">Create a New Repository</h2>
          <p className="repo-subtitle">
            A repository contains all your project files and revision history.
          </p>

          <hr className="repo-divider" />

          {error && <p className="error-message">{error}</p>}

          <div className="repo-form">
            <div className="form-group">
              <label className="label">Repository Name <span className="required">*</span></label>
              <input
                type="text"
                className="input"
                placeholder="e.g. my-awesome-project"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="label">Description <span className="optional">(optional)</span></label>
              <input
                type="text"
                className="input"
                placeholder="Short description of your repository"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <hr className="repo-divider" />

            <div className="form-group">
              <label className="label">Visibility</label>
              <div className="visibility-options">
                <div
                  className={`visibility-card ${visibility === "public" ? "selected" : ""}`}
                  onClick={() => setVisibility("public")}
                >
                  <div className="visibility-icon">🌐</div>
                  <div>
                    <h4>Public</h4>
                    <p>Anyone on the internet can see this repository</p>
                  </div>
                </div>

                <div
                  className={`visibility-card ${visibility === "private" ? "selected" : ""}`}
                  onClick={() => setVisibility("private")}
                >
                  <div className="visibility-icon">🔒</div>
                  <div>
                    <h4>Private</h4>
                    <p>Only you can see this repository</p>
                  </div>
                </div>
              </div>
            </div>

            <hr className="repo-divider" />

            <button
              className="create-btn"
              disabled={loading}
              onClick={handleCreate}
            >
              {loading ? "Creating..." : "Create Repository"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateRepo;