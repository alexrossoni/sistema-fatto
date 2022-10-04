const tableBody = document.querySelector('tbody');
const taskInput = document.querySelector('#task-input');
const priceInput = document.querySelector('#price-input');
const dateInput = document.querySelector('#date-input');
const popupTask = document.querySelector('.popup-edit-container');
const deletePopup = document.querySelector('.delete-task-container');
const verifyNamePopup = document.querySelector('.verify-name-container');
const verifyFieldsPopup = document.querySelector('.verify-fields-container');
const saveEditBtn = document.querySelector('#edit-save-btn');
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

const updateTasks = () => {
  const htmlTasks = document.getElementsByTagName('tr');
  tasks = [];
  for (let i = 1; i < htmlTasks.length; i++) {
    htmlTask = htmlTasks[i];
    keyValue = htmlTask.querySelector('#keyValue').innerText;
    nameValue = htmlTask.querySelector('#nameValue').innerText;
    priceValue = (htmlTask.querySelector('#priceValue').innerText).split(',').join('.');
    dateValue = (htmlTask.querySelector('#dateValue').innerText).split('/').reverse().join('-');
    tasks.push({
      'name': nameValue, 
      'price': priceValue, 
      'date': dateValue,
      'key': keyValue
    });
    setTasksLS();
}
};

const putTask = (task, index) => {
  const tableRow = document.createElement('tr');

  function createElements() {
    tableRow.innerHTML = `
    <td id="keyValue">${task.key}</td>
    <td id="nameValue">${task.name}</td>
    <td id="priceValue">${(task.price).split('.').join(',')}</td>
    <td id="dateValue">${(task.date).split('-').reverse().join('/')}</td>
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
  });
  
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

    onEnd: () => {
      updateTasks()
      loadTasks()
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
    event.preventDefault();
    let taskNameInput = taskInput.value;
    let findName = false;

    function verifyNameExist(taskNameInput){
      let copyTasks = tasks.slice();
      if (id !== undefined){
        copyTasks.splice(id, 1);
        for(var index = 0, n = copyTasks.length; index < n; index++){
          let task = copyTasks[index];
          if(task.name == taskNameInput){
              findName = true;
              break;
          }
        }
      } else {
        for(var index = 0, n = copyTasks.length; index < n; index++){
          let task = copyTasks[index];
          if(task.name == taskNameInput){
              findName = true;
              break;
          }
        }
      }
    };

    if (taskInput.value == '' || priceInput.value == '' || priceInput.value < 0 || dateInput.value == '') {
      verifyFieldsPopup.classList.add('active');
      verifyFieldsPopup.addEventListener('click', function(event) {
        if (event.target.className.indexOf('verify-fields-container') !== -1) {
          verifyFieldsPopup.classList.remove('active');
        }
      });
      return
    } else {
      verifyNameExist(taskNameInput)
    }
  
    if (findName) {
      verifyNamePopup.classList.add('active');
      verifyNamePopup.addEventListener('click', function(event) {
        if (event.target.className.indexOf('verify-name-container') !== -1) {
          verifyNamePopup.classList.remove('active');
        }
      });
      findName = false;
      return
    } else {
      if (id !== undefined) {
        tasks[id].name = taskInput.value
        tasks[id].price = Number(priceInput.value).toFixed(2)
        tasks[id].date = dateInput.value
      } else {
        generateKey();
        tasks.push({
          'name': taskInput.value, 
          'price': Number(priceInput.value).toFixed(2),
          'date': dateInput.value,
          'key': taskKey
        });
      }
    }

    setTasksLS()
    loadTasks()
    popupTask.classList.remove('active')
    id = undefined
    taskKey = '';
  });