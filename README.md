# VersionForge 🔧

> A full-stack version control platform inspired by GitHub — with a custom Git-like CLI, repository management, issue tracking, and AWS S3-powered commit storage.

![Deploy](https://img.shields.io/badge/Frontend-AWS%20Amplify-purple?style=flat-square&logo=amazonaws)
![Backend](https://img.shields.io/badge/Backend-Railway-0B0D0E?style=flat-square&logo=railway)
![Database](https://img.shields.io/badge/Database-MongoDB-47A248?style=flat-square&logo=mongodb)
![Storage](https://img.shields.io/badge/Storage-AWS%20S3-FF9900?style=flat-square&logo=amazons3)
![Node](https://img.shields.io/badge/Node.js-20.x-339933?style=flat-square&logo=nodedotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)

🌐 **Live Demo**: [https://main.d2wuybatwux9bb.amplifyapp.com](https://main.d2wuybatwux9bb.amplifyapp.com)

---

## 📌 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [CLI Usage](#cli-usage)
- [API Reference](#api-reference)
- [Local Setup](#local-setup)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Author](#author)

---

## Overview

VersionForge is a full-stack version control system built from scratch. It combines a **React-based web interface** for repository and issue management with a **custom CLI tool** that enables Git-like operations (init, add, commit, push, pull, revert) backed by **AWS S3** for file storage and **MongoDB** for metadata.

---

## ✨ Features

- **User Authentication** — Signup, login with JWT-based auth and bcrypt password hashing
- **Repository Management** — Create, update, delete, and toggle visibility of repositories
- **Issue Tracking** — Full CRUD for issues per repository
- **Custom Git CLI** — `init`, `add`, `commit`, `push`, `pull`, `revert` commands
- **AWS S3 Storage** — Commits are stored and retrieved from S3 cloud storage
- **Real-time Notifications** — Socket.io for live updates
- **Activity Heatmap** — GitHub-style contribution heatmap on user profiles
- **Authorization Middleware** — Role-based access control on sensitive routes

---

## 🏗️ Architecture

```
                        ┌─────────────┐
                        │   GitHub    │
                        │ Source Code │
                        └──────┬──────┘
                   ┌───────────┴───────────┐
                   ▼                       ▼
          ┌────────────────┐    ┌────────────────────┐
          │  AWS Amplify   │    │      Railway        │
          │ React + Vite   │───▶│  Node.js + Express  │
          │ Tailwind CSS   │    │  Socket.io + JWT    │
          └────────────────┘    └────────┬───────────┘
                                         │
                          ┌──────────────┼──────────────┐
                          ▼                             ▼
                  ┌──────────────┐             ┌────────────┐
                  │ MongoDB Atlas│             │  AWS S3    │
                  │ Users/Repos/ │             │  Commits   │
                  │   Issues     │             │  Storage   │
                  └──────────────┘             └────────────┘

CLI Tool (local) ──push/pull──▶ AWS S3
CLI Tool (local) ──────────────▶ MongoDB
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, React Router v7 |
| Backend | Node.js, Express.js 5, Socket.io |
| Database | MongoDB, Mongoose |
| Storage | AWS S3 (ap-south-1) |
| Auth | JWT, bcrypt |
| CLI | Node.js, Yargs, UUID |
| Deployment | AWS Amplify (Frontend), Railway (Backend) |

---

## 📁 Project Structure

```
versionforge/
├── amplify.yml              # AWS Amplify monorepo build config
├── frontend/                # React + Vite frontend
│   └── src/
│       ├── components/
│       │   ├── auth/        # Login & Signup pages
│       │   ├── dashboard/   # User dashboard
│       │   ├── repo/        # Repository views
│       │   └── user/        # Profile & heatmap
│       ├── api.js           # Axios API config
│       ├── authContext.jsx
│       └── Routes.jsx
└── backend/                 # Node.js + Express backend
    ├── controllers/         # Business logic
    │   ├── init.js          # CLI: repo init
    │   ├── add.js           # CLI: stage files
    │   ├── commit.js        # CLI: commit
    │   ├── push.js          # CLI: push to S3
    │   ├── pull.js          # CLI: pull from S3
    │   ├── revert.js        # CLI: revert commit
    │   ├── repoController.js
    │   ├── userController.js
    │   └── issueController.js
    ├── models/              # Mongoose schemas
    ├── routes/              # Express routers
    ├── middleware/          # Auth & authorization
    ├── config/              # AWS S3 config
    └── index.js             # Entry point (CLI + HTTP server)
```

---

## 🔧 CLI Usage

VersionForge includes a Git-like CLI for local version control backed by AWS S3:

```bash
# Initialize a new repository in the current directory
node index.js init

# Stage a file for commit
node index.js add <filename>

# Commit staged files with a message
node index.js commit "your commit message"

# Push all commits to AWS S3
node index.js push

# Pull commits from AWS S3
node index.js pull

# Revert to a specific commit by ID
node index.js revert <commitID>

# Start the HTTP server
node index.js start
```

### Example workflow:

```bash
node index.js init
node index.js add hello.txt
node index.js commit "initial commit"
node index.js push
# Output: All commits pushed to S3.
```

---

## 📡 API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/signup` | ❌ | Register a new user |
| POST | `/login` | ❌ | Login, returns JWT token |

### Users
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/allUsers` | ❌ | Get all users |
| GET | `/userProfile/:id` | ❌ | Get user profile |
| PUT | `/updateProfile/:id` | ❌ | Update user profile |
| DELETE | `/deleteProfile/:id` | ❌ | Delete user profile |

### Repositories
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/repo/all` | ❌ | Get all repositories |
| GET | `/repo/user/:userID` | ❌ | Get repos for a user |
| GET | `/repo/:id` | ❌ | Get repo by ID |
| POST | `/repo/create` | ✅ | Create a repository |
| PUT | `/repo/update/:id` | ✅ | Update a repository |
| DELETE | `/repo/delete/:id` | ✅ | Delete a repository |
| PATCH | `/repo/toggle/:id` | ✅ | Toggle repo visibility |

### Issues
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/issue/create/:id` | ❌ | Create an issue |
| GET | `/issue/all/:id` | ❌ | Get all issues for a repo |
| GET | `/issue/:id` | ❌ | Get issue by ID |
| PUT | `/issue/update/:id` | ❌ | Update an issue |
| DELETE | `/issue/delete/:id` | ❌ | Delete an issue |

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 20+
- MongoDB Atlas account
- AWS account with S3 bucket

### Backend

```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/versionforge
JWT_SECRET=your_jwt_secret_here
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
S3_BUCKET=your_s3_bucket_name
```

Start the server:

```bash
node index.js start
```

### Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in `/frontend`:

```env
VITE_API_URL=http://localhost:3000
```

Start the dev server:

```bash
npm run dev
```

---

## 🌍 Deployment

| Layer | Platform | URL |
|---|---|---|
| Frontend | AWS Amplify | https://main.d2wuybatwux9bb.amplifyapp.com |
| Backend | Railway | https://versionforge-production.up.railway.app |
| Database | MongoDB Atlas | Cloud hosted |
| Storage | AWS S3 (ap-south-1) | Cloud hosted |

### Frontend (AWS Amplify)
The `amplify.yml` in the project root handles the monorepo build:
```yaml
version: 1
applications:
  - frontend:
      phases:
        preBuild:
          commands:
            - npm install
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: dist
        files:
          - '**/*'
    appRoot: frontend
```

### Backend (Railway)
- Root directory: `/backend`
- Start command: `node index.js start`
- Environment variables configured in Railway dashboard

---

## 🔮 Roadmap

- [ ] Connect CLI commits to the web UI (show commit history on repo page)
- [ ] Branch support in CLI
- [ ] Diff viewer for commits
- [ ] Pull request / merge request feature
- [ ] Migrate AWS SDK v2 to v3

---

## 👨‍💻 Author

**Rifaz Shaikh Razak**

[![GitHub](https://img.shields.io/badge/GitHub-rifaz07-181717?style=flat-square&logo=github)](https://github.com/rifaz07)


