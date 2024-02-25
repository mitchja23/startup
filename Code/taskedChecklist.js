document.getElementById("newTaskBtn").addEventListener("click", addNewTask);

function addNewTask() {
    let taskList = document.getElementById("taskList");

    let taskItem = document.createElement("div");
    taskItem.classList.add("task-item");

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "task";

    let input = document.createElement("input");
    input.type = "text";
    input.maxLength = 20;

    let rating = createDropdown();

    taskItem.appendChild(checkbox);
    taskItem.appendChild(input);
    taskItem.appendChild(rating);

    taskList.appendChild(taskItem);

    input.focus();

    input.addEventListener("input", function() {
        createLabelIfReady(taskItem);
    });

    rating.addEventListener("change", function() {
        createLabelIfReady(taskItem);
    });

    checkbox.addEventListener("change", function() {
        if (checkbox.checked) {
            openFileExplorer(taskItem);
        }
    });
}

function openFileExplorer(taskItem) {
    let fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.addEventListener("change", function() {
        handleFileSelect(taskItem, fileInput.files[0]);
    });

    fileInput.click();
}

function handleFileSelect(taskItem, file) {
    console.log("Selected file:", file);
}

function createLabelIfReady(taskItem) {
    let input = taskItem.querySelector("input[type='text']");
    let rating = taskItem.querySelector("select");

    let inputValue = input.value.trim();
    let selectValue = rating.value;

    if (inputValue && selectValue !== "none") {
        let label = document.createElement("label");
        label.textContent = inputValue + " - " + selectValue;
        taskItem.appendChild(label);

        taskItem.removeChild(input);
        taskItem.removeChild(rating);

        saveTasksToLocalStorage();
    }
}

function createDropdown() {
    let rating = document.createElement("select");
    let none = document.createElement("option");
    none.value = "none";
    none.textContent = "Select Difficulty";
    rating.appendChild(none);

    let easy = document.createElement("option");
    easy.value = "Easy";
    easy.textContent = "Easy";
    rating.appendChild(easy);

    let medium = document.createElement("option");
    medium.value = "Medium";
    medium.textContent = "Medium";
    rating.appendChild(medium);

    let hard = document.createElement("option");
    hard.value = "Hard";
    hard.textContent = "Hard";
    rating.appendChild(hard);

    return rating;
}



document.getElementById("clearTasksBtn").addEventListener("click", function() {
    localStorage.removeItem("tasks");
    document.getElementById("taskList").innerHTML = "";
});


function handleSubmit(event) {
    event.preventDefault();

    const checkedTasks = Array.from(document.querySelectorAll('input[name="task"]:checked'))
                               .map(checkbox => checkbox.parentElement.textContent.trim());

    let storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

    storedTasks = storedTasks.filter(task => !checkedTasks.includes(task.content));

    localStorage.setItem('tasks', JSON.stringify(storedTasks));

   
    checkedTasks.forEach(taskText => {
        const taskItems = document.querySelectorAll('.task-item');
        taskItems.forEach(taskItem => {
            if (taskItem.querySelector('label').textContent.trim() === taskText) {
                taskItem.remove();
            }
        });
    });
}

