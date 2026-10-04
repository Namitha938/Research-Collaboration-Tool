# ResearchHub – Research Collaboration Tool (MERN)

ResearchHub is a web-based platform that helps researchers and students work together on research projects. Teams can share resources, manage tasks, chat in real time, and track project progress in one centralized system.

## Features

- **Authentication & roles** – registration, login, JWT-based sessions, and role-based access (Admin, Researcher, Viewer)
- **Project management** – create, edit, and delete research projects with status, research area, start date, deadline, and progress
- **Team collaboration** – invite members, accept or reject invitations, assign roles, and remove members
- **Tasks** – create, assign, and track tasks with priority, due dates, and status workflow (To Do → In Progress → Completed)
- **Documents** – upload, view, download, and delete project files (stored on Cloudinary)
- **Resources & datasets** – manage links, datasets, repositories, files, and references with search, filters, and tags
- **Research papers** – store paper metadata (authors, abstract, year, journal, DOI, URL, tags, notes) and PDFs
- **Citation & reference management** – add, edit, search, and organize references per project
- **Milestones & deadlines** – plan and track key project dates
- **Real-time team chat** – project-based chat rooms powered by Socket.IO with message history
- **Notifications** – invitations, role changes, task assignments, completions, with read/unread tracking
- **Activity history** – log of who did what across each project
- **Admin dashboard** – platform statistics, user management, project management, and admin notifications

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Real-time | Socket.IO |
| Auth | JSON Web Tokens (JWT), bcrypt |
| File storage | Cloudinary |

## Project Structure

```
Research-Collaboration-Tool/
├── client/                     # React frontend
│   └── src/
│       ├── api/                # Axios service files (projects, admin, milestones, ...)
│       ├── components/         # Reusable UI (activity, dashboard, documents,
│       │                       #   milestones, references, research-papers,
│       │                       #   resources, team)
│       └── pages/              # Route pages (Dashboard, Chat, admin/...)
├── server/                     # Express backend
│   ├── controllers/            # Request handlers
│   ├── middleware/             # Auth and admin middleware
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # API routes
│   ├── sockets/                # Socket.IO chat logic
│   ├── utils/                  # Helpers (e.g. admin notifications)
│   └── server.js               # Entry point
├── scratch/                    # Experimental / test code
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [MongoDB](https://www.mongodb.com/) (local installation or a MongoDB Atlas cluster)
- A [Cloudinary](https://cloudinary.com/) account (for file uploads)

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

Start the server:

```bash
npm run dev
```

### 3. Set up the frontend

Open a second terminal:

```bash
cd client
npm install
```

Start the client:

```bash
npm run dev
```

The app runs at **http://localhost:5173**.

## Creating an Admin Account

Admin accounts are not created through the public registration form. To make a user an admin:

1. Register a normal account.
2. In MongoDB (Compass or Atlas), open the `users` collection and set that user's `role` field to `admin`.
3. Log in again with that account to access the admin dashboard.

## User Roles

| Role | Access |
|---|---|
| **Admin** | Platform-wide dashboard, all users, all projects, admin notifications |
| **Owner** | Full control of projects they create, including members and settings |
| **Researcher** | Create and edit tasks, documents, resources, and papers in projects they belong to |
| **Viewer** | Read-only access to projects they belong to |

## Testing Real-Time Chat

1. Log in as User A in a normal browser window.
2. Log in as User B in an incognito window or a different browser.
3. Make sure both users are members of the same project.
4. Open **Chat** in both windows and send messages. They should appear instantly for both users.

## Contributors

Developed by:

- [Namitha Singu](https://github.com/Namitha938)
- [Lohith Basetti](https://github.com/lohith2605)