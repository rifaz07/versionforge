# VersionForge

A full-stack version control system inspired by GitHub — built with React, Node.js, MongoDB, and AWS S3.

🌐 **Live Demo**: [https://main.d2wuybatwux9bb.amplifyapp.com](https://main.d2wuybatwux9bb.amplifyapp.com)

---

## 🚀 Features

- **User Authentication** — Signup, login, and JWT-based auth
- **Repository Management** — Create, update, delete, and toggle visibility of repositories
- **Issue Tracking** — Create, view, update, and delete issues per repository
- **Version Control CLI** — Git-like commands to init, add, commit, push, pull, and revert files
- **AWS S3 Integration** — Commits are pushed and pulled from S3 cloud storage
- **Real-time Updates** — Socket.io integration for live notifications
- **Activity Heatmap** — GitHub-style contribution heatmap on user profile

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, React Router |
| Backend | Node.js, Express.js, Socket.io |
| Database | MongoDB, Mongoose |
| Storage | AWS S3 |
| Auth | JWT, bcrypt |
| Deployment | AWS Amplify (Frontend), Railway (Backend) |

---

## 📁 Project Structure

```
versionforge/
├── frontend/          # React + Vite frontend
│   └── src/
│       ├── components/
│       │   ├── auth/       # Login & Signup
│       │   ├── dashboard/  # User dashboard
│       │   ├── repo/       # Repository views
│       │   └── user/       # Profile & heatmap
│       └── ...
├── backend/           # Node.js + Express backend
│   ├── controllers/   # Business logic
│   ├── models/        # Mongoose schemas
│   ├── routes/        # API routes
│   ├── middleware/    # Auth & authorization
│   └── config/        # AWS config
└── amplify.yml        # AWS Amplify build config
```

---

## 🔧 CLI Usage

VersionForge includes a Git-like CLI for version control:

```bash
# Initialize a new repository
node index.js init

# Stage a file
node index.js add <filename>

# Commit staged files
node index.js commit "your commit message"

# Push commits to AWS S3
node index.js push

# Pull commits from AWS S3
node index.js pull

# Revert to a specific commit
node index.js revert <commitID>

# Start the HTTP server
node index.js start
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/signup` | Register a new user |
| POST | `/login` | Login and get JWT token |

### Users
| Method | Endpoint | Description |
|---|---|---|
| GET | `/userProfile/:id` | Get user profile |
| PUT | `/updateProfile/:id` | Update user profile |
| DELETE | `/deleteProfile/:id` | Delete user profile |

### Repositories
| Method | Endpoint | Description |
|---|---|---|
| GET | `/repo/all` | Get all repositories |
| GET | `/repo/user/:userID` | Get repos for a user |
| POST | `/repo/create` | Create a repository (auth required) |
| PUT | `/repo/update/:id` | Update a repository (auth required) |
| DELETE | `/repo/delete/:id` | Delete a repository (auth required) |
| PATCH | `/repo/toggle/:id` | Toggle repo visibility (auth required) |

### Issues
| Method | Endpoint | Description |
|---|---|---|
| POST | `/issue/create/:id` | Create an issue |
| GET | `/issue/all/:id` | Get all issues for a repo |
| GET | `/issue/:id` | Get issue by ID |
| PUT | `/issue/update/:id` | Update an issue |
| DELETE | `/issue/delete/:id` | Delete an issue |

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

Create a `.env` file:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
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
npm run dev
```

---

## 🌍 Deployment

| Service | Platform |
|---|---|
| Frontend | AWS Amplify |
| Backend | Railway |
| Database | MongoDB Atlas |
| File Storage | AWS S3 (ap-south-1) |

---

## 👨‍💻 Author

**Rifaz Shaikh Razak**  
[GitHub](https://github.com/rifaz07)