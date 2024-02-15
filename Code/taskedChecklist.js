document.getElementById("newTaskBtn").addEventListener("click", function() {
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
        createLabelIfReady();
    });
    

    rating.addEventListener("change", function() {
        createLabelIfReady();
    });
    
    function createLabelIfReady() {
        let inputValue = input.value.trim();
        let selectValue = rating.value;
        
        if (inputValue && selectValue !== "none") {
            var label = document.createElement("label");
            label.textContent = inputValue + " - " + selectValue;
            taskItem.appendChild(label);
            
            taskItem.removeChild(input);
            taskItem.removeChild(rating);
        }
    }
});

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
