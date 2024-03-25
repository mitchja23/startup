document.addEventListener("DOMContentLoaded", async () => {
    try {
        const userId = extractIdFromUrl();
        const tasksDataResponse = await fetch(`/api/users/${userId}/tasks`);
        if (!tasksDataResponse.ok) {
            throw new Error('Failed to fetch tasks data');
        }
        const tasksData = await tasksDataResponse.json();

        renderTasks(tasksData);

    } catch (error) {
        console.error('Error loading tasks data:', error);
  
    }
});

function renderTasks(tasksData) {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = ""; 

    tasksData.forEach(task => {
        const taskItem = document.createElement("div");
        taskItem.classList.add("task-item");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "task";

        const label = document.createElement("label");
        label.textContent = task.content + " - " + task.difficulty;

        taskItem.appendChild(checkbox);
        taskItem.appendChild(label);

        taskList.appendChild(taskItem);
    });
}
