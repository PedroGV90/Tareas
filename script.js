document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskInputId = document.getElementById('task-id');
    const taskList = document.getElementById('task-list');
    const filterInput = document.getElementById('input-filter');
    const btnDeleteAll = document.getElementById('btn-delete-all');


    // Array para almacenar las tareas
    // la inicializo con datos almacenados
    let tasks = JSON.parse(localStorage.getItem('lista-tareas')) || [];
    renderTasks();

    // Escuchar el evento submit del formulario
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        if (taskText) {
            addTask(taskText);
            taskInput.value = '';
        }
    });

    filterInput.addEventListener('input', (e) => {
        e.preventDefault();
        //debugger;
        const valor = e.target.value;
        renderTasks(valor)
    });

    btnDeleteAll.addEventListener('click', (e) => {
        removeAllTask();
        renderTasks();
    });

    // Escuchar eventos de clic en la lista de tareas
    taskList.addEventListener('click', (e) => {
        const taskId = e.target.dataset.id;
        if (e.target.classList.contains('delete-btn')) {
            removeTask(taskId);
        } else if (e.target.classList.contains('delete-edit')) {
            getTaskById(taskId);
        } else if (e.target.tagName === 'LI') {
            toggleComplete(taskId);
        }
    });

    // Función para agregar una tarea
    function addTask(taskText) {

        if (taskInputId.value != '') {
            editTask(taskInputId.value);
        } else {
            const newTask = {
                id: Date.now().toString(),
                text: taskText,
                completed: false
            };
            tasks.push(newTask);
            localStorage.setItem('lista-tareas', JSON.stringify(tasks));
            renderTasks();
        }


    }

    // Función para editar una tarea
    function editTask(taskId) {
        const task = tasks.find(task => task.id === taskId);
        if (!task) return;

        task.text = taskInput.value.trim();
        localStorage.setItem('lista-tareas', JSON.stringify(tasks));
        renderTasks();

    }

    // Función para eliminar una tarea
    function getTaskById(id) {
        //debugger;
        const task = tasks.filter(task => task.id == id);
        taskInputId.value = task[0].id;
        taskInput.value = task[0].text;
        renderTasks();
    }

    // Función para eliminar una tarea
    function removeTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        localStorage.setItem('lista-tareas', JSON.stringify(tasks));
    }

    // Función para eliminar una tarea
    function removeAllTask() {
        tasks = [];
        localStorage.setItem('lista-tareas', JSON.stringify(tasks));
        renderTasks();
    }

    // Función para alternar el estado completado de una tarea
    function toggleComplete(id) {
        tasks = tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        renderTasks();
    }
    // Función para renderizar la lista de tareas
    function renderTasks(filtro) {

        taskList.innerHTML = '';

        if (tasks.length > 0) {
            btnDeleteAll.style.display = 'block';
            filterInput.style.display = 'block';
        } else {
            btnDeleteAll.style.display = 'none';
            filterInput.style.display = 'none';
        }

        tasks.filter(task => !filtro || task.text.toLowerCase().includes(filtro.toLowerCase()))
            .forEach(task => {
                const li = document.createElement('li');
                li.textContent = task.text;
                li.dataset.id = task.id;
                if (task.completed) {
                    li.classList.add('completed');
                }
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Eliminar';
                deleteBtn.classList.add('delete-btn');
                deleteBtn.dataset.id = task.id;
                li.appendChild(deleteBtn);

                const editBtn = document.createElement('button');
                editBtn.textContent = 'Editar';
                editBtn.classList.add('delete-edit');
                editBtn.dataset.id = task.id;

                li.appendChild(editBtn);
                li.appendChild(deleteBtn);

                taskList.appendChild(li);
            });
    }
});