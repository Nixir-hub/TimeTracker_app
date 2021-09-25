const apiKey = "64dc9a0c-d02c-41bb-a276-19b7a698222b";
const apiHost = 'https://todo-api.coderslab.pl';

document.addEventListener('DOMContentLoaded', function() {
  apiListTasks().then(
    function(response) {
      response.data.forEach(
        function(task) { renderTask(task.id, task.title, task.description, task.status); }
      );
    }
  );
});
function apiListTasks() {
  return fetch(
    apiHost + '/api/tasks',
    {
      headers: { Authorization: apiKey }
    }
  ).then(
    function(resp) {
      if(!resp.ok) {
        alert('Ups Error! Open devtools, go to Network and find reason of Error!');
      }
      return resp.json();}
  )}
apiListTasks().then(
  function(response) {
     console.log('Server return', response.data.length, 'zadań');

    console.log('1st title is ', response.data[0].title);
  }
);

function apiCreateTask(title, description) {
  return fetch(
    apiHost + '/api/tasks',
    {
      headers: { Authorization: apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title, description: description, status: 'open' }),
      method: 'POST'
    }
  ).then(
    function(resp) {
      if(!resp.ok) {
        alert('Ups Error! Open devtools, go to Network and find reason of Error!');
      }
      return resp.json();
    }
  )
}
function renderTask(taskId, title, description, status) {
//show list of tasks
    console.log('Zadanie o id =', taskId);
    console.log('tytuł to:', title);
    console.log('opis to:', description);
    console.log('status to:', status);
    const section = document.createElement('section');
    section.className = 'card mt-5 shadow-sm';
    document.querySelector('main').appendChild(section);

    const headerDiv = document.createElement('div');
    headerDiv.className = 'card-header d-flex justify-content-between align-items-center';
    section.appendChild(headerDiv);

    const headerLeftDiv = document.createElement('div');
    headerDiv.appendChild(headerLeftDiv);

    const h5 = document.createElement('h5');
    h5.innerText = title;
    headerLeftDiv.appendChild(h5);

    const h6 = document.createElement('h6');
    h6.className = 'card-subtitle text-muted';
    h6.innerText = description;
    headerLeftDiv.appendChild(h6);

    const headerRightDiv = document.createElement('div');
    headerDiv.appendChild(headerRightDiv);

    if (status === 'open') {
        const finishButton = document.createElement('button');
        finishButton.className = 'btn btn-dark btn-sm js-task-open-only';
        finishButton.innerText = 'Finish';
        headerRightDiv.appendChild(finishButton);
        finishButton.addEventListener('click', function() {
        apiUpdateTask(taskId, title, description, 'closed');
        section.querySelectorAll('.js-task-open-only').forEach(
        function(element) { element.parentElement.removeChild(element); }
  );

});
    }

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-outline-danger btn-sm ml-2';
    deleteButton.innerText = 'Delete';
    headerRightDiv.appendChild(deleteButton);
    deleteButton.addEventListener('click', function () {
        apiDeleteTask(taskId).then(
            function () {
                section.parentElement.removeChild(section);
            }
        );

    });


    const ul = document.createElement('ul');
    ul.className = "list-group list-group-flush"
    section.appendChild(ul);

    apiListOperationsForTask(taskId).then(
        function (response) {
            response.data.forEach(
                function (operation) {
                    renderOperation(ul, status, operation.id, operation.description, operation.timeSpent);
                }
            );
        }
    );

    function apiListOperationsForTask(taskId) {
        //show all operations
        return fetch(apiHost + `/api/tasks/`+ taskId +`/operations`,
            {headers: {'Authorization': apiKey}}
        ).then(
            function (resp) {
                if (!resp.ok) {
                    alert('Ups Error! Open devtools, go to Network and find reason of Error!');
                }
                return resp.json();
            }
        );
    }


    const inUlLi = document.createElement("li");
    inUlLi.className = "list-group-item d-flex justify-content-between align-items-center"
    ul.appendChild(inUlLi)


    const inLiSpan = document.createElement("span")
    inLiSpan.innerText = "Description, Time to realize task"
    inUlLi.appendChild(inLiSpan)
    const divLiBtn = document.createElement("div")
    inUlLi.appendChild(divLiBtn)
    const formDiv = document.createElement("div");
    formDiv.className = 'card-body';
    section.appendChild(formDiv);

    const form = document.createElement('form');
    form.id = "formToAdd"
    formDiv.appendChild(form)


    const inFormDiv = document.createElement("div")
    inFormDiv.className = "input-group"
    form.appendChild(inFormDiv)

    const inputForm = document.createElement("input")
    inputForm.type = "text"
    inputForm.placeholder = "Operation description"
    inputForm.className = "form-control"
    inputForm.minLength = "5"
    inFormDiv.appendChild(inputForm)

    const inEndFormDiv = document.createElement("div")
    inEndFormDiv.className = "input-group-append"
    inFormDiv.appendChild(inEndFormDiv)


    const addButton = document.createElement('button');
    addButton.className = "btn btn-info";
    addButton.innerText = 'Add';
    inEndFormDiv.appendChild(addButton);


    form.addEventListener("submit", function (event) {
        event.preventDefault()
        apiCreateOperationFotTask(taskId, inputForm).then(
            function (response) {
                renderOperation(ul, status, response.data.id, response.data.description, response.data.timeSpent);
            }
        );
    })


    function renderOperation(operationsList, status, operationId, operationDescription, timeSpent) {

        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        operationsList.parentElement.appendChild(li);

        const descriptionDiv = document.createElement('div');
        descriptionDiv.innerText = operationDescription;
        li.appendChild(descriptionDiv);

        const time = document.createElement('span');
        time.className = 'badge badge-success badge-pill ml-2';
        time.innerText = timeSpent + 'm';
        descriptionDiv.appendChild(time);

        if (status === "open") {
            const controlDiv = document.createElement('div');
            controlDiv.className = 'js-task-open-only';
            li.appendChild(controlDiv);

            const buttonAdd15 = document.createElement("button")
            buttonAdd15.className = "btn btn-outline-success btn-sm mr-2"
            buttonAdd15.innerText = "Add 15min"
            controlDiv.appendChild(buttonAdd15)
            const buttonAdd1H = document.createElement("button")
            buttonAdd1H.className = "btn btn-outline-success btn-sm mr-2"
            buttonAdd1H.innerText = "Add 1H"
            controlDiv.appendChild(buttonAdd1H)
            const buttonDelete = document.createElement("button")
            buttonDelete.className = "btn btn-outline-danger btn-sm"
            buttonDelete.innerText = "Delete"
            controlDiv.appendChild(buttonDelete)
            buttonAdd15.addEventListener('click', function() {
            apiUpdateOperation(operationId, operationDescription, timeSpent + 15).then(
            function(response) {
            time.innerText = formatTime(response.data.timeSpent);
            timeSpent = response.data.timeSpent;
    }
  );
});
            buttonAdd1H.addEventListener('click', function() {
            apiUpdateOperation(operationId, operationDescription, timeSpent + 60).then(
            function(response) {
            time.innerText = formatTime(response.data.timeSpent);
            timeSpent = response.data.timeSpent;
    }
  );
});


            buttonDelete.addEventListener('click', function() {
  apiDeleteOperation(operationId).then(
    function() { li.parentElement.removeChild(li); }
  );
});
}

        const mainFormInput = document.querySelector("form")
        mainFormInput.children[2].type = "button"
        mainFormInput.children[2].addEventListener("click", function (event) {
            event.stopImmediatePropagation()
            const title = mainFormInput.children[0].children[0].value
            const description = mainFormInput.children[1].children[0].value
            apiCreateTask(title, description)
        })
    }

    function formatTime(timeSpent) {
        //set timer
        const hours = Math.floor(timeSpent / 60);
        const minutes = timeSpent % 60;
        if (hours > 0) {
            return hours + 'h ' + minutes + 'm';
        } else {
            return minutes + 'm';
        }
    }

    function apiDeleteTask(taskId) {
        //delete task from lisdt
        return fetch(
            apiHost + '/api/tasks/' + taskId,
            {
                headers: {Authorization: apiKey},
                method: 'DELETE'
            }
        ).then(
            function (resp) {
                if (!resp.ok) {
                    alert('Ups Error! Open devtools, go to Network and find reason of Error!');
                }
                return resp.json();
            }
        )
    }

    function apiCreateOperationFotTask(taskId, description) {
        //add new task to list
        return fetch(
            apiHost + '/api/task/' + taskId + '/operations',
            {
                headers: {Authorization: apiKey, 'Content-Type': 'application/json'},
                body: JSON.stringify({description: description, timeSpent: 0}),
                method: 'POST'
            }
        ).then(
            function (resp) {
                if (!resp.ok) {
                    alert('Ups Error! Open devtools, go to Network and find reason of Error!');
                }
                return resp.json();
            }
        )
    }
}
function apiDeleteOperation(operationId) {
    //delete chosen operation in task
  return fetch(
    apiHost + '/api/operations/' + operationId,
    {
      headers: { Authorization: apiKey },
      method: 'DELETE'
    }
  ).then(
    function (resp) {
      if(!resp.ok) {
        alert('Ups Error! Open devtools, go to Network and find reason of Error!');
      }
      return resp.json();
    }
  )
}
function apiUpdateTask(taskId, title, description, status) {
  //Ends edit possibility for task
    return fetch(
    apiHost + '/api/tasks/' + taskId,
    {
      headers: { Authorization: apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title, description: description, status: status }),
      method: 'PUT'
    }
  ).then(
    function (resp) {
      if(!resp.ok) {
        alert('Ups Error! Open devtools, go to Network and find reason of Error!');
      }
      return resp.json();
    }
  );
}
function apiUpdateOperation(operationId, description, timeSpent) {
  //Add time to clock 15min or 1h
  return fetch(
    apiHost + '/api/operations/' + operationId,
    {
      headers: { Authorization: apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: description, timeSpent: timeSpent }),
      method: 'PUT'
    }
  ).then(
    function (resp) {
      if(!resp.ok) {
        alert('Ups Error! Open devtools, go to Network and find reason of Error!');
      }
      return resp.json();
    }
  );
}

