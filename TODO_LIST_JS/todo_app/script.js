// Select DOM elements
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

// Load and render tasks on page load
document.addEventListener("DOMContentLoaded", renderTasks);

// Add task on Enter key press
inputBox.addEventListener('keydown', function(event){
    if (event.key === 'Enter'){
        addTask();
    }
});

// Function to add a new task
function addTask(){
    const taskText = inputBox.value.trim();
    if (taskText === ''){
        alert("You must write something!");
    }
    else{
        const task = {
            text: taskText,
            completed: false
        };
        const tasks = loadTasks();
        tasks.push(task);
        saveTasks(tasks);
        renderTasks();
    }
    inputBox.value = "";
}

// Function to load tasks from localStorage
function loadTasks(){
    try {
        return JSON.parse(localStorage.getItem("tasks")) || [];
    } catch (e) {
        console.error("Error loading tasks:", e);
        return [];
    }
}
// Function to save tasks to localStorage
function saveTasks(tasks){
    try {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (e) {
        console.error("Error saving tasks:", e);
        alert("Failed to save tasks.");
    }
}

function renderTasks() {
    listContainer.innerHTML = ""; // Clear the current list
    const tasks = loadTasks();

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.textContent = task.text;

        if (task.completed) {
            li.classList.add("checked");
        }

        // Add delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "\u00d7"; // Unicode for ×
        deleteBtn.classList.add("delete-button");
        deleteBtn.dataset.index = index; // Properly set data-index

        li.appendChild(deleteBtn);
        listContainer.appendChild(li);
    });
}

// Event listener for clicks within the list container
listContainer.addEventListener("click", function(e) {
    const tasks = loadTasks();

    if (e.target.tagName === "LI") {
        const index = Array.from(listContainer.children).indexOf(e.target);
        tasks[index].completed = !tasks[index].completed;
        saveTasks(tasks);
        renderTasks();
        e.target.classList.toggle("checked");

    } else if (e.target.tagName === "BUTTON" && e.target.classList.contains("delete-button")) {
        const index = parseInt(e.target.dataset.index, 10); // Convert to number
        if (!isNaN(index)) {
            swal({
                title: "Are you sure?",
                text: "Once deleted, you will not be able to recover this task!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    tasks.splice(index, 1); // Remove the task
                    saveTasks(tasks); // Save updated tasks
                    renderTasks(); // Rerender the tasks
                    swal("Poof! Your task has been deleted!", {
                        icon: "success",
                    });
                } else {
                    swal("Your task is safe!");
                }
            });
        }
    }
}, false);