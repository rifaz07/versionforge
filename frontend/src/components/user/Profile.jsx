import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./profile.css";
import Navbar from "../Navbar";
import { useAuth } from "../../authContext";
import HeatMapProfile from "./HeatMap";

const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({ username: "username" });
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/userProfile/${userId}`
        );
        setUserDetails(response.data);
      } catch (err) {
        console.error("Cannot fetch user details:", err);
      }
    };

    const fetchUserRepositories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/repo/user/${userId}`
        );
        setRepositories(response.data.repositories || []);
      } catch (err) {
        console.error("Cannot fetch user repositories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
    fetchUserRepositories();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <>
      <Navbar />
      <div className="profile-page-wrapper">
        <div className="user-profile-section">
          <div className="profile-image"></div>

          <div className="name">
            <h3>{userDetails.username}</h3>
            <p>{userDetails.email}</p>
          </div>

          <button className="follow-btn">Follow</button>

          <div className="follower">
            <p>10 Followers</p>
            <p>3 Following</p>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="repos-section">
          <h3>Repositories</h3>
          {loading ? (
            <p className="loading">Loading...</p>
          ) : repositories.length === 0 ? (
            <p className="empty">No repositories found!</p>
          ) : (
            repositories.map((repo) => (
              <div key={repo._id} className="repo-card">
                <h4>{repo.name}</h4>
                <p>{repo.description}</p>
                <span className={`badge ${repo.visibility}`}>
                  {repo.visibility}
                </span>
              </div>
            ))
          )}

          <HeatMapProfile />
        </div>

      </div>
    </>
  );
};

export default Profile;