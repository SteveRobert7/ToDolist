

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("itemDate").setAttribute("min", new Date().toISOString().split('T')[0]);
    loadItems();
});




function loadItems() {


    let todoList = JSON.parse(localStorage.getItem("todoList")) || [];

    todoList = todoList.sort((a, b) => {

        const priorityOrder = { high: 3, medium: 2, low: 1 };
        if (priorityOrder[a.priority] === priorityOrder[b.priority]) {
            return new Date(a.date) - new Date(b.date);
        } 
        else {
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        }

    });




    const todaysDate = new Date().toISOString().split('T')[0];
    const todaysTasksContainer = document.getElementById("todaysTasks");
    const futureTasksContainer = document.getElementById("futureTasks");
    const completedTasksContainer = document.getElementById("completedTasks");

    todaysTasksContainer.innerHTML = "";
    futureTasksContainer.innerHTML = "";
    completedTasksContainer.innerHTML = "";

    let todayTaskCounter = 1; 
    let futureTaskCounter = 1; 
    let completedTaskCounter = 1; 



    todoList.forEach(item => {

        const itemCard = document.createElement("div");
        itemCard.classList.add("item");

        if (item.completed) {
            const deadline = new Date(item.date).toLocaleDateString('en-GB');

            const taskCard = document.createElement("div");
            taskCard.classList.add("item");
            taskCard.classList.add("completed");

            taskCard.innerHTML = `
                <div>${completedTaskCounter}. ${item.name}</div>
                <div>Deadline: ${deadline}</div>
                <div>Priority: ${item.priority}</div>
                <button class="delete-btn" onclick="deleteItem('${item.name}')"><i class="material-icons">delete</i></button>
            `;
            
            completedTasksContainer.appendChild(taskCard);
            completedTaskCounter++; 

        } 
        
        else {
            const deadline = new Date(item.date).toLocaleDateString('en-GB');

            itemCard.innerHTML = `
                <div>${item.date === todaysDate ? todayTaskCounter : futureTaskCounter}. ${item.name}</div>
                <div>Deadline: ${deadline}</div>
                <div>Priority: ${item.priority}</div>
                <div>
                    <button class="done-btn" onclick="toggleCompletion('${item.name}')"><i class="material-icons">task_alt</i></button>
                    <button class="delete-btn" onclick="deleteItem('${item.name}')"><i class="material-icons">delete</i></button>
                </div>
            `;


            if (item.date === todaysDate) {
                todaysTasksContainer.appendChild(itemCard);
                todayTaskCounter++; 
            } 
            else {
                futureTasksContainer.appendChild(itemCard);
                futureTaskCounter++; 
            }
        }
    });
}



function addItem() {

    const itemName = document.getElementById("itemName").value;
    const itemDate = document.getElementById("itemDate").value;
    const priority = document.getElementById("priority").value;

    if (itemName && itemDate && priority) {
        const newItem = {
            name: itemName,
            date: itemDate,
            priority: priority,
            completed: false
        };

        const todoList = JSON.parse(localStorage.getItem("todoList")) || [];
        todoList.push(newItem);
        localStorage.setItem("todoList", JSON.stringify(todoList));

        loadItems();

        document.getElementById("itemName").value = "";
        document.getElementById("itemDate").value = "";
        document.getElementById("priority").value = "high";
    } 
    
    else {
        alert("Please fill in all fields.");
    }
}



function deleteItem(itemName) {
    let todoList = JSON.parse(localStorage.getItem("todoList")) || [];
    todoList = todoList.filter(item => item.name !== itemName);
    localStorage.setItem("todoList", JSON.stringify(todoList));
    loadItems();
}



function toggleCompletion(itemName) {
    let todoList = JSON.parse(localStorage.getItem("todoList")) || [];
    todoList = todoList.map(item => {
        if (item.name === itemName) {
            return {
                ...item,
                completed: !item.completed
            };
        }
        return item;
    });
    localStorage.setItem("todoList", JSON.stringify(todoList));
    loadItems(); 
}
