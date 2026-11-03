import express from "express";

const app = express();
const PORT = 4000;

app.use(express.json());

let tasks = [
  { id: 1, taskName: "Develop Login Page", assignedTo: "Rahul Sharma", status: "Pending", priority: "High" },
  { id: 2, taskName: "Design Dashboard", assignedTo: "Priya Verma", status: "In Progress", priority: "Medium" },
  { id: 3, taskName: "Test Registration Form", assignedTo: "Amit Kumar", status: "Completed", priority: "Low" }
];

function validateTask(body, requireId = false) {
  const required = requireId
    ? ["id", "taskName", "assignedTo", "status", "priority"]
    : ["taskName", "assignedTo", "status", "priority"];
  return required.filter(field =>
    body[field] === undefined || body[field] === null || String(body[field]).trim() === ""
  );
}

// GET: retrieve all tasks.
app.get("/tasks", (req, res) => {
  res.status(200).json(tasks);
});

// GET: retrieve one task by ID.
app.get("/tasks/:id", (req, res) => {
  const task = tasks.find(item => item.id === Number(req.params.id));
  if (!task) return res.status(404).json({ message: "Task not found." });
  res.status(200).json(task);
});

// POST: add a task.
app.post("/tasks", (req, res) => {
  const missing = validateTask(req.body, true);
  if (missing.length) {
    return res.status(400).json({ message: "Invalid task details.", missing });
  }

  const id = Number(req.body.id);
  if (!Number.isInteger(id) || tasks.some(item => item.id === id)) {
    return res.status(400).json({ message: "Task ID must be a unique integer." });
  }

  const task = {
    id,
    taskName: String(req.body.taskName).trim(),
    assignedTo: String(req.body.assignedTo).trim(),
    status: String(req.body.status).trim(),
    priority: String(req.body.priority).trim()
  };
  tasks.push(task);
  res.status(201).json({ message: "Task added successfully", task });
});

// PUT: update an existing task. Only supplied fields are changed.
app.put("/tasks/:id", (req, res) => {
  const task = tasks.find(item => item.id === Number(req.params.id));
  if (!task) return res.status(404).json({ message: "Task not found." });

  const allowedFields = ["taskName", "assignedTo", "status", "priority"];
  const suppliedFields = allowedFields.filter(field => req.body[field] !== undefined);
  if (!suppliedFields.length) {
    return res.status(400).json({ message: "Provide at least one field to update." });
  }
  if (suppliedFields.some(field =>
    req.body[field] === null || String(req.body[field]).trim() === ""
  )) {
    return res.status(400).json({ message: "Task fields cannot be empty." });
  }

  for (const field of suppliedFields) {
    task[field] = String(req.body[field]).trim();
  }
  res.status(200).json({ message: "Task updated successfully", task });
});

// DELETE: remove a task.
app.delete("/tasks/:id", (req, res) => {
  const taskIndex = tasks.findIndex(item => item.id === Number(req.params.id));
  if (taskIndex === -1) return res.status(404).json({ message: "Task not found." });

  const [deletedTask] = tasks.splice(taskIndex, 1);
  res.status(200).json({ message: "Task deleted successfully", task: deletedTask });
});

// Malformed JSON and other request errors.
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ message: "Invalid JSON request body." });
  }
  return res.status(500).json({ message: "Internal server error." });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});
