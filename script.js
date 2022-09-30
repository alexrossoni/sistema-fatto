const taskInput = document.querySelector('#task-input');
const priceInput = document.querySelector('#price-input');
const dateInput = document.querySelector('#date-input');
const saveEditBtn = document.querySelector('#edit-save-btn');
const popupTask = document.querySelector('.popup-edit-container');
const tableBody = document.querySelector('tbody');
const deletePopup = document.querySelector('.delete-task-container');
const yesDeleteBtn = document.querySelector('#delete-popup-yes');
const noDeleteBtn = document.querySelector('#delete-popup-no');

let tasks
let id

const getTasksLS = () => JSON.parse(localStorage.getItem('localStorageData')) ?? [];
const setTasksLS = () => localStorage.setItem('localStorageData', JSON.stringify(tasks));

const loadTasks = () => {
  tasks = getTasksLS();
  tableBody.innerHTML = "";
  tasks.forEach((task, index) => {
    putTask(task, index);
  });
}

const putTask = (task, index) => {
  const tableRow = document.createElement('tr');
  tableRow.innerHTML = `
    <td class="nameCollum">${task.name}</td>
    <td class="priceCollum">${task.price}</td>
    <td class="dateCollum">${task.date}</td>
    <td class="act">
      <img src="./assets/icons/edit-icon.svg" alt="Edit task" onclick="editTask(${index})">
    </td>
    <td class="act">
      <img src="./assets/icons/delete-icon.svg" alt="Delete task" onclick="deleteTask(${index})">
    </td>
  `
  tableBody.appendChild(tableRow);
}

// function deleteTask(index) {
//   tasks.splice(index, 1);
//   setTasksLS();
//   loadTasks();
// }

function deleteTask(index) {
  showDeletePopup(index);
}

function showDeletePopup(index) {
  deletePopup.classList.add('active');
  id = index;

  deletePopup.addEventListener('click', function (event) {
    if (event.target.className.indexOf('delete-task-container') !== -1) {
      deletePopup.classList.remove('active');
    }
  });

}

noDeleteBtn.addEventListener('click', () => {
  deletePopup.classList.remove('active');
});

yesDeleteBtn.addEventListener('click', (event) => {
  tasks.splice(id, 1);
  deletePopup.classList.remove('active');
  setTasksLS();
  loadTasks();
  event.preventDefault();
});

function editTask(index) {
  showTaskPopup(true, index);
}

const showTaskPopup = (edit = false, index = 0) => {
  popupTask.classList.add('active');

  popupTask.addEventListener('click', function(event) {
    if (event.target.className.indexOf('popup-edit-container') !== -1) {
      popupTask.classList.remove('active');
    }
  })
  
    if (edit) {
      taskInput.value = tasks[index].name;
      priceInput.value = tasks[index].price;
      dateInput.value = tasks[index].date;
      id = index
    } else {
      taskInput.value = '';
      priceInput.value = '';
      dateInput.value = '';
    }
    
  }

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
      tasks.push({'name': taskInput.value, 'price': priceInput.value, 'date': dateInput.value})
    }
  
    setTasksLS()
  
    popupTask.classList.remove('active')
    loadTasks()
    id = undefined
  });

  loadTasks();