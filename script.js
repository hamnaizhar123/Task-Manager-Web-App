const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

const emptyMessage = document.getElementById("emptyMessage");
const currentDate = document.getElementById("currentDate");

const filterButtons = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

/* Current Date */

const today = new Date();

currentDate.textContent = today.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
});


/* Save Tasks */

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


/* Add Task */

function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";

    renderTasks();

    taskInput.focus();
}


/* Delete Task */

function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    renderTasks();
}


/* Toggle Task */

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();

    renderTasks();
}


/* Render Tasks */

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "pending") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <input
                type="checkbox"
                class="task-check"
                ${task.completed ? "checked" : ""}
            >

            <span class="task-text"></span>

            <button class="delete-btn">
                Delete
            </button>
        `;

        const checkbox = li.querySelector(".task-check");
        const taskText = li.querySelector(".task-text");
        const deleteButton = li.querySelector(".delete-btn");

        taskText.textContent = task.text;

        checkbox.addEventListener("change", () => {
            toggleTask(task.id);
        });

        deleteButton.addEventListener("click", () => {
            deleteTask(task.id);
        });

        taskList.appendChild(li);
    });

    updateSummary();

    if (filteredTasks.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }
}


/* Update Summary */

function updateSummary() {

    const completed = tasks.filter(task => task.completed).length;

    const pending = tasks.length - completed;

    totalTasks.textContent = tasks.length;

    pendingTasks.textContent = pending;

    completedTasks.textContent = completed;
}


/* Filters */

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();
    });
});


/* Add Button */

addTaskBtn.addEventListener("click", addTask);


/* Enter Key */

taskInput.addEventListener("keydown", event => {

    if (event.key === "Enter") {
        addTask();
    }

});


/* Initial Load */

renderTasks();