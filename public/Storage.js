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
        completedTasksSpan.textContent = localStorage.getItem('taskCount') || 0;
    }

    function updateCoinCount() {
        let coinCountSpan = document.querySelector("#coinCount span");
        coinCountSpan.textContent = localStorage.getItem('coinCount') || 0;
    }

    function updateSoldItemCount() {
        let soldItems = JSON.parse(localStorage.getItem('soldItems')) || [];
        document.getElementById('PrizeCount').querySelector('span').textContent = soldItems.length;
    }

    function updateDataAndSendToServer() {
        updateCompletedTasksCount();
        updateCoinCount();
        updateSoldItemCount();

        const taskCount = localStorage.getItem('taskCount') || 0;
        const coinCount = localStorage.getItem('coinCount') || 0;
        const soldItems = JSON.parse(localStorage.getItem('soldItems')) || [];

        const data = {
            taskCount: taskCount,
            coinCount: coinCount,
            soldItems: soldItems
        };

        fetch('/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Data sent successfully:', data);
        })
        .catch(error => {
            console.error('Error sending data:', error);
        });
    }

    updateDataAndSendToServer();
});
