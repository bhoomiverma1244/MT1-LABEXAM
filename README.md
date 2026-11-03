# MT1-LABEXAM — Employee Task Management Web Application

Implementation of the supplied Full Stack Development lab examination using Node.js, the built-in HTTP and FS modules, and Express.js. No database is used; task records are stored in JavaScript arrays.

## Project structure

```text
MT1-LABEXAM/
├── package.json
├── httpServer.js
├── expressApp.js
├── public/
│   └── index.html
└── screenshots/
    └── .gitkeep
```

## Requirements

- Install Node.js (LTS recommended).
- Open a terminal in this project directory.

## Setup

```bash
npm install
```

## Part A — Node.js HTTP server (port 3000)

```bash
node httpServer.js
```

Open these URLs in a browser:

- http://localhost:3000/ — welcome HTML
- http://localhost:3000/tasks — tasks in JSON
- http://localhost:3000/about — application information
- http://localhost:3000/home — `public/index.html` read using the FS module

POST `/add-task` accepts JSON. Example using EchoAPI:

URL: `http://localhost:3000/add-task`

```json
{
  "id": 4,
  "taskName": "Develop REST API",
  "assignedTo": "Amit Kumar",
  "status": "Pending"
}
```

## Part B — Express REST API (port 4000)

Open a second terminal:

```bash
node expressApp.js
```

Test these endpoints using EchoAPI. Select **Body → raw → JSON** for POST and PUT.

| Method | URL | Purpose |
|---|---|---|
| GET | `http://localhost:4000/tasks` | Get all tasks |
| GET | `http://localhost:4000/tasks/1` | Get task with ID 1 |
| POST | `http://localhost:4000/tasks` | Add a task |
| PUT | `http://localhost:4000/tasks/1` | Update task with ID 1 |
| DELETE | `http://localhost:4000/tasks/1` | Delete task with ID 1 |

### Sample POST body

```json
{
  "id": 4,
  "taskName": "Develop REST API",
  "assignedTo": "Amit Kumar",
  "status": "Pending",
  "priority": "Medium"
}
```

### Sample PUT body

```json
{
  "taskName": "Develop Login Page",
  "assignedTo": "Rahul Sharma",
  "status": "Completed",
  "priority": "High"
}
```

The Express API returns status `201` for successful creation, `404` when a task or route is not found, and `400` for invalid input. Changes are held in memory and reset when the server restarts.

## Screenshots required for submission

Run the servers and take your own screenshots; the `screenshots/` directory is provided for them. Capture:

1. HTTP server terminal showing port 3000.
2. Browser `/` welcome page.
3. Browser `/tasks` JSON response.
4. Browser `/home` static page served using FS.
5. EchoAPI GET all tasks and GET task by ID.
6. EchoAPI POST success response.
7. EchoAPI PUT success response.
8. EchoAPI DELETE success response.
9. GitHub repository showing commit history.

## GitHub submission

Create a GitHub repository named `MT1-LABEXAM`, then run:

```bash
git init
git add .
git commit -m "Initial project setup"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/MT1-LABEXAM.git
git push -u origin main
```

After each module or meaningful update:

```bash
git add .
git commit -m "Implement HTTP server and routes"
git push
```

Replace `YOUR-USERNAME` with your GitHub username. Do not commit `node_modules/`; add it to `.gitignore` if you install dependencies.
