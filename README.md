# Research Collaboration Tool (MERN)

## Run
```
# terminal 1
cd server
npm run dev

# terminal 2
cd client
npm run dev
```

- Server: http://localhost:5000  (health check: /api/health)
- Client: http://localhost:5173
- MongoDB must be running locally, or set MONGO_URI in server/.env to a MongoDB Atlas URL.

## Team split
- Member A: auth, projects, tasks, milestones, progress, admin, reminders
- Member B: documents, comments, chat, notifications, paper search, references, activity
