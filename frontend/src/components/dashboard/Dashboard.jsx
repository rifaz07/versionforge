import React, { useState, useEffect } from "react";
import "./dashboard.css";
import Navbar from "../Navbar";
import api from "../../api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

    fetchRepositories();
    fetchSuggestedRepositories();
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
    <>
      <Navbar />
      <section id="dashboard">
        <aside className="left-aside">
          <h3>Suggested Repositories</h3>
          {loading ? (
            <p className="loading">Loading...</p>
          ) : suggestedRepositories.length === 0 ? (
            <p className="empty">No repositories found!</p>
          ) : (
            suggestedRepositories.map((repo) => (
              <div
                key={repo._id}
                className="repo-card"
                onClick={() => navigate(`/repo/${repo._id}`)}
              >
                <h4>{repo.name}</h4>
                <p>{repo.description}</p>
              </div>
            ))
          )}
        </aside>

        <main className="main-content">
          <h2>Your Repositories</h2>
          <div id="search">
            <input
              type="text"
              value={searchQuery}
              placeholder="Search repositories..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          {loading ? (
            <p className="loading">Loading...</p>
          ) : searchResults.length === 0 ? (
            <p className="empty">No repositories found!</p>
          ) : (
            searchResults.map((repo) => (
              <div
                key={repo._id}
                className="repo-card"
                onClick={() => navigate(`/repo/${repo._id}`)}
              >
                <h4>{repo.name}</h4>
                <p>{repo.description}</p>
                <span className={`badge ${repo.visibility}`}>
                  {repo.visibility}
                </span>
              </div>
            ))
          )}
        </main>

        <aside className="right-aside">
          <h3>Upcoming Events</h3>
          <ul>
            <li><p>Tech Conference - Dec 15</p></li>
            <li><p>Developer Meetup - Dec 25</p></li>
            <li><p>React Summit - Jan 5</p></li>
          </ul>
        </aside>
      </section>
    </>
  );
};

export default Dashboard;