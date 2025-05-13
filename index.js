document.addEventListener("DOMContentLoaded",() => {
    //Write everything inside this

    // --------------- Storing in local storage --------------- 
    //to store the task in local storage
    function getTasks() {
        return JSON.parse(localStorage.getItem("tasks")) || [];
    }
    
    //This function saves an array of tasks into localStorage.
    // JSON.stringify(tasks) converts the array into a string so it can be stored.
    
    function saveTasks(tasks) {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    // -------------------------------------------------------

    // ---------------If No taskForm, show message---------------
    function updateEmptyMessage() {
        const existingMessage = document.querySelector('.text');
        const tasks = getTasks();
    
        if (tasks.length === 0) {
            if (!existingMessage) {
                const text = document.createElement('div');
                text.classList.add('text');
                text.innerHTML = `<h2>No Recent Task To Do!</h2>`;
                taskList.appendChild(text);
            }
        } else {
            if (existingMessage) {
                existingMessage.remove();
            }
        }
    }
    // -----------------------------------------------------------

    let editingIndex = null; 
    const popUpForm = document.getElementById('popUpForm');
    const createBtn = document.getElementById('CreateTask');
    const cancelBtn = document.getElementById('cancel');
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('List');
    const today = new Date().toISOString().split('T')[0];
    const editform = document.getElementById('editForm');

    //Setting the date so that user can't select previous date
    document.getElementById('dueDate').setAttribute('min',today);

    //---------------Add Task Button---------------
    createBtn.addEventListener('click',() => {
        popUpForm.classList.toggle('hide');
        createBtn.classList.toggle('hide');
    });

    //---------Cancel Add/Edit Task Button---------
    cancelBtn.addEventListener('click',() => {
        popUpForm.classList.toggle('hide');
        createBtn.classList.toggle('hide');
    });

    //---------------Adding newtask to local storage and displaying---------------
    function addTaskToDOM(newTask){
        const item = document.createElement('div');
        item.classList.add('item');

        const isCompleted = newTask.completed ? 'checked' : '';

        item.innerHTML = `
            <div class="task-header">
                <input type="checkbox" class="task-check" ${isCompleted}>
                <h2 class="task-name ${isCompleted ? 'done' : ''}">${newTask.Name}</h2>
            </div>
            <p>${newTask.Descp}</p>
            <p><strong>Due: </strong>${newTask.Date}</p>
            <div>
                <button class="deletebtn">Delete</button>
                <button class="edit">Edit</button>
            </div>
        `;

        const checkBox = item.querySelector('.task-check');
        const taskNameEl = item.querySelector('.task-name');
    
        checkBox.addEventListener('change', () => {
            taskNameEl.classList.toggle('done');
            // Update completion status in localStorage
            const tasks = getTasks();
            const index = tasks.findIndex(t => t.Name === newTask.Name && t.Descp === newTask.Descp && t.Date === newTask.Date);
            if (index !== -1) {
                tasks[index].completed = checkBox.checked;
                saveTasks(tasks);
            }
        });

        //attaching delete button listener at the time of creation
        item.querySelector('.deletebtn').addEventListener('click',() => {
            // const isConfirmed = confirm("Are you sure you want to delete this task?");
            // if(isConfirmed){
            //     item.remove();
            //     const tasks = getTasks().filter(t => !(t.Name === newTask.Name && t.Descp === newTask.Descp && t.Date === newTask.Date)); 
            //     saveTasks(tasks);
            //     updateEmptyMessage();
            // }

            // Store the current item and task in temporary variables
            const modal = document.getElementById('confirmModal');
            modal.classList.remove('hide');

            const confirmBtn = document.getElementById('confirmDelete');
            const cancelBtn = document.getElementById('cancelDelete');

            // Remove existing event listeners to avoid duplicates
            const newConfirmBtn = confirmBtn.cloneNode(true);
            confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
            const newCancelBtn = cancelBtn.cloneNode(true);
            cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

            // Attach fresh event listeners
            newConfirmBtn.addEventListener('click', () => {
                item.remove();
                const tasks = getTasks().filter(t => !(t.Name === newTask.Name && t.Descp === newTask.Descp && t.Date === newTask.Date)); 
                saveTasks(tasks);
                updateEmptyMessage();
                modal.classList.add('hide');
            });

            newCancelBtn.addEventListener('click', () => {
                modal.classList.add('hide');
            });
        });

        //attaching edit button listener at the time of creation
        item.querySelector('.edit').addEventListener('click',() => {
            if(!(popUpForm.classList.contains('hide'))){
                popUpForm.classList.toggle('hide');
                editform.classList.toggle('hide');
            }
            if(editform.classList.contains('hide')){
                createBtn.classList.toggle('hide');
                editform.classList.toggle('hide');
            }

            const Name = (newTask.Name !== "") ? newTask.Name : "";
            const Descp = newTask.Descp;
            const Date = (newTask.Date !== "") ? newTask.Date : "";
            document.getElementById('editTaskName').value = `${Name}`;
            document.getElementById('editDescp').value = `${Descp}`;
            document.getElementById('editDueDate').value = `${Date}`;
            const tasks = getTasks();
            editingIndex = tasks.findIndex(t => (t.Name == Name && t.Descp==Descp && t.Date == Date));
        });

        //Add to task list div
        taskList.appendChild(item);
    }

    //----------------------Edit button of form----------------------
    document.getElementById('EditForm').addEventListener('click',()=>{
        if(editingIndex !== null){
            const tasks = getTasks();
            tasks[editingIndex].Name = document.getElementById('editTaskName').value;
            tasks[editingIndex].Descp = document.getElementById('editDescp').value;
            tasks[editingIndex].Date = document.getElementById('editDueDate').value;
            saveTasks(tasks);
        }

        createBtn.classList.toggle('hide');
        editform.classList.toggle('hide');
    });
    //---------------------------------------------------------------

    // 5. Load saved tasks from localStorage on page load
    getTasks().forEach(addTaskToDOM);
    updateEmptyMessage();

    taskForm.addEventListener('submit',(e) =>{
        console.log("Form submitted");
        e.preventDefault(); //prevent reload

        //Getting values from form
        const Name = document.getElementById('taskName').value;
        const Descp = document.getElementById('Descp').value;
        const Date = document.getElementById('dueDate').value;

        const newTask = {Name,Descp,Date,completed: false};

        const tasks = getTasks();
        tasks.push(newTask);
        saveTasks(tasks);

        addTaskToDOM(newTask);
        updateEmptyMessage();

        taskForm.reset();
        createBtn.classList.toggle('hide');
        popUpForm.classList.toggle('hide');
    });

});