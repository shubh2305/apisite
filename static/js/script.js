
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}
const csrftoken = getCookie('csrftoken');

let foundTask = null;

const buildList = () => {
  let wrapper = document.getElementById("list-wrapper");
  wrapper.innerHTML = '';
  let url = 'http://localhost:8000/api/task-list/'

  fetch(url)
  .then((res) => res.json())
  .then((data) => {
    let list = data;
    list.forEach(task => {
      let isChecked = task.completed ? "checked" : ""
      let textDecoration = task.completed && 'text-decoration: line-through'
      let item = `
        <div class="task-${task.id}">
          <div class="task-list">
            <input type="checkbox" ${isChecked}>
            <p>${task.title}</p>
            <div class="edit-and-delete">
              <button class="btn btn-outline-primary" id="${task.id}">Edit</button>
              <button class="btn btn-outline-danger delete" id="${task.id}">X</button>
            </div>
          </div>
        </div>   
      `
      wrapper.innerHTML += item
    });

    var editButtonsList = document.querySelectorAll(".btn-outline-primary");

    Array.from(editButtonsList).forEach(button => {
      button.addEventListener('click', () => {
        let taskId = button.id;
        foundTask = list.find(task => {
          return task.id == taskId;
        })
        editTask(foundTask)
      })
    })

    var deleteButtonsList = document.querySelectorAll(".delete");

    Array.from(deleteButtonsList).forEach(button => {
      button.addEventListener('click', () => {
        let taskId = button.id;
        foundTask = list.find(task => {
          return task.id == taskId;
        })
        deleteTask(foundTask)
      })
    })
  })
  
}

buildList()


let form = document.getElementById("form-group");
form.addEventListener('submit', (e) => {
  e.preventDefault();
  let title = document.getElementById("title").value;

  let url = 'http://localhost:8000/api/task-create/';

  if(foundTask != null) {
    url = `http://localhost:8000/api/task-update/${foundTask.id}/`
    foundTask = null;
  }

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-type':'application/json',
      'X-CSRFToken': csrftoken
    },
    body: JSON.stringify({'title': title})
  })
  .then((res) => {
    buildList()
    document.getElementById("form-group").reset();
  })
})

const editTask = (foundTask) => {
  document.getElementById('title').value = foundTask.title
}

const deleteTask = (foundTask) => {
  var url = `http://localhost:8000/api/task-delete/${foundTask.id}/`;

  fetch(url, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      'X-CSRFToken': csrftoken
    }
  })
  .then((res) => {
    buildList()
  })
}

function strike(task) {
  if(task.completed) {
    
  }
}




