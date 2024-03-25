document.addEventListener('DOMContentLoaded', function() {
    const profilePicture = localStorage.getItem('profilePicture');

    if (profilePicture) {
        document.getElementById('profilePicture').src = profilePicture;
    }

    const tasks = JSON.parse(localStorage.getItem('tasks'));

    if (tasks) {
        const taskList = document.getElementById('taskList');

        tasks.forEach(function(task) {
            const existingTask = Array.from(taskList.querySelectorAll('.task-item label')).find(label => label.textContent === task.content);

            if (!existingTask) {
                const taskItem = document.createElement("div");
                taskItem.classList.add("task-item");

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = task.isChecked;

                const label = document.createElement("label");
                label.textContent = task.content;

                taskItem.appendChild(checkbox);
                taskItem.appendChild(label);
                taskList.appendChild(taskItem);
            }
        });
    }

    function updateCompletedTasksCount() {
        let completedTasksSpan = document.querySelector("#completedTasks span");
        completedTasksSpan.textContent = taskCount;
    }

    function updateCoinCount() {
        let completedTasksSpan = document.querySelector("#coinCount span");
        completedTasksSpan.textContent = coinCount;
    }

    function updateSoldItemCount() {
        let soldItems = JSON.parse(localStorage.getItem('soldItems')) || [];
        document.getElementById('PrizeCount').querySelector('span').textContent = soldItems.length;
    }

})