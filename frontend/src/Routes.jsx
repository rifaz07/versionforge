import React, { useEffect } from "react";
import { useNavigate, useRoutes, useLocation } from "react-router-dom";
import { useAuth } from "./authContext";
import CreateRepo from "./components/repo/CreateRepo";
import RepoDetail from "./components/repo/RepoDetail";

// Pages
import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/user/Profile";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";

const PUBLIC_PATHS = ["/auth", "/signup"];

const ProjectRoutes = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");

    if (userIdFromStorage && !currentUser) {
      setCurrentUser(userIdFromStorage);
    }

    if (!userIdFromStorage && !PUBLIC_PATHS.includes(location.pathname)) {
      navigate("/auth");
    }

    if (userIdFromStorage && location.pathname === "/auth") {
      navigate("/");
    }
  }, [location.pathname]);

  let element = useRoutes([
    {
      path: "/",
      element: <Dashboard />,
    },
    {
      path: "/auth",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/repo/create",
      element: <CreateRepo />,
    },
    {
      path: "/repo/:id",
      element: <RepoDetail />,
    },
  ]);

  return element;
};

export default ProjectRoutes;
