document.getElementById("newTaskBtn").addEventListener("click", function() {
    var taskList = document.getElementById("taskList");
    
    var taskItem = document.createElement("div");
    taskItem.classList.add("task-item");
    
   
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "task";
    
    var label = document.createElement("label");
    
    var input = document.createElement("input");
    input.type = "text";
    input.maxLength = 20; 
    
    taskItem.appendChild(checkbox);
    taskItem.appendChild(input);
    taskItem.appendChild(label);
    
    taskList.appendChild(taskItem);
    
    input.focus();
    
    input.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            label.textContent = input.value;
            try {
                taskItem.removeChild(input);
            } catch (error) {
            }
        }
    });

    input.addEventListener("blur", function() {
        label.textContent = input.value;
        try {
            taskItem.removeChild(input);
        } catch (error) {
        }
    });
});
