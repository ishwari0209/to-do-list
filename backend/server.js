require("dotenv").config();
const express = require("express");


const connectDB = require("./config/db");
const Task = require("./models/Task");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
console.log(process.env.MONGO_URI);
// Connect DB       
connectDB();
const cors = require("cors");
app.use(cors());
// ================= ROUTES =================
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});
// GET all tasks
app.get("/tasks", async (req, res) => {
const tasks = await Task.find();
res.json(tasks);
});

// POST create task
app.post("/tasks", async (req, res) => {
const newTask = new Task({
title: req.body.title,
Duration: req.body.Duration,
status: false
});

await newTask.save();
res.json(newTask);
});

// GET completed tasks
app.get("/tasks/completed", async (req, res) => {
const tasks = await Task.find({ status: true });
res.json(tasks);
});

// GET pending tasks
app.get("/tasks/pending", async (req, res) => {
const tasks = await Task.find({ status: false });
res.json(tasks);
});

// GET single task by id
app.get("/tasks/:id", async (req, res) => {
const task = await Task.findById(req.params.id);
res.json(task);
});

// DELETE task
app.delete("/tasks/:id", async (req, res) => {
await Task.findByIdAndDelete(req.params.id);
res.json({ message: "task deleted" });
});

// PUT update full task
app.put("/tasks/:id", async (req, res) => {
const updatedTask = await Task.findByIdAndUpdate(
req.params.id,
{
title: req.body.title,
Duration: req.body.Duration
},
{ new: true }
);

res.json(updatedTask);
});

// PATCH toggle status
app.patch("/tasks/:id", async (req, res) => {
const task = await Task.findById(req.params.id);

if (!task) {
return res.json({ message: "Task not found" });
}

task.status = !task.status;
await task.save();

res.json(task);
});

// START SERVER
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
