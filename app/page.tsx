
"use client";
import { useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  project: string;
  priority: "High" | "Medium" | "Low";
  status: "To Do" | "In Progress" | "Done";
};

const initialTasks: Task[] = [
  { id: 1, title: "Design landing page", project: "Portfolio Website", priority: "High", status: "In Progress" },
  { id: 2, title: "Build authentication UI", project: "DevConnect", priority: "High", status: "To Do" },
  { id: 3, title: "Update project documentation", project: "Portfolio Website", priority: "Medium", status: "Done" },
  { id: 4, title: "Test responsive layout", project: "BuildSphere", priority: "Low", status: "To Do" },
];


const projects = [
  { name: "Portfolio Website", category: "Frontend", color: "#8b5cf6" },
  { name: "DevConnect", category: "Full Stack", color: "#0ea5e9" },
  { name: "BuildSphere", category: "Productivity", color: "#10b981" },
];


export default function Home() {

  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [newTask, setNewTask] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [projectList, setProjectList] = useState(projects);
const [newProject, setNewProject] = useState("");
const [newCategory, setNewCategory] = useState("Frontend");
const [projectsLoaded, setProjectsLoaded] = useState(false);
  useEffect(() => {
  try {
    const savedTasks = localStorage.getItem("buildsphere-tasks");

    if (savedTasks !== null) {
      const parsedTasks: unknown = JSON.parse(savedTasks);

      if (Array.isArray(parsedTasks)) {
        setTasks(parsedTasks as Task[]);
      }
    }
  } catch (error) {
    console.error("Failed to load tasks:", error);
  } finally {
    setIsLoaded(true);
  }
}, []);
useEffect(() => {
  try {
    const savedProjects = localStorage.getItem("buildsphere-projects");

    if (savedProjects !== null) {
      const parsedProjects: unknown = JSON.parse(savedProjects);

      if (Array.isArray(parsedProjects)) {
        setProjectList(parsedProjects);
      }
    }
  } catch (error) {
    console.error("Failed to load projects:", error);
  } finally {
    setProjectsLoaded(true);
  }
}, []);

useEffect(() => {
  if (!projectsLoaded) return;

  try {
    localStorage.setItem(
      "buildsphere-projects",
      JSON.stringify(projectList)
    );
  } catch (error) {
    console.error("Failed to save projects:", error);
  }
}, [projectList, projectsLoaded]);

useEffect(() => {
  if (!isLoaded) return;

  try {
    localStorage.setItem("buildsphere-tasks", JSON.stringify(tasks));
  } catch (error) {
    console.error("Failed to save tasks:", error);
  }
}, [tasks, isLoaded]);

  const completed = tasks.filter((task) => task.status === "Done").length;
  const pending = tasks.filter((task) => task.status !== "Done").length;

const projectsWithProgress = projects.map((project) => {
  const projectTasks = tasks.filter(
    (task) => task.project === project.name
  );

  const completedTasks = projectTasks.filter(
    (task) => task.status === "Done"
  ).length;

  const progress =
    projectTasks.length === 0
      ? 0
      : Math.round((completedTasks / projectTasks.length) * 100);

  return { ...project, progress };
});

  const visibleTasks = tasks.filter((task) => {
    const matchesFilter = filter === "All" || task.status === filter;
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.project.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });
 
function addProject(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const name = newProject.trim();
  if (!name) return;

  const exists = projectList.some(
    (project) => project.name.toLowerCase() === name.toLowerCase()
  );

  if (exists) {
    alert("Project already exists!");
    return;
  }

  setProjectList((current) => [
    ...current,
    {
      name,
      category: newCategory,
      color: "#8b5cf6",
    },
  ]);

  setNewProject("");
  setNewCategory("Frontend");
}

function deleteProject(projectName: string) {
  const hasTasks = tasks.some(
    (task) => task.project === projectName
  );

  if (hasTasks) {
    alert("Delete or reassign this project's tasks first.");
    return;
  }

  setProjectList((current) =>
    current.filter((project) => project.name !== projectName)
  );
}


  function addTask() {
    const title = newTask.trim();
    if (!title) return;

    setTasks((current) => [
      {
        id: Date.now(),
        title,
        project: "BuildSphere",
        priority: "Medium",
        status: "To Do",
      },
      ...current,
    ]);
    setNewTask("");
  }

  function cycleStatus(id: number) {
    const order: Task["status"][] = ["To Do", "In Progress", "Done"];

    setTasks((current) =>
      current.map((task) => {
        if (task.id !== id) return task;
        const next = (order.indexOf(task.status) + 1) % order.length;
        return { ...task, status: order[next] };
      })
    );
  }

  function deleteTask(id: number) {
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#">
          <span className="brand-icon">B</span>
          <span>Build<span className="brand-light">Sphere</span></span>
        </a>

        <p className="nav-label">WORKSPACE</p>
        <a className="nav-item active" href="#overview"><span>▦</span> Overview</a>
        <a className="nav-item" href="#projects"><span>◫</span> My Projects</a>
        <a className="nav-item" href="#tasks"><span>☷</span> My Tasks</a>

        <p className="nav-label nav-label-spaced">PREFERENCES</p>
        <a className="nav-item" href="#goals"><span>◎</span> Goals</a>
        <a className="nav-item" href="#settings"><span>⚙</span> Settings</a>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">✦</div>
            <strong>Keep building.</strong>
            <p>Small steps lead to great projects.</p>
          </div>
          <div className="profile">
            <div className="avatar">KJ</div>
            <div className="profile-copy">
              <strong>Keshav Jha</strong>
              <span>Developer workspace</span>
            </div>
            <span className="profile-dots">···</span>
          </div>
        </div>
      </aside>

      <section className="main-panel" id="overview">
        <header className="topbar">
          <div className="breadcrumbs">Workspace <span>/</span> Overview</div>
          <div className="topbar-right">
            <span className="live-dot" /> Personal workspace
            <div className="avatar small-avatar">KJ</div>
          </div>
        </header>

        <div className="content">
          <section className="welcome-row">
            <div>
              <p className="eyebrow">YOUR PRODUCTIVITY SPACE</p>
              <h1>Build something <span>great.</span></h1>
              <p className="subtitle">Plan your work, track progress, and turn ideas into reality.</p>
            </div>
            <div className="date-chip">✦ &nbsp; BUILD • LEARN • SHIP</div>
          </section>

          <section className="stats-grid">
            <article className="stat-card">
              <div className="stat-top"><span>Total Projects</span><span className="stat-icon purple">◫</span></div>
              <div className="stat-number">03</div>
              <div className="stat-foot">Projects in your workspace</div>
            </article>
            <article className="stat-card">
              <div className="stat-top"><span>Total Tasks</span><span className="stat-icon blue">☷</span></div>
              <div className="stat-number">{tasks.length.toString().padStart(2, "0")}</div>
              <div className="stat-foot">Across all projects</div>
            </article>
            <article className="stat-card">
              <div className="stat-top"><span>Completed</span><span className="stat-icon green">✓</span></div>
              <div className="stat-number">{completed.toString().padStart(2, "0")}</div>
              <div className="stat-foot">Tasks successfully finished</div>
            </article>
            <article className="stat-card">
              <div className="stat-top"><span>In Progress / To Do</span><span className="stat-icon orange">◷</span></div>
              <div className="stat-number">{pending.toString().padStart(2, "0")}</div>
              <div className="stat-foot">Tasks still requiring attention</div>
            </article>
          </section>

          <section className="projects-section" id="projects">
            <div className="section-heading">
              <div>
                <h2>Your projects</h2>
                <p>Keep your current work moving forward.</p>
              </div>
              <span className="text-link">PROJECT OVERVIEW ↗</span>
            </div>
             
            <div className="project-grid">
          {projectList.map((project) => {
  const projectTasks = tasks.filter(
    (task) => task.project === project.name
  );

  const completedTasks = projectTasks.filter(
    (task) => task.status === "Done"
  ).length;

  const progress =
    projectTasks.length === 0
      ? 0
      : Math.round((completedTasks / projectTasks.length) * 100);

  return (
                <article className="project-card" key={project.name}>
                  <div className="project-card-top">
                    <div className="project-mark" style={{ background: `${project.color}18`, color: project.color }}>
                      {project.name.slice(0, 1)}
                    </div>
                    <button

  type="button"
  className="project-menu"
  onClick={() => deleteProject(project.name)}
  aria-label={`Delete ${project.name}`}
  title="Delete project"
>
  ×
</button>


                  </div>
                  <span className="project-category">{project.category}</span>
                  <h3>{project.name}</h3>
                  <div className="progress-label">
                    <span>Completion</span><strong>{progress}%</strong>
                  </div>
                  <div className="progress-track">
<div
  className="progress-fill"
  style={{
    width: `${progress}%`,
    background: project.color,
  }}
/>
                  </div>
                  <div className="project-footer"><span>Personal project</span><span>↗</span></div>
              </article>
  );
})}
            </div>
          </section>

          <section className="tasks-section" id="tasks">
            <div className="section-heading">
              <div>
                <h2>Task overview</h2>
                <p>Manage your work one task at a time.</p>
              </div>
              <span className="task-count">{tasks.length} tasks</span>
            </div>

            <form className="add-task-form" onSubmit={(event) => { event.preventDefault(); addTask(); }}>
              <input
                aria-label="New task title"
                placeholder="What needs to get done?"
                value={newTask}
                onChange={(event) => setNewTask(event.target.value)}
              />
              <button type="submit">+ Add task</button>
            </form>

            <div className="task-toolbar">
              <div className="filter-tabs">
                {["All", "To Do", "In Progress", "Done"].map((item) => (
                  <button
                    type="button"
                    key={item}
                    className={`filter-tab ${filter === item ? "selected" : ""}`}
                    onClick={() => setFilter(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <input
                className="search-input"
                aria-label="Search tasks"
                placeholder="⌕  Search tasks..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <div className="task-list">
              {visibleTasks.map((task) => (
                <article className="task-row" key={task.id}>
                  <button
                    className={`task-check ${task.status === "Done" ? "checked" : ""}`}
                    type="button"
                    aria-label={`Change status for ${task.title}`}
                    onClick={() => cycleStatus(task.id)}
                  >
                    {task.status === "Done" ? "✓" : ""}
                  </button>
                  <div className="task-main">
                    <strong className={task.status === "Done" ? "task-done" : ""}>{task.title}</strong>
                    <span>{task.project}</span>
                  </div>
                  <span className={`priority priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
                  <button className={`status-pill status-${task.status.toLowerCase().replace(" ", "-")}`} onClick={() => cycleStatus(task.id)} type="button">
                    {task.status} ↻
                  </button>
                  <button className="delete-task" type="button" aria-label={`Delete ${task.title}`} onClick={() => deleteTask(task.id)}>×</button>
                </article>
              ))}
              {visibleTasks.length === 0 && <div className="empty-state">No tasks match your search. Try another filter or add a task.</div>}
            </div>
            <p className="interaction-note">Tip: click a status to cycle through To Do → In Progress → Done.</p>
          </section>

          <footer className="footer">BUILT WITH PURPOSE <span>•</span> BUILT WITH BUILDSPHERE</footer>
        </div>
      </section>
    </main>
  );
}
