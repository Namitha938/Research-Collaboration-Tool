# ResearchHub - Research Collaboration Tool (MERN)

## Run in VS Code
1. Install Node.js 20+ and open this folder in VS Code (`File > Open Folder`).
2. Open two terminals (`Ctrl + ~`, then the + button).

**Terminal 1 - backend**
```bash
cd server
cp .env.example .env      # Windows: copy .env.example .env  -> then fill in MONGO_URI and JWT_SECRET
npm install
npm run dev               # http://localhost:5000  (check /api/health)
npm run seed              # optional: creates admin@researchhub.edu / AdminPassword123!
```

**Terminal 2 - frontend**
```bash
cd client
npm install
npm run dev               # http://localhost:5173
```
Register at `/register`, then you land on the dashboard. Vite proxies `/api` to port 5000.

## Status
Working: register/login (JWT), landing page, sidebar dashboard, projects (create/list), admin login pages.
Not built yet (backend files are `// TODO`): tasks, documents, resources, papers/citations, chat (Socket.IO),
comments, milestones, notifications, activity, progress, admin API.
The dashboard's Active Tasks / Completed / Progress / Recent Activity / Upcoming Tasks are demo data.
