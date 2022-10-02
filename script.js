const taskInput = document.querySelector('#task-input');
const priceInput = document.querySelector('#price-input');
const dateInput = document.querySelector('#date-input');
const saveEditBtn = document.querySelector('#edit-save-btn');
const popupTask = document.querySelector('.popup-edit-container');
const tableBody = document.querySelector('tbody');
const deletePopup = document.querySelector('.delete-task-container');
const yesDeleteBtn = document.querySelector('#delete-popup-yes');
const noDeleteBtn = document.querySelector('#delete-popup-no');

let tasks;
let id;
let taskKey = '';
let charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!';

const getTasksLS = () => JSON.parse(localStorage.getItem('Tarefas')) ?? [];

const setTasksLS = () => localStorage.setItem('Tarefas', JSON.stringify(tasks));

function generateKey(){

  let genKey = '';
  for(let i = 0, n = charset.length; i < 5; ++i){
    genKey += charset.charAt(Math.floor(Math.random() * n));
  }

  taskKey = genKey;
};

const loadTasks = () => {
  tasks = getTasksLS();
  tableBody.innerHTML = "";
  tasks.forEach((task, index) => {
    putTask(task, index);
  });
};

const putTask = (task, index) => {
  const tableRow = document.createElement('tr');

  function createElements() {
    tableRow.innerHTML = `
    <td>${task.key}</td>
    <td>${task.name}</td>
    <td>${task.price}</td>
    <td>${task.date}</td>
    <td class="act">
      <img src="./assets/icons/edit-icon.svg" alt="Edit task" onclick="editTask(${index})">
    </td>
    <td class="act">
      <img src="./assets/icons/delete-icon.svg" alt="Delete task" onclick="deleteTask(${index})">
    </td>
    `
    tableRow.setAttribute('data-id', `${task.key}`)
    tableBody.appendChild(tableRow);
  }

  if (task.price >= 1000) {
    createElements();
    tableRow.classList.add('importantRow');
  } else {
    createElements();
  }
};

function deleteTask(index) {
  showDeletePopup(index);
};

function showDeletePopup(index) {
  deletePopup.classList.add('active');
  id = index;

  deletePopup.addEventListener('click', function (event) {
    if (event.target.className.indexOf('delete-task-container') !== -1) {
      deletePopup.classList.remove('active');
    }
  });

};

function editTask(index) {
  showTaskPopup(true, index);
};

const showTaskPopup = (edit = false, index = 0) => {
  popupTask.classList.add('active');

  popupTask.addEventListener('click', function(event) {
    if (event.target.className.indexOf('popup-edit-container') !== -1) {
      popupTask.classList.remove('active');
      id = undefined;
    }
  })
  
    if (edit) {
      id = index
      taskInput.value = tasks[index].name;
      priceInput.value = tasks[index].price;
      dateInput.value = tasks[index].date;
    } else {
      taskInput.value = '';
      priceInput.value = '';
      dateInput.value = '';
    }
    
  };

  const sortableTasks = Sortable.create (tableBody, {
    animation: 300,

    group: "tasksOrder",

    store: {
      set: function(sortable){
        const order = sortable.toArray();
        localStorage.setItem('tasksOrder', order.join('|'));
      },
  
      get: function(){
        const order = localStorage.getItem('tasksOrder');
        return order ? order.split('|') : [];
      }
    }
  });

  loadTasks();

  //Events

  noDeleteBtn.addEventListener('click', () => {
    deletePopup.classList.remove('active');
  });
  
  yesDeleteBtn.addEventListener('click', (event) => {
    tasks.splice(id, 1);
    deletePopup.classList.remove('active');
    setTasksLS();
    loadTasks();
    event.preventDefault();
    id = undefined;
  });

  saveEditBtn.addEventListener('click', (event) => {
    if (taskInput.value == '' || priceInput.value == '' || dateInput.value == '') {
      return
    }
  
    event.preventDefault();
  
    if (id !== undefined) {
      tasks[id].name = taskInput.value
      tasks[id].price = priceInput.value
      tasks[id].date = dateInput.value
    } else {
      generateKey();
      tasks.push({
        'name': taskInput.value, 
        'price': priceInput.value, 
        'date': dateInput.value,
        'key': taskKey
      });
    }
    
    setTasksLS()
    
    popupTask.classList.remove('active')
    loadTasks()
    id = undefined
    taskKey = '';
  });