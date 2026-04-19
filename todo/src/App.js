import { useEffect, useState } from "react";
import "./App.css";

function FilterBtn({ label, value, active, onClick }) {
  return (
    <button
      className={`filt-btn${active ? " active" : ""}`}
      onClick={() => onClick(value)}
    >
      {label}
    </button>
  );
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [Duration, setDuration] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchTasks = async () => {
    const res = await fetch("http://localhost:5000/tasks");
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!title.trim()) return;
    await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, Duration }),
    });
    setTitle("");
    setDuration("");
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, { method: "DELETE" });
    fetchTasks();
  };

  const toggleTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, { method: "PATCH" });
    fetchTasks();
  };

  const handleKeyDown = (e, next) => {
    if (e.key === "Enter") next();
  };

  const total = tasks.length;
  const done = tasks.filter((t) => t.status).length;
  const pending = total - done;

  const visible = tasks.filter((t) => {
    if (filter === "done") return t.status;
    if (filter === "pending") return !t.status;
    return true;
  });

  return (
    <div className="wrap">

      {/* Header */}
      <div className="header">
        <div className="logo">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 11 12 14 22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
        </div>
        <h1>My Tasks</h1>
      </div>

      {/* Stats */}
      <div className="stats">
        <div className="stat">
          <div className="stat-num">{total}</div>
          <div className="stat-lbl">Total</div>
        </div>
        <div className="stat">
          <div className="stat-num completed">{done}</div>
          <div className="stat-lbl">Completed</div>
        </div>
        <div className="stat">
          <div className="stat-num">{pending}</div>
          <div className="stat-lbl">Pending</div>
        </div>
      </div>

      {/* Add Task Form */}
      <div className="form-card">
        <span className="form-label">Add a task</span>
        <input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) =>
            handleKeyDown(e, () => document.getElementById("desc-input").focus())
          }
        />
        <input
          id="desc-input"
          placeholder="Duration (optional)"
          value={Duration}
          onChange={(e) => setDuration(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, addTask)}
        />
        <button className="add-btn" onClick={addTask}>
          + Add task
        </button>
      </div>

      {/* Filters */}
      <div className="filters">
        <FilterBtn label="All"       value="all"     active={filter === "all"}     onClick={setFilter} />
        <FilterBtn label="Pending"   value="pending" active={filter === "pending"} onClick={setFilter} />
        <FilterBtn label="Completed" value="done"    active={filter === "done"}    onClick={setFilter} />
      </div>

      {/* Task List */}
      <div className="task-list">
        {visible.length === 0 ? (
          <div className="empty">
            {filter === "done"
              ? "No completed tasks yet"
              : filter === "pending"
              ? "No pending tasks"
              : "No tasks yet — add one above!"}
          </div>
        ) : (
          visible.map((task) => (
            <div key={task._id} className={`task-card${task.status ? " done" : ""}`}>

              {/* Checkbox */}
              <div
                className={`check${task.status ? " checked" : ""}`}
                onClick={() => toggleTask(task._id)}
              >
                {task.status && (
                  <svg width="10" height="10" viewBox="0 0 12 10" fill="none"
                    stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 5 4.5 8.5 11 1" />
                  </svg>
                )}
              </div>

              {/* Content */}
              <div className="task-body">
                <div className="task-title">{task.title}</div>
                {task.Duration && (
                  <div className="task-desc">{task.Duration}</div>
                )}
              </div>

              {/* Delete */}
              <button
                className="del-btn"
                onClick={() => deleteTask(task._id)}
                title="Delete"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="#aaa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4h6v2" />
                </svg>
              </button>

            </div>
          ))
        )}
      </div>

    </div>
  );
}