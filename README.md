# ResearchHub – Research Collaboration Tool (MERN)

ResearchHub is a web-based platform that helps researchers and students work together on research projects. Teams can share resources, manage tasks, chat in real time, discuss documents, and track project progress and contributions in one centralized system.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Prerequisites](#prerequisites)
5. [Getting Started](#getting-started)
6. [Environment Variables](#environment-variables)
7. [Creating an Admin Account](#creating-an-admin-account)
8. [User Roles](#user-roles)
9. [Usage Walkthrough](#usage-walkthrough)
10. [Testing](#testing)
11. [Troubleshooting](#troubleshooting)
12. [Deployment](#deployment)
13. [Contributing](#contributing)
14. [Contributors](#contributors)
15. [License](#license)

---

## Features

- **Authentication & roles** – registration, login, JWT-based sessions, and role-based access (Admin, Researcher, Viewer)
- **Project management** – create, edit, and delete research projects with status, research area, start date, deadline, and progress
- **Team collaboration** – invite members, accept or reject invitations, assign roles, and remove members
- **Tasks** – create, assign, and track tasks with priority, due dates, and status workflow (To Do → In Progress → Completed)
- **Documents** – upload, view, download, and delete project files (stored on Cloudinary)
- **Comments & feedback** – discuss and give feedback directly on research documents
- **Resources & datasets** – manage links, datasets, repositories, files, and references with search, filters, and tags
- **Research papers** – store paper metadata (authors, abstract, year, journal, DOI, URL, tags, notes) and PDFs
- **Citation & reference management** – add, edit, search, and organize references per project
- **Milestones & deadlines** – plan and track key project dates
- **Real-time team chat** – project-based chat rooms powered by Socket.IO with message history
- **Notifications & reminders** – invitations, role changes, task assignments, completions, and deadline reminders, with read/unread tracking
- **Progress tracking** – project progress reflects completed tasks and milestones
- **Activity history & contribution tracking** – log of who did what across each project, with per-member contribution summaries
- **Admin dashboard** – platform statistics, user management, project management, and admin notifications

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Real-time | Socket.IO |
| Auth | JSON Web Tokens (JWT), bcrypt |
| File storage | Cloudinary |

---

## Project Structure

```
Research-Collaboration-Tool/
├── client/                     # React frontend
│   └── src/
│       ├── api/                # Axios service files (projects, admin, milestones, contributions, ...)
│       ├── components/         # Reusable UI (activity, contributions, dashboard, documents,
│       │                       #   milestones, references, research-papers, resources, team)
│       ├── config/             # Client configuration
│       └── pages/              # Route pages (Dashboard, Chat, Documents, admin/...)
├── server/                     # Express backend
│   ├── controllers/            # Request handlers
│   ├── middleware/             # Auth and admin middleware
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # API routes
│   ├── sockets/                # Socket.IO chat logic
│   ├── utils/                  # Helpers (notifications, reminder jobs, ...)
│   └── server.js               # Entry point
├── scratch/                    # Experimental / test code
└── README.md
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [MongoDB](https://www.mongodb.com/) (local installation or a MongoDB Atlas cluster)
- A [Cloudinary](https://cloudinary.com/) account (for file uploads)
- [Git](https://git-scm.com/)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Namitha938/Research-Collaboration-Tool.git
cd Research-Collaboration-Tool
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file in `server/` (see [Environment Variables](#environment-variables)), then start the server:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

### 3. Set up the frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

---

## Environment Variables

Create `server/.env`. Variable names below are typical examples; match them to the names used in your code.

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/researchhub
JWT_SECRET=replace_with_a_long_random_string
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

If the client needs its own variables, create `client/.env` (Vite variables must start with `VITE_`):

```env
VITE_API_URL=http://localhost:5000
```

> Never commit `.env` files. Make sure they are listed in `.gitignore`.

---

## Creating an Admin Account

Admin accounts are not created through the public registration form. To make a user an admin:

1. Register a normal account.
2. In MongoDB (Compass or Atlas), open the `users` collection and set that user's `role` field to `admin`.
3. Log in again with that account to access the admin dashboard.

---

## User Roles

| Role | Access |
|---|---|
| **Admin** | Platform-wide dashboard, all users, all projects, admin notifications |
| **Owner** | Full control of projects they create, including members and settings |
| **Researcher** | Create and edit tasks, documents, resources, and papers in projects they belong to |
| **Viewer** | Read-only access to projects they belong to |

---

## Usage Walkthrough

1. **Register and log in** with your email and password.
2. **Create a project** with a title, research area, start date, and deadline.
3. **Invite team members** and assign their roles. Invitees accept or reject from their notifications.
4. **Create and assign tasks**, then move them through To Do → In Progress → Completed.
5. **Upload documents and papers**, and add comments or feedback on them.
6. **Add resources, datasets, and references** to keep everything for the project in one place.
7. **Set milestones and deadlines**; reminders are sent as dates approach.
8. **Chat with the team** in the project chat room.
9. **Track progress** on the project dashboard, and review the **Activity** and **Contributions** tabs to see who did what.
10. **Admins** manage users and projects from the admin dashboard.

---

## Testing

### Manual feature testing

Each feature was verified through functional testing covering authentication, projects, team invitations, tasks, documents, comments, resources, papers, citations, milestones, chat, notifications, progress tracking, contribution tracking, and the admin dashboard.

### Testing real-time chat

1. Log in as User A in a normal browser window.
2. Log in as User B in an incognito window or a different browser.
3. Make sure both users are members of the same project.
4. Open **Chat** in both windows and send messages. They should appear instantly for both users.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `MongoNetworkError` / cannot connect to database | Check `MONGO_URI`, make sure MongoDB is running, and whitelist your IP in Atlas |
| CORS error in the browser | Make sure the server allows the client origin (`http://localhost:5173`) |
| Port already in use | Change `PORT` in `server/.env`, or stop the process using the port |
| File upload fails | Verify the Cloudinary credentials in `server/.env` |
| Chat messages do not appear instantly | Confirm both users are project members and the Socket.IO server is running |
| `Invalid token` / logged out unexpectedly | Log in again; check that `JWT_SECRET` has not changed |
| Blank page after `npm run dev` | Run `npm install` in `client/` again and check the browser console |

---


## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push the branch: `git push origin feature/your-feature`
5. Open a pull request into `main`.

---

## Contributors

Developed by:

- **Namitha Singu** – [@Namitha938](https://github.com/Namitha938)
- **Lohith Basetti** – [@lohith2605](https://github.com/lohith2605)

---

