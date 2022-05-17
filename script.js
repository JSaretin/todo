const getTodos = () => JSON.parse(localStorage.getItem("todos") || "[]");

const updateTodos = (todos) => {
  localStorage.setItem("todos", JSON.stringify(todos));
  return todos;
};

const setButtonsStatus = (todo, btn) => {
  btn.value = todo.done ? "❌" : "✅";
  btn.title = todo.done ? "Undone" : "Done";
};

const todoIsCompleted = (todo, todoHtml) => {
  todoHtml.style.background = todo.done ? "rgba(10, 189, 164, 0.92)" : "";
  btns = todoHtml.querySelectorAll("input");
  //btns[1].style.opacity = todo.done ? '0' : '1'
  btns[1].style.visibility = todo.done ? "hidden" : "visible";
  setButtonsStatus(todo, btns[0]);
};

const createTodoElement = (todoInfo) => {
  const content = `
        <p>${todoInfo.title}</p>
        <div class="option">
            <input type="button" value="✅" title="Done">
            <input type="button" value="🖋️" title="Done">
            <input type="button" value="💩" title="delete">
        </div>
    `;
  const todo = document.createElement("div");
  todo.classList.add("todo");
  todo.id = `todo-${todoInfo.id}`;
  todo.innerHTML = content;

  const btns = todo.querySelectorAll("input");
  const btnDone = btns[0];
  const btnEdit = btns[1];
  const btnDelete = btns[2];

  todoIsCompleted(todoInfo, todo);
  return { todo, btnDone, btnEdit, btnDelete };
};

const toggleTodoDone = (todo) => {
  const savedTodos = getTodos();

  const newTodos = savedTodos.reduce((tds, t) => {
    if (t.id == todo.id) {
      t.done = !t.done;
      todo.done = t.done;
      return [...tds, t];
    }
    return [...tds, t];
  }, []);

  todos = updateTodos(newTodos);
  return todo;
};

const handleDeleteBtn = (todo) => {
  const savedTodos = getTodos();

  const newTodos = savedTodos.reduce((tds, td) => {
    document.getElementById(`todo-${td.id}`).remove();

    if (td.id == todo.id) {
      return tds;
    }
    td.id = tds.length + 1;
    insertTodo(td);
    return [...tds, td];
  }, []);

  todos = updateTodos(newTodos);
};

const saveFromPtag = (p, todo, btnEdit) => {
  p.contentEditable = "inherit";
  btnEdit.style.background = "";

  const newContent = p.innerText;
  if (newContent == "") {
    handleDeleteBtn(todo);
    return;
  }

  const newTodos = getTodos().reduce((tds, td) => {
    if (td.id == todo.id) {
      td.title = newContent;
    }

    return [...tds, td];
  }, []);

  todos = updateTodos(newTodos);
};

const searchForm = document.getElementById("todo");
const todoInput = document.getElementById("todo-input");
const overlay = document.getElementById("overlay");
const todosContainer = document.getElementById("todos");

let todos = getTodos();

searchForm.onsubmit = (e) => {
  e.preventDefault();
  if (todoInput.value.replaceAll(" ", "") == "") return;
  todos = updateTodos([
    ...todos,
    { title: todoInput.value, id: todos.length + 1, done: false },
  ]);
  todoInput.value = "";

  const newTodo = todos.at(-1);
  insertTodo(newTodo);
};

todoInput.onfocus = () => (overlay.style.height = "100%");
overlay.onclick = () => (overlay.style.height = "0%");

const insertTodo = (todo) => {
  const {
    todo: todoElement,
    btnDone,
    btnEdit,
    btnDelete,
  } = createTodoElement(todo);

  btnDone.onclick = () => {
    const p = todoElement.querySelector("p");
    if (p.contentEditable === "true") {
      saveFromPtag(p, todo, btnEdit);
    }

    todo = toggleTodoDone(todo);
    todoIsCompleted(todo, todoElement);
  };
  btnDelete.onclick = () => handleDeleteBtn(todo);

  btnEdit.onclick = () => {
    const p = todoElement.querySelector("p");
    if (p.contentEditable == "inherit") {
      p.contentEditable = "true";
      p.click();
      p.focus();
      btnEdit.style.background = "tomato";
    } else {
      saveFromPtag(p, todo, btnEdit);
    }

    //p.click()
  };

  todosContainer.prepend(todoElement);
};

todos.map(insertTodo);
