import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;

// In-memory task data (no database required).
const tasks = [
  { id: 1, taskName: "Develop Login Page", assignedTo: "Rahul Sharma", status: "Pending" },
  { id: 2, taskName: "Design Dashboard", assignedTo: "Priya Verma", status: "In Progress" },
  { id: 3, taskName: "Test Registration Form", assignedTo: "Amit Kumar", status: "Completed" }
];

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data, null, 2));
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request body is too large."));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON request body."));
      }
    });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = requestUrl.pathname;

  if (req.method === "GET" && pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(`<!DOCTYPE html>
      <html><head><title>Employee Task Management</title></head>
      <body><h1>Welcome to Employee Task Management Application</h1>
      <p>Use <a href="/tasks">/tasks</a>, <a href="/about">/about</a> or <a href="/home">/home</a>.</p>
      </body></html>`);
  }

  if (req.method === "GET" && pathname === "/tasks") {
    return sendJson(res, 200, tasks);
  }

  if (req.method === "POST" && pathname === "/add-task") {
    try {
      const task = await readRequestBody(req);
      const requiredFields = ["id", "taskName", "assignedTo", "status"];
      const missing = requiredFields.filter(field =>
        task[field] === undefined || task[field] === null || String(task[field]).trim() === ""
      );

      if (missing.length) {
        return sendJson(res, 400, { message: "Missing required task details.", missing });
      }
      if (!Number.isInteger(Number(task.id)) || tasks.some(item => item.id === Number(task.id))) {
        return sendJson(res, 400, { message: "Task ID must be a unique integer." });
      }

      const newTask = {
        id: Number(task.id),
        taskName: String(task.taskName).trim(),
        assignedTo: String(task.assignedTo).trim(),
        status: String(task.status).trim()
      };
      tasks.push(newTask);
      return sendJson(res, 201, { message: "Task added successfully", task: newTask });
    } catch (error) {
      return sendJson(res, 400, { message: error.message });
    }
  }

  if (req.method === "GET" && pathname === "/about") {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end("Employee Task Management Application built using Node.js HTTP and FS modules.");
  }

  if (req.method === "GET" && pathname === "/home") {
    const indexPath = path.join(__dirname, "public", "index.html");
    return fs.readFile(indexPath, "utf8", (error, html) => {
      if (error) {
        return sendJson(res, 500, { message: "Unable to read the home page." });
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
    });
  }

  return sendJson(res, 404, { message: "Route not found." });
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
