var allDone = {};
var queue;
window.onload = function () {
var list = new Sortable(document.getElementsByClassName("collection")[0]);
var todolist = [{id:1272, text:"do something crazy", done:true}, {id:1288, text:"make me happy", done:false}, {id:3272, text:"kill myself", done:false}];
var todomother = document.getElementsByClassName("collection")[0];
queue = [];
var hidden = [];
var countTodo = 0;
var countDone = 0;
var lastSort = document.getElementsByClassName("sort")[0]; lastSort.classList.toggle("sort-active");


function makeDoneTodo () {
  var id = parseInt(this.id.split("toggle-")[1]);
  var h4 = this.parentElement.children[1];
  var child = this.children[0];
  if (this.classList.contains("load-complete")) {
    allDone[id] = [this.parentElement, false];
    this.parentElement.classList.remove("completed");
    this.classList.remove("load-complete");
    queue.push({event:"done", done: false, id: id});
    h4.classList.remove("cross");
    child.style.display = "none";
    this.parentElement.done = "false";
    countTodo += 1;
    countDone -=1;
  } else {
    allDone[id] = [this.parentElement, true];
    this.classList.add("load-complete");
    this.parentElement.classList.add("completed");
    queue.push({event:"done", done: true, id: id});
    h4.classList.add("cross");
    child.style.display = "block";
    this.parentElement.done = "true";
    countTodo -=1;
    countDone +=1;
  }
  countChange();
}

function alreadyDone () {
  var id = parseInt(this.id.split("toggle-")[1]);
  var h4 = this.parentElement.children[1];
  var child = this.children[0];
  if (this.classList.contains("load-complete")) {
    this.classList.remove("load-complete");
    h4.classList.remove("cross");
    child.style.display = "none";
    this.parentElement.done = "false";
    countTodo += 1;
    countDone -=1;
  } else {
    this.classList.add("load-complete");
    this.parentElement.classList.add("completed");
    h4.classList.add("cross");
    child.style.display = "block";
    this.parentElement.done = "true";
    allDone[id] = [this.parentElement, true];
    countTodo -=1;
    countDone +=1;
  }
  countChange();
}

function deleteTodo () {
  var id = parseInt(this.id.split("delete-")[1]);
  todomother.removeChild(document.getElementById("li-" + id));
  queue.push({event:"remove", id: id});
  if (!this.parentElement.children[0].classList.contains("load-complete")) {countTodo -= 1; countChange();}
}

function deleteAll() {
  for (todo in allDone) {
    if (allDone[todo][1]) allDone[todo][0].children[2].click();
    delete allDone[todo];
  }
}

function addTodoElement (todo, pusher) {
  countTodo += 1;
  countChange();
  if (!pusher) {document.getElementsByClassName("toggle-all")[0].checked = true;}
  var todostring = `<div class="todo" id="${todo.id}">
      <div class="circle-loader checkbox" id="toggle-${todo.id}">
        <div class="checkmark draw"></div>
      </div>
      <h4 id="name-${todo.id}">${todo.text}</h4>
      <div class="delete" id="delete-${todo.id}">&times;</div>
    </div>`;
  var li = document.createElement("li");
  li.id = "li-" + todo.id;
  li.innerHTML = todostring;
  if (todomother.firstChild) {
    todomother.insertBefore(li, todomother.firstChild);
  } else {
    todomother.append(li);
  }
  var toggle = li.children[0].children[0];
  toggle.onclick = makeDoneTodo;
  if (todo.done) {toggle.done = alreadyDone; toggle.done();}
  var del = li.children[0].children[2];
  del.onclick = deleteTodo;
  if (pusher) {
    queue.push ({event:"create", todo:todo})
  }
}
document.getElementsByClassName("remover")[0].onclick = deleteAll;
todolist.forEach(addTodoElement);
var addData;
document.addEventListener('keydown', function(event) {
  if (event.key === "Enter") {
    var cont, todo;
    cont = getTodo();
    if (cont) {
      addTodoElement(addData, true);
    }
  }
});

document.getElementsByClassName("toggle-all")[0].onclick = function () {
  if (this.checked) {
    hidden.forEach(function (elem) {todomother.append(elem)});
    hidden = [];
} else {
  while (todomother.firstChild) {
    hidden.push(todomother.firstChild);
    todomother.removeChild(todomother.firstChild);
  }
}}

function getTodo () {
  var inp = document.getElementById("main-input");
  var text = inp.value;
  text = text.replace(/ +/g, ' ').trim();
  if (text.length > 2) {
    inp.value = "";
    addData = {text: text, id : Math.floor(Math.random() * (1000000000 - 1 + 1)) + 1, done:false}
    return true;
  } else {return false, false}
}

function countChange () {
  document.getElementsByClassName("footer")[0].children[0].innerText = `${countTodo} items left`;
}

var sort = document.getElementsByClassName("sort");
for (var i = 0; i < sort.length; i++) {
  sort[i].onclick = function (obj) {
    var todolist = document.getElementsByClassName("todo");
    lastSort.classList.toggle("sort-active");
    lastSort = obj.toElement;
    lastSort.classList.toggle("sort-active");
    if (obj.toElement.classList.contains("active")) {
      for (var i = 0; i < todolist.length; i++) {
        if (todolist[i].classList.contains("completed")) {
          todolist[i].style.display = "none";
        } else {todolist[i].style.display = "block";}
      };
    }
    else if (obj.toElement.classList.contains("done")) {
      for (var i = 0; i < todolist.length; i++) {
        if (todolist[i].classList.contains("completed")) {
          todolist[i].style.display = "block";
        } else {todolist[i].style.display = "none";}
      };
    }
    else for (var i = 0; i < todolist.length; i++) todolist[i].style.display = "block";
  };
};
};
